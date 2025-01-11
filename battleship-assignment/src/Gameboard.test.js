import Gameboard from "./Gameboard";

it('Gameboard class exists', () => {
    expect(Gameboard).not.toBeUndefined();
})

it('Gameboard is set to the correct size', () => {
    const gb = new Gameboard();
    expect(gb.size[0]).toBe(10);
    expect(gb.size[1]).toBe(10);

    const gb2 = new Gameboard([30,50]);
    expect(gb2.size[0]).toBe(30);
    expect(gb2.size[1]).toBe(50);
})

it('Gameboard is set to the correct player string', () => {
    const gb = new Gameboard([20,20], 'playerOne');
    expect(gb.player).toBe('playerOne');
})

it('Gameboard.areValidCoords() returns the correct boolean val', () => {
    const gb = new Gameboard([30,30]);

    expect(gb.areValidCoords([10,10])).toBe(true);
    expect(gb.areValidCoords([31,20])).toBe(false);    
})

it('Gameboard.receiveAttack() logs the attack correctly', () => {
    const gb = new Gameboard();
    
    gb.receiveHit([3,3]);
    expect(gb.getHits()).toEqual([ { xy: [3,3], shipHit: false } ]);

    gb.receiveHit([8,9]);
    expect(gb.getHits()).toEqual([ { xy: [3,3], shipHit: false }, { xy: [8,9], shipHit: false } ]);
})

// it('Gameboard.receiveAttack() correctly emits CustomEvent', () => {
//     const gb = new Gameboard();

//     const hitListener = jest.fn((e) => { return e.detail; });
//     // hitListener.mockImplementation();
//     gb.addEventListener('hit', hitListener);

//     gb.receiveAttack([1,3]);
//     expect(hitListener.mock.results[0].value).toEqual({ xy: [1,3] });

//     gb.removeEventListener('hit', hitListener);
// })

it('Gameboard correctly assesses Gameboard.isAlreadyHit(xy)', () => {
    const gb = new Gameboard();
    
    gb.receiveHit([10,7]);
    expect(gb.isAlreadyHit([10,7])).toBe(true);
})

it('Gameboard.registerShip() correctly stores the ship', () => {
    const gb = new Gameboard();
    
    gb.registerShip(4, [4,4], true);
    expect(gb.getShips()[0]).not.toBeUndefined();
    gb.registerShip(2, [10,8], false);
    expect(gb.getShips()[1]).not.toBeUndefined();
})

it('Gameboard correctly calls Gameboard.lose() when all ships are destroyed', () => {
    const gb = new Gameboard();

    const loseSpy = jest.spyOn(gb, 'lose');

    gb.registerShip(2, [3,3], false);
    gb.registerShip(3, [10,4], false);

    gb.receiveHit([3,3])
    gb.receiveHit([3,4]);

    gb.receiveHit([10,4]);
    gb.receiveHit([10,5]);
    gb.receiveHit([10,6]);

    expect(loseSpy).toHaveBeenCalled();
})

it('Gameboard.hit(xy) returns true if a ship is hit', () => {
    const gb = new Gameboard();
    gb.registerShip(3, [5,5], false);
    let wasHit = gb.receiveHit([7,7]);
    expect(wasHit).toBe(false);
    wasHit = gb.receiveHit([5,5]);
    expect(wasHit).toBe(true);
})