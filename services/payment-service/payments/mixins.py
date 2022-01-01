import stripe
from abc import abstractmethod
from django.conf import settings
from enum import Enum

stripe.api_key = settings.STRIPE_SECRET_KEY


class PaymentType(Enum):
    PAYPAL = 1
    STRIPE = 2
    COD = 3


class PaymentMethod:
    @classmethod
    def create(cls, payment_method: PaymentType):
        if payment_method == PaymentType.PAYPAL:
            return Paypal()

        if payment_method == PaymentType.STRIPE:
            return Stripe()

        if payment_method == PaymentType.COD:
            return CashOnDelivery()

        return None

    @abstractmethod
    def charge(self, **kwargs):
        pass

    @abstractmethod
    def get_client_secret(self, **kwargs):
        pass

    @abstractmethod
    def refund(self, **kwargs):
        pass


class Stripe(PaymentMethod):
    def get_client_secret(self, amount, currency: str, payment_method_types):
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency=currency,
            payment_method_types=payment_method_types,
        )
        return intent.client_secret

    def charge(self, amount, currency, source, receipt_email):
        response = stripe.Charge.create(
            amount=amount * 100,
            currency=currency,
            source=f'tok_{source}',
            description=f'Payment for customer {receipt_email}',
            receipt_email=receipt_email,
        )

        return response.id, response.paid

    def refund(self, payment_id, amount):
        stripe.Refund.create(
            charge=payment_id,
            amount=amount,
        )


class Paypal(PaymentMethod):
    def charge(self, amount, currency, source, receipt_email):
        print(amount)
        stripe.Charge.create(
            amount=amount,
            currency=currency,
            source=source,
            description=f'Payment for customer {receipt_email}',
            receipt_email=receipt_email,
        )

        return '', True

    def refund(self, payment_id, amount):
        stripe.Refund.create(
            charge=payment_id,
            amount=amount,
        )


class CashOnDelivery(PaymentMethod):
    def charge(self, **kwargs):
        return None, False

    def refund(self, **kwargs):
        pass
