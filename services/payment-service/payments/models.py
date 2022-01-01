import uuid
from django.db import models
from phonenumber_field.modelfields import PhoneNumberField


class Receipt(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payment_id = models.CharField(max_length=250, null=True, blank=True)
    payment_source = models.CharField(max_length=100, null=True, blank=True)
    type = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=18, decimal_places=2)
    currency = models.CharField(max_length=3)
    paid = models.BooleanField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    customer = models.ForeignKey('Customer', on_delete=models.CASCADE)


class Customer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(null=False, blank=False)
    phone_number = PhoneNumberField(null=False, blank=False)
