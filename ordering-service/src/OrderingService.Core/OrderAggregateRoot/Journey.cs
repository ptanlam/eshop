using Ardalis.GuardClauses;
using OrderingService.SharedKernel;
using System;

namespace OrderingService.Core.OrderAggregateRoot
{
    public class Journey : BaseEntity<int>
    {
        public string Location { get; private set; }
        public DateTime TimeStamp { get; private set; }
        public string Notes { get; private set; }

        public Journey()
        {
        }

        public Journey(string location, string notes = "")
        {
            Notes = notes;
            Location = Guard.Against.NullOrEmpty(location, nameof(location));
            TimeStamp = DateTime.UtcNow;
        }

        public void UpdateLocation(string location)
        {
            Location = Guard.Against.NullOrEmpty(location, nameof(location));
        }

        public void UpdateNotes(string notes)
        {
            Notes = Guard.Against.NullOrEmpty(notes, nameof(notes));
        }
    }
}