from django.http import JsonResponse
from django.http.response import HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .messaging.producer import publish_payment_created_event
from .mixins import PaymentMethod, PaymentType
from .models import Customer, Receipt
from .serializers import ReceiptSerializer
from .services import ExchangeRatesService

accepted_currency = 'USD'


def get_client_secret(request):
    payment_method = PaymentMethod.create(
        PaymentType[str.upper(request.GET['type'])])

    exchange_rate_service = ExchangeRatesService()

    amount = exchange_rate_service.get_amount(
        request.GET['currency'], accepted_currency, float(request.GET['amount']))

    client_secret = payment_method.get_client_secret(
        amount=amount,
        currency=accepted_currency,
        payment_method_types=request.GET['payment_method_types'].split(',')
    )

    return JsonResponse({'client_secret': client_secret}, status=status.HTTP_200_OK)


class ReceiptList(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.exchange_rate_service = ExchangeRatesService()

    def post(self, request):
        payment_data = request.data['payment']
        customer_data = request.data['customer']

        # exchange to accepted currency
        amount = self.exchange_rate_service.get_amount(
            payment_data['currency'], accepted_currency, payment_data['amount'])

        # call payment method api and charge
        payment_id, paid = self.charge(type=payment_data['type'], source=payment_data['source'],
                                       amount=amount, currency=accepted_currency,
                                       receipt_email=customer_data['email'])

        customer, _ = Customer.objects.get_or_create(**customer_data)
        # create serializer
        serializer = ReceiptSerializer(
            data={'customer': customer.id, 'payment_id': payment_id, 'paid': paid, **payment_data})

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        self.publish_integration_event(serializer.data, request.data['orders'])
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def charge(self, **kwargs):
        payment_method = PaymentMethod().create(
            PaymentType[str.upper(kwargs.pop('type'))])
        return payment_method.charge(**kwargs)

    def publish_integration_event(self, receipt, orders):
        receipt = {"id": receipt.get('id'), "amount": receipt.get(
            'amount'), "currency": receipt.get('currency')}
        # publish integration event to rabbitmq
        publish_payment_created_event(
            'payment.success', {'receipt': receipt, 'orders': orders})


class ReceiptDetail(APIView):
    def get_object(self, pk) -> Receipt:
        try:
            return Receipt.objects.get(pk=pk)
        except Receipt.DoesNotExist:
            return HttpResponse(status=404)

    def get(self, request, pk):
        receipt = self.get_object(pk)

        payment_method = PaymentMethod().create(
            PaymentType[str.upper(receipt.type)])

        payment_method.refund(payment_id=receipt.payment_id,
                              amount=int(receipt.amount))

        return Response(status=status.HTTP_204_NO_CONTENT)
