import math

import exchange_rates_pb2
import exchange_rates_pb2_grpc
import grpc
from django.conf import settings
from django_grpc_framework.services import Service

from .models import Receipt
from .serializers import ReceiptProtoSerializer


class PaymentsService(Service):
    def GetReceiptById(self, request, context):
        try:
            receipt = Receipt.objects.get(id=request.id)
        except Receipt.DoesNotExist:
            receipt = None

        serializer = ReceiptProtoSerializer(receipt)
        return serializer.message


class ExchangeRatesService:
    def get_amount(self, base: str, destination: str, amount: float):
        with grpc.insecure_channel(settings.EXCHANGE_RATE_GRPC_CONNECTION) as channel:
            client = exchange_rates_pb2_grpc.ExchangeRatesServiceStub(channel)

            response = client.GetAmount(exchange_rates_pb2.GetAmountRequest(
                base=base, destination=destination, amount=amount
            ))

            return math.floor(response.amount)
