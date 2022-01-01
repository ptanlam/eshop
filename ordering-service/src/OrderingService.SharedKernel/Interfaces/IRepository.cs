using Ardalis.Specification;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace OrderingService.SharedKernel.Interfaces
{
    public interface IRepository<T> : IRepositoryBase<T> where T : class, IAggregateRoot
    {
        Task<(IEnumerable<T> data, int total)> ListAndCountAsync(
            ISpecification<T> specification,
            int limit, int offset,
            CancellationToken cancellationToken = default);
    }
}