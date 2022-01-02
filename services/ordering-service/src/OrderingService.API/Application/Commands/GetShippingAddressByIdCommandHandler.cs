using System.Data;
using System.Threading;
using System.Threading.Tasks;
using Dapper;
using MediatR;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using OrderingService.Core.OrderAggregateRoot;

namespace OrderingService.API.Application.Commands
{
    public class GetShippingAddressByIdCommandHandler :
        IRequestHandler<GetShippingAddressByIdCommand, ShippingAddress>
    {
        private readonly string _connectionString;

        public GetShippingAddressByIdCommandHandler(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public async Task<ShippingAddress> Handle(
            GetShippingAddressByIdCommand request, CancellationToken cancellationToken)
        {
            await using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync(cancellationToken);

            var shippingAddress = await connection.QueryFirstAsync<ShippingAddress>(
                "uspGetShippingAddressById",
                new
                {
                    request.Id
                }, commandType: CommandType.StoredProcedure);

            return shippingAddress;
        }
    }
}