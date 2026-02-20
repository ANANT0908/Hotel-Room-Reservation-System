const {
  findOptimalRooms,
  groupTravelTime,
  travelTimeBetween,
} = require('../services/bookingAlgorithm');

describe('Booking Algorithm', () => {
  describe('travelTimeBetween', () => {
    it('should return 0 for same room', () => {
      const room = { floor: 1, position: 1 };
      expect(travelTimeBetween(room, room)).toBe(0);
    });

    it('should calculate horizontal travel correctly', () => {
      const roomA = { floor: 1, position: 1 };
      const roomB = { floor: 1, position: 2 };
      expect(travelTimeBetween(roomA, roomB)).toBe(1);
    });

    it('should calculate vertical travel correctly', () => {
      const roomA = { floor: 1, position: 1 };
      const roomB = { floor: 3, position: 1 };
      expect(travelTimeBetween(roomA, roomB)).toBe(4); // 2 floors * 2 = 4
    });

    it('should calculate combined travel correctly', () => {
      const roomA = { floor: 1, position: 1 };
      const roomB = { floor: 3, position: 3 };
      expect(travelTimeBetween(roomA, roomB)).toBe(6); // horiz: 2, vert: 4
    });
  });

  describe('groupTravelTime', () => {
    it('should return 0 for single room', () => {
      const rooms = [{ floor: 1, position: 1 }];
      expect(groupTravelTime(rooms)).toBe(0);
    });

    it('should return 0 for empty array', () => {
      expect(groupTravelTime([])).toBe(0);
    });

    it('should calculate travel between first and last (sorted)', () => {
      const rooms = [
        { floor: 1, position: 3 },
        { floor: 1, position: 1 },
        { floor: 1, position: 2 },
      ];
      // Sorted: [1,1], [1,2], [1,3]
      // Travel from [1,1] to [1,3] = 2
      expect(groupTravelTime(rooms)).toBe(2);
    });

    it('should sort by floor first, then position', () => {
      const rooms = [
        { floor: 2, position: 1 },
        { floor: 1, position: 10 },
        { floor: 1, position: 5 },
      ];
      // Sorted: [1,5], [1,10], [2,1]
      // Travel from [1,5] to [2,1] = (10-1)*1 + (2-1)*2 = 9 + 2 = 11
      expect(groupTravelTime(rooms)).toBe(11);
    });
  });

  describe('findOptimalRooms', () => {
    it('should return null when not enough rooms available', () => {
      const available = [
        { roomNumber: 101, floor: 1, position: 1 },
        { roomNumber: 102, floor: 1, position: 2 },
      ];
      expect(findOptimalRooms(available, 3)).toBeNull();
    });

    it('should book single room with travel 0', () => {
      const available = [
        { roomNumber: 101, floor: 1, position: 1 },
        { roomNumber: 102, floor: 1, position: 2 },
      ];
      const result = findOptimalRooms(available, 1);
      expect(result).not.toBeNull();
      expect(result.rooms.length).toBe(1);
      expect(result.travelTime).toBe(0);
    });

    it('should prefer same floor booking', () => {
      const available = [
        { roomNumber: 101, floor: 1, position: 1 },
        { roomNumber: 102, floor: 1, position: 2 },
        { roomNumber: 103, floor: 1, position: 3 },
        { roomNumber: 201, floor: 2, position: 1 },
        { roomNumber: 202, floor: 2, position: 2 },
        { roomNumber: 203, floor: 2, position: 3 },
      ];
      const result = findOptimalRooms(available, 3);
      expect(result).not.toBeNull();
      expect(result.rooms.length).toBe(3);
      // Should pick floor 1 (travel=2) or floor 2 (travel=2)
      // If tie, picks lowest room numbers (floor 1)
      expect(result.rooms[0].floor).toBe(1);
    });

    it('should handle 5-room booking', () => {
      const available = [];
      const floor = 1;
      for (let position = 1; position <= 10; position++) {
        available.push({
          roomNumber: floor * 100 + position,
          floor,
          position,
        });
      }
      const result = findOptimalRooms(available, 5);
      expect(result).not.toBeNull();
      expect(result.rooms.length).toBe(5);
      expect(result.travelTime).toBe(4); // 5 positions span 4 gaps
    });

    it('should fallback to cross-floor when floor is full', () => {
      const available = [
        { roomNumber: 101, floor: 1, position: 1 },
        { roomNumber: 102, floor: 1, position: 2 },
        { roomNumber: 201, floor: 2, position: 1 },
        { roomNumber: 202, floor: 2, position: 2 },
        { roomNumber: 301, floor: 3, position: 1 },
      ];
      const result = findOptimalRooms(available, 3);
      expect(result).not.toBeNull();
      expect(result.rooms.length).toBe(3);
      // Should book across floors since not enough on single floor
      const floors = new Set(result.rooms.map((r) => r.floor));
      expect(floors.size).toBeGreaterThan(1);
    });

    it('should apply tie-break rule (lower room numbers)', () => {
      const available = [
        { roomNumber: 101, floor: 1, position: 1 },
        { roomNumber: 110, floor: 1, position: 10 },
        { roomNumber: 201, floor: 2, position: 1 },
        { roomNumber: 210, floor: 2, position: 10 },
      ];
      // Both combinations have travel 9
      // Should pick [101, 110] over [201, 210]
      const result = findOptimalRooms(available, 2);
      expect(result).not.toBeNull();
      expect(result.rooms[0].roomNumber).toBeLessThan(200);
    });

    it('should handle floor 10 rooms', () => {
      const available = [
        { roomNumber: 1001, floor: 10, position: 1 },
        { roomNumber: 1002, floor: 10, position: 2 },
        { roomNumber: 1003, floor: 10, position: 3 },
      ];
      const result = findOptimalRooms(available, 3);
      expect(result).not.toBeNull();
      expect(result.travelTime).toBe(2); // positions 1 to 3
    });
  });
});
