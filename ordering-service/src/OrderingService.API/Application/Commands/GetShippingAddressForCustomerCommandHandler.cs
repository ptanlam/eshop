using Dapper;
using MediatR;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using OrderingService.Core.OrderAggregateRoot;
using System;
using System.Data;
using System.Threading;
using System.Threading.Tasks;

namespace OrderingService.API.Application.Commands
{
    public class GetShippingAddressForCustomerCommandHandler :
        IRequestHandler<GetShippingAddressForCustomerCommand, ShippingAddress>
    {
        private readonly string _connectionString;

        public GetShippingAddressForCustomerCommandHandler(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<ShippingAddress> Handle(
            GetShippingAddressForCustomerCommand request, CancellationToken cancellationToken)
        {
            await using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync(cancellationToken);

            var shippingAddress = await connection.QueryFirstAsync<ShippingAddress>(
                "uspGetShippingAddress", new
                {
                    customerId = request.CustomerId,
                    request.ShippingAddress.Country,
                    request.ShippingAddress.City,
                    request.ShippingAddress.District,
                    request.ShippingAddress.Ward,
                    request.ShippingAddress.Street,
                    request.ShippingAddress.Details
                }, commandType: CommandType.StoredProcedure);

            return shippingAddress;
        }
    }
}