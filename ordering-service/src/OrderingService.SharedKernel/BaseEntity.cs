namespace OrderingService.SharedKernel
{
    public abstract class BaseEntity<TId>
    {
        public TId Id { get; protected set; }
    }
}