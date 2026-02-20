// Travel time between exactly two room objects
function travelTimeBetween(roomA, roomB) {
  const horizontal = Math.abs(roomA.position - roomB.position);
  const vertical = Math.abs(roomA.floor - roomB.floor) * 2;
  return horizontal + vertical;
}

// Total travel time of a group (first to last when sorted by floor, then position)
function groupTravelTime(rooms) {
  if (rooms.length <= 1) return 0;
  const sorted = [...rooms].sort((a, b) => a.floor - b.floor || a.position - b.position);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  return travelTimeBetween(first, last);
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

  let bestResult = null;

  // Step 1: Same-floor search (highest priority)
  const roomsByFloor = {};
  availableRooms.forEach((room) => {
    if (!roomsByFloor[room.floor]) {
      roomsByFloor[room.floor] = [];
    }
    roomsByFloor[room.floor].push(room);
  });

  for (const floorStr in roomsByFloor) {
    const floor = parseInt(floorStr);
    const floorRooms = roomsByFloor[floor];

    if (floorRooms.length >= count) {
      const combinations = getCombinations(floorRooms, count);

      let bestFloorCombo = null;
      let bestFloorTime = Infinity;

      for (const combo of combinations) {
        const time = groupTravelTime(combo);
        if (time < bestFloorTime || (time === bestFloorTime && isLowerSet(combo, bestFloorCombo))) {
          bestFloorCombo = combo;
          bestFloorTime = time;
        }
      }

      if (bestFloorCombo) {
        bestResult = {
          rooms: bestFloorCombo,
          travelTime: bestFloorTime,
        };
      }
    }
  }

  // Return early if same-floor result found
  if (bestResult) {
    return bestResult;
  }

  // Step 2: Cross-floor sliding window
  const distinctFloors = Object.keys(roomsByFloor)
    .map((f) => parseInt(f))
    .sort((a, b) => a - b);

  if (distinctFloors.length < 2) {
    return null;
  }

  for (let winSize = 2; winSize <= Math.min(distinctFloors.length, 5); winSize++) {
    let foundForSize = false;

    for (let i = 0; i <= distinctFloors.length - winSize; i++) {
      const windowFloors = distinctFloors.slice(i, i + winSize);
      const pooledRooms = [];

      for (const floor of windowFloors) {
        pooledRooms.push(...roomsByFloor[floor]);
      }

      if (pooledRooms.length >= count) {
        const combinations = getCombinations(pooledRooms, count);

        let windowBestCombo = null;
        let windowBestTime = Infinity;

        for (const combo of combinations) {
          const time = groupTravelTime(combo);
          if (time < windowBestTime || (time === windowBestTime && isLowerSet(combo, windowBestCombo))) {
            windowBestCombo = combo;
            windowBestTime = time;
          }
        }

        if (windowBestCombo) {
          if (
            !bestResult ||
            windowBestTime < bestResult.travelTime ||
            (windowBestTime === bestResult.travelTime && isLowerSet(windowBestCombo, bestResult.rooms))
          ) {
            bestResult = {
              rooms: windowBestCombo,
              travelTime: windowBestTime,
            };
            foundForSize = true;
          }
        }
      }
    }

    // Break out after first window size that yields a result
    if (foundForSize) {
      break;
    }
  }

  return bestResult;
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
