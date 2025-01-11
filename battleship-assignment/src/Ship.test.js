import Gameboard from "./Gameboard.js";
import Ship from "./Ship.js";

it('ship has correct default properties', () => {
    const ship = new Ship();
    expect(ship.length).toBe(1);
    expect(ship.shipCoords).toEqual([ [-1,-1] ]);
    expect(ship.hits).toEqual([]);
})

it('ship has correct length', () => {
    const ship = new Ship(3);
    expect(ship.length).toBe(3);
})

it('Ship.determineCoords(...) returns the correct array of xy 2-element arrays', () => {
    const ship = new Ship();
    
    const coords1 = ship.determineCoords(3, [2,4], true);
    expect(coords1).toEqual([ [2,4], [3,4], [4,4] ]);
    
    const coords2 = ship.determineCoords(5, [12,15], false);
    expect(coords2).toEqual([ [12,15], [12,16], [12,17], [12,18], [12,19] ]);
})

it('Ship.areShipCoords(xy) returns correct bool', () => {
    const ship = new Ship(3, [0,0], true);

    expect(ship.areShipCoords([0,0])).toBe(true);
    expect(ship.areShipCoords([1,0])).toBe(true);
    expect(ship.areShipCoords([2,2])).toBe(false);
})

it('Ship.hit(xy) correctly throws errors on invalid coords', () => {
    const ship = new Ship(3, [0,0], true);

    expect(() => ship.hit()).toThrow();
    // expect(() => ship.hit([3,4])).toThrow();

    expect(() => ship.hit([0,0])).not.toThrow();
    expect(() => ship.hit([1,0])).not.toThrow();
    expect(() => ship.hit([2,0])).not.toThrow();
})

it('Ship.hit(xy) correctly registers valid hits', () => {
    const ship = new Ship(3, [2,2], false);

    expect(ship.getHits()).toEqual([]);
    ship.hit([2,4]);
    expect(ship.getHitCt()).toBe(1);
    expect(ship.getHits()).toEqual([ [2,4] ]);

    ship.hit([2,2]);
    expect(ship.getHitCt()).toBe(2);
    expect(ship.getHits()).toEqual([ [2,4], [2,2] ]);
})

it('Ship.hit(xy) returns true if a hit lands on one of its coords', () => {
    const ship = new Ship(2, [1,1], false);

    expect(ship.hit([1,1])).toBe(true);
    expect(ship.hit([12, 16])).toBe(false);
    expect(ship.hit([1,2])).toBe(true);
})

it('Ship.isSunk() returns correct bool', () => {
    const ship = new Ship(2, [1,1], false);

    ship.hit([1,1])
    expect(ship.isSunk()).toBe(false);
    ship.hit([1,2]);
    expect(ship.isSunk()).toBe(true);
})

it('Ship.isSunk() returns correct result', () => {
    const shipUnsunk = new Ship(4, [1,1], true);
    shipUnsunk.hit([1,1]);
    shipUnsunk.hit([2,1]);
    shipUnsunk.hit([3,1]);
    expect(shipUnsunk.isSunk()).toBe(false);

    const ship = new Ship(2, [1,1], true);
    ship.hit([1,1]);
    ship.hit([2,1]);
    expect(ship.isSunk()).toBe(true);

    const ship2 = new Ship(4, [1,1], false);
    ship2.hit([1,1]);
    ship2.hit([1,2]);
    ship2.hit([1,3]);
    ship2.hit([1,4]);
    expect(ship2.isSunk()).toBe(true);
})

it('Ship.setRepresentation(length) set correct representation', () => {
    const s4 = new Ship(4);
    expect(s4.representation.length).toBe(4);

    const s3 = new Ship(3);
    expect(s3.representation.length).toBe(3);

    const s2 = new Ship(2);
    expect(s2.representation.length).toBe(2);

    const s1 = new Ship(1);
    expect(s1.representation.length).toBe(1);
})

// it('Ship.hitListener(event) correctly reacts to "hit" CustomEvents', () => {
//     const ship = new Ship(3, [1,1], false);
//     const spy = jest.spyOn(ship, 'hitListener');

//     const ceMiss = new CustomEvent('hit', { detail: { xy: [5,5] }});
//     ship.hitListener(ceMiss);

//     expect(spy.mock.results[0].value).toEqual(false);
//     expect(ship.getHits()).toEqual([]);

//     const ceHit = new CustomEvent('hit', { detail: { xy: [1,3] }});
//     ship.hitListener(ceHit);

//     expect(spy.mock.results[1].value).toEqual([ [1,3] ]);
//     expect(ship.getHits()).toEqual([ [1,3] ]);

//     const ceMiss2 = new CustomEvent('hit', { detail: { xy: [12,7] }});
//     ship.hitListener(ceMiss2);

//     expect(spy.mock.results[2].value).toEqual(false);
//     expect(ship.getHits()).toEqual([ [1,3] ]);
    
//     const ceHit2 = new CustomEvent('hit', { detail: { xy: [1,1] }});
//     ship.hitListener(ceHit2);

//     expect(spy.mock.results[3].value).toEqual([ [1,3], [1,1] ]);
//     expect(ship.getHits()).toEqual([ [1,3], [1,1] ]);
// })