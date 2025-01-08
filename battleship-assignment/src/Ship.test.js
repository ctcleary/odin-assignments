import Ship from "./Ship.js";

it('ship has correct default properties', () => {
    const ship = new Ship();
    expect(ship.length).toBe(1);
    expect(ship.coords).toEqual([ [0,0] ]);
})

it('ship has correct length', () => {
    const ship = new Ship(3);
    expect(ship.length).toBe(3);
})

it('Ship.determineCoords returns the correct array of objects', () => {
    const ship = new Ship();
    
    const coords1 = ship.determineCoords(3, 2, 4, true);
    expect(coords1).toEqual([ [2,4], [3,4], [4,4] ]);
    
    const coords2 = ship.determineCoords(5, 12, 15, false);
    expect(coords2).toEqual([ [12,15], [12,16], [12,17], [12,18], [12,19] ]);
})

it.skip('Ship.isSunk() returns correct result', () => {
    const shipUnsunk = new Ship(4);
    shipUnsunk.hit();
    shipUnsunk.hit();
    shipUnsunk.hit();
    expect(shipUnsunk.isSunk()).toBe(false);

    const ship = new Ship(2);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);

    const ship2 = new Ship(4);
    ship2.hit();
    ship2.hit();
    ship2.hit();
    ship2.hit();
    expect(ship.isSunk()).toBe(true);
})

// it('ship sets coordinates correctly', () => {
//     expectShip
// })
