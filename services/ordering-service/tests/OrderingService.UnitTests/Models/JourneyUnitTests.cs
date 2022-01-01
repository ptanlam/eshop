using FluentAssertions;
using OrderingService.Core.OrderAggregateRoot;
using System;
using Xunit;

namespace OrderingService.UnitTests.Models
{
    public class JourneyUnitTests
    {
        [Fact]
        public void Creation_ShouldReturnExpectedJourney()
        {
            var location = "130 Campus View St E, Mankato, Minnesota(MN), 56001";
            var notes = "order is shipping.";

            var journey = new Journey(location, notes);

            journey.Location.Should().Be(location);
            journey.Notes.Should().Be(notes);
        }

        [Fact]
        public void UpdateLocation_ShouldReturnUpdatedLocation()
        {
            var location = "130 Campus View St E, Mankato, Minnesota(MN), 56001";
            var notes = "order is shipping.";
            var updatedLocation = "130 Campus View St E, Mankato, Minnesota(MN), 56101";

            var journey = new Journey(location, notes);

            journey.UpdateLocation(updatedLocation);

            journey.Location.Should().Be(updatedLocation);
        }

        [Fact]
        public void UpdateLocation_InvalidParameter_ShouldThrowArgumentException()
        {
            var location = "130 Campus View St E, Mankato, Minnesota(MN), 56001";
            var notes = "order is shipping.";
            var updatedLocation = "";

            var journey = new Journey(location, notes);

            Action act = () => journey.UpdateLocation(updatedLocation);

            act.Should().Throw<ArgumentException>()
                .WithParameterName("location");
        }

        [Fact]
        public void UpdateNotes_ShouldReturnUpdatedLocation()
        {
            var location = "130 Campus View St E, Mankato, Minnesota(MN), 56001";
            var notes = "order is shipping.";
            var updatedNotes = "updated notes.";

            var journey = new Journey(location, notes);

            journey.UpdateNotes(updatedNotes);

            journey.Notes.Should().Be(updatedNotes);
        }

        [Fact]
        public void UpdateNotes_InvalidParameter_ShouldThrowArgumentException()
        {
            var location = "130 Campus View St E, Mankato, Minnesota(MN), 56001";
            var notes = "order is shipping.";
            var updatedNotes = "";

            var journey = new Journey(location, notes);

            Action act = () => journey.UpdateNotes(updatedNotes);

            act.Should().Throw<ArgumentException>()
                .WithParameterName("notes");
        }
    }
}