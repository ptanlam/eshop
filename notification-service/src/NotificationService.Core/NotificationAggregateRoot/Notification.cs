using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace NotificationService.Core.NotificationAggregateRoot
{
    public class Notification
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        public string ReceiverEmail { get; set; }

        [BsonDefaultValue(false)]
        public bool Seen { get; set; }

        // TODO: make it clearer
        //[BsonGuidRepresentation(GuidRepresentation.CSharpLegacy)]
        //public Guid SenderId { get; set; }
        //public string SenderName { get; set; }

        public string Content { get; set; }
        public string Note { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime SentAt { get; set; }

        [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
        public DateTime? DeletedAt { get; set; }
    }
}