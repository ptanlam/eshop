from .services import PaymentsService
import payments_pb2_grpc


def grpc_handler(server):
    payments_pb2_grpc.add_PaymentsServiceServicer_to_server(
        PaymentsService.as_servicer(), server)
