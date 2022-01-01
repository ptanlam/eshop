using Ardalis.Specification;
using Ardalis.Specification.EntityFrameworkCore;
using OrderingService.SharedKernel.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace OrderingService.Infrastructure.Data
{
    public class EfRepository<T> : RepositoryBase<T>, IReadRepository<T>, IRepository<T>
        where T : class, IAggregateRoot
    {
        public EfRepository(AppDbContext dbContext) : base(dbContext)
        {
        }

        public async Task<(IEnumerable<T> data, int total)> ListAndCountAsync(
            ISpecification<T> specification,
            int limit, int offset,
            CancellationToken cancellationToken = default)
        {
            var records = await ListAsync(specification, cancellationToken);

            var data = records
                .Skip(limit * offset)
                .Take(limit);

            return (data, records.Count);
        }
    }
}