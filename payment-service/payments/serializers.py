from rest_framework import serializers
from .models import Receipt, Customer
from django_grpc_framework import proto_serializers
import payments_pb2


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'
        read_only_fields = ['id']


class ReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Receipt
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        return Receipt.objects.create(**validated_data)

    def update(self, instance, validated_data):
        pass


class ReceiptProtoSerializer(proto_serializers.ModelProtoSerializer):
    class Meta:
        model = Receipt
        proto_class = payments_pb2.GetReceiptForOrderResponse
        fields = ['id', 'amount', 'currency', 'type', 'paid']
