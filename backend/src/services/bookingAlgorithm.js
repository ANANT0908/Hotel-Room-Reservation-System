// Travel time between exactly two room objects
// Lift/Stairs are at the left (position 1)
function travelTimeBetween(roomA, roomB) {
  if (roomA.floor === roomB.floor) {
    return Math.abs(roomA.position - roomB.position);
  }
  // If floors are different, must go to lift (at position 1)
  const vertical = Math.abs(roomA.floor - roomB.floor) * 2;
  const toLiftA = roomA.position - 1;
  const toLiftB = roomB.position - 1;
  return toLiftA + vertical + toLiftB;
}

// Total travel time of a group
// For cross-floor bookings, it's the travel time between the two furthest rooms
function groupTravelTime(rooms) {
  if (rooms.length <= 1) return 0;

  let maxTime = 0;
  for (let i = 0; i < rooms.length; i++) {
    for (let j = i + 1; j < rooms.length; j++) {
      const time = travelTimeBetween(rooms[i], rooms[j]);
      if (time > maxTime) maxTime = time;
    }
  }
  return maxTime;
}

// All combinations of size k from array (backtracking)
function getCombinations(arr, k) {
  if (k === 0) return [[]];
  if (arr.length === 0) return [];

  const result = [];

  function backtrack(start, combo) {
    if (combo.length === k) {
      result.push([...combo]);
      return;
    }

    for (let i = start; i < arr.length; i++) {
      combo.push(arr[i]);
      backtrack(i + 1, combo);
      combo.pop();
    }
  }

  backtrack(0, []);
  return result;
}

// Returns true if set A has lower room numbers than set B (tie-break)
function isLowerSet(a, b) {
  const sa = [...a].sort((x, y) => x.roomNumber - y.roomNumber);
  const sb = [...b].sort((x, y) => x.roomNumber - y.roomNumber);

  for (let i = 0; i < sa.length; i++) {
    if (sa[i].roomNumber !== sb[i].roomNumber) {
      return sa[i].roomNumber < sb[i].roomNumber;
    }
  }
  return false;
}

// Main algorithm
function findOptimalRooms(availableRooms, count) {
  if (availableRooms.length < count) {
    return null;
  }

  // Cap count at 5 as per rules
  const k = Math.min(count, 5);

  // Group rooms by floor
  const roomsByFloor = {};
  availableRooms.forEach((room) => {
    if (!roomsByFloor[room.floor]) {
      roomsByFloor[room.floor] = [];
    }
    roomsByFloor[room.floor].push(room);
  });

  // Step 1: Same-floor search (Priority 2)
  let bestSameFloor = null;
  let minSameFloorTime = Infinity;

  for (const floorStr in roomsByFloor) {
    const floorRooms = roomsByFloor[floorStr].sort((a, b) => a.position - b.position);
    if (floorRooms.length >= k) {
      // Find k contiguous available rooms on this floor that minimize span
      for (let i = 0; i <= floorRooms.length - k; i++) {
        const combo = floorRooms.slice(i, i + k);
        const time = groupTravelTime(combo);
        if (time < minSameFloorTime || (time === minSameFloorTime && isLowerSet(combo, bestSameFloor))) {
          minSameFloorTime = time;
          bestSameFloor = combo;
        }
      }
    }
  }

  if (bestSameFloor) {
    return {
      rooms: bestSameFloor,
      travelTime: minSameFloorTime,
    };
  }

  // Step 2: Cross-floor search (Priority 3/4)
  // For cross-floor, we only really care about rooms closer to the lift
  // because larger positions only increase travel time to other floors.
  // We take the first 'k' rooms from each floor to reduce search space (max 50 rooms).
  const candidateRooms = [];
  const floors = Object.keys(roomsByFloor).sort((a, b) => a - b);
  for (const f of floors) {
    const floorRooms = roomsByFloor[f].sort((a, b) => a.position - b.position);
    candidateRooms.push(...floorRooms.slice(0, k));
  }

  let bestCrossResult = null;
  let minCrossTime = Infinity;

  function findBestCombo(start, currentCombo, currentMaxTime) {
    if (currentCombo.length === k) {
      if (currentMaxTime < minCrossTime || (currentMaxTime === minCrossTime && isLowerSet(currentCombo, bestCrossResult))) {
        minCrossTime = currentMaxTime;
        bestCrossResult = [...currentCombo];
      }
      return;
    }

    if (start >= candidateRooms.length) return;

    // Pruning: if we don't have enough rooms left
    if (candidateRooms.length - start < k - currentCombo.length) return;

    for (let i = start; i < candidateRooms.length; i++) {
      const nextRoom = candidateRooms[i];
      let nextMaxTime = currentMaxTime;

      // Calculate new max time if we add this room
      for (const r of currentCombo) {
        const t = travelTimeBetween(r, nextRoom);
        if (t > nextMaxTime) nextMaxTime = t;
      }

      // Pruning: if current combo already exceeds best time
      if (nextMaxTime > minCrossTime) continue;

      currentCombo.push(nextRoom);
      findBestCombo(i + 1, currentCombo, nextMaxTime);
      currentCombo.pop();
    }
  }

  // Limit search if candidateRooms is still large (though it should be <= 50)
  // But with pruning it should be very fast.
  findBestCombo(0, [], 0);

  if (bestCrossResult) {
    return {
      rooms: bestCrossResult,
      travelTime: minCrossTime,
    };
  }

  return null;
}

// Random selection of available rooms
function findRandomRooms(availableRooms, count) {
  if (availableRooms.length < count) {
    return null;
  }

  // Shuffle array using Fisher-Yates algorithm
  const shuffled = [...availableRooms];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Select first count rooms
  const selectedRooms = shuffled.slice(0, count);

  // Calculate travel time for the selected rooms
  const travelTime = groupTravelTime(selectedRooms);

  return {
    rooms: selectedRooms,
    travelTime: travelTime,
  };
}

module.exports = { findOptimalRooms, findRandomRooms, groupTravelTime, travelTimeBetween };
