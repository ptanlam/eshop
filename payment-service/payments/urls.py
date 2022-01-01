from django.urls import path
from .views import ReceiptDetail, ReceiptList, get_client_secret

urlpatterns = [
    path('receipts/', ReceiptList.as_view(), name='payment_list'),
    path('receipts/<str:pk>/', ReceiptDetail.as_view(), name='payment_detail'),
    path('client-secrets', get_client_secret)
]
