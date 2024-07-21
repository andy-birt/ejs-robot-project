// Our robot will be moving around the village. There are parcels in various places, each addressed to some other place. 
// The robot picks up parcels when it comes across them and delivers them when it arrives at their destinations.

// The automaton must decide, at each point, where to go next. It has finished its task when all parcels have been delivered.

// To be able to simulate this process, we must define a virtual world that can describe it. This model tells us where the robot is 
// and where the parcels are. When the robot has decided to move somewhere, we need to update the model to reflect the new situation.

// If you’re thinking in terms of object-oriented programming, your first impulse might be to start defining objects for the various 
// elements in the world: a class for the robot, one for a parcel, maybe one for places. These could then hold properties that describe 
// their current state, such as the pile of parcels at a location, which we could change when updating the world.

// This is wrong. At least, it usually is. The fact that something sounds like an object does not automatically mean that it should be 
// an object in your program. Reflexively writing classes for every concept in your application tends to leave you with a collection of 
// interconnected objects that each have their own internal, changing state. Such programs are often hard to understand and thus easy 
// to break.

// Instead, let’s condense the village’s state down to the minimal set of values that define it. There’s the robot’s current location 
// and the collection of undelivered parcels, each of which has a current location and a destination address. That’s it.

// While we’re at it, let’s make it so that we don’t change this state when the robot moves but rather compute a new state for the 
// situation after the move.

const { Map } = require("./map.cjs");

class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }

  move(destination) {
    const map = new Map();
    const roadGraph = map.buildGraph();
    if (!roadGraph[this.place].includes(destination)) {
      return this;
    } else {
      let parcels = this.parcels.map(p => {
        if (p.place != this.place) return p;
        return {place: destination, address: p.address};
      }).filter(p => p.place != p.address);
      return new VillageState(destination, parcels);
    }
  }
}

// The move method is where the action happens. It first checks whether there is a road going from the current place to the destination,
// and if not, it returns the old state since this is not a valid move.

// Next, the method creates a new state with the destination as the robot’s new place. It also needs to create a new set of 
// parcels—parcels that the robot is carrying (that are at the robot’s current place) need to be moved along to the new place.
// And parcels that are addressed to the new place need to be delivered—that is, they need to be removed from the set of undelivered
// parcels. The call to map takes care of the moving, and the call to filter does the delivering.

// Parcel objects aren’t changed when they are moved but re-created. The move method gives us a new village state but leaves the old 
// one entirely intact.

module.exports = { VillageState };