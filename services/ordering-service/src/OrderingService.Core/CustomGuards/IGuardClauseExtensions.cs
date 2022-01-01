using Ardalis.GuardClauses;
using System;

namespace OrderingService.Core.CustomGuards
{
    public static class IGuardClauseExtensions
    {
        public static Guid EmptyGuid(this IGuardClause guardClause, Guid guid, string paramName)
        {
            if (Equals(guid, Guid.Empty))
                throw new ArgumentException("Empty guid is invalid.", paramName);

            return guid;
        }
    }
}