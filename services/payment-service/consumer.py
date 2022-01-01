import json
import pika
import django
from sys import path
from os import environ
from pika.credentials import PlainCredentials

path.append(
    f'{environ["PWD"]}/payment_service/settings.py')
environ.setdefault('DJANGO_SETTINGS_MODULE', 'payment_service.settings')
django.setup()

from django.conf import settings
from payments.mixins import PaymentMethod, PaymentType
from payments.views import accepted_currency
from payments.models import Receipt
from payments.services import ExchangeRatesService

connection = pika.BlockingConnection(pika.ConnectionParameters(
    host=settings.RABBIT_MQ_URI, port=5672,
    virtual_host=settings.RABBIT_VIRTUAL_HOST,
    heartbeat=600, blocked_connection_timeout=300,
    credentials=PlainCredentials(username=settings.RABBIT_MQ_USER,
                                 password=settings.RABBIT_MQ_PASSWORD)))

channel = connection.channel()
channel.queue_declare(queue='order.cancelled.payment', durable=True)


def on_order_cancelled_callback(ch, method, properties, body):
    data = json.loads(body)
    if not 'receiptId' in data['message']: return

    receipt = Receipt.objects.get(pk=data['message']['receiptId'])
    payment_method = PaymentMethod.create(PaymentType[str.upper(receipt.type)])
    
    exchange_rate_service = ExchangeRatesService()
    amount = exchange_rate_service.get_amount(
        receipt.currency, accepted_currency, receipt.amount)

    payment_method.refund(payment_id=receipt.payment_id,
                          amount=amount)


channel.basic_consume(
    queue='order.cancelled.payment',
    on_message_callback=on_order_cancelled_callback, auto_ack=True)
print("Started Consuming...")
channel.start_consuming()
