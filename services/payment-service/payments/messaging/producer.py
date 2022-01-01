import json
import pika
from pika.credentials import PlainCredentials
from django.conf import settings

from payments.custom_encoder import CustomEncoder

connection = pika.BlockingConnection(pika.ConnectionParameters(
    host=settings.RABBIT_MQ_URI, port=5672,
    virtual_host=settings.RABBIT_VIRTUAL_HOST,
    heartbeat=600, blocked_connection_timeout=300,
    credentials=PlainCredentials(username=settings.RABBIT_MQ_USER,
                                 password=settings.RABBIT_MQ_PASSWORD)))

channel = connection.channel()
channel.exchange_declare(exchange='payment', exchange_type='topic')
channel.queue_declare('payment.success.order')
channel.queue_bind(queue='payment.success.order',
                   exchange='payment', routing_key='')


def publish_payment_created_event(method, body):
    properties = pika.BasicProperties(method)

    message = {
        'message': body,
        "messageType": [
            "urn:message:OrderingService.Messaging.IntegrationEvents:PaymentCreatedIntegrationEvent"
        ]
    }
    channel.basic_publish(exchange='payment',
                          routing_key='',
                          body=json.dumps(message, cls=CustomEncoder),
                          properties=properties)
