import Gameboard from "./Gameboard.js";
import Game from "./Game.js";
import { PLAYER, GAME_TYPE } from "./Game.js";

it('Gameboard class exists', () => {
    expect(Gameboard).not.toBeUndefined();
})

it('Gameboard is set to the correct size', () => {
    const game = new Game();
    const gb = new Gameboard(game);
    expect(gb.size[0]).toBe(10);
    expect(gb.size[1]).toBe(10);

    const gameWSize = new Game(GAME_TYPE.PLAYERS, [30,50])
    const gb2 = new Gameboard(gameWSize);
    expect(gb2.size[0]).toBe(30);
    expect(gb2.size[1]).toBe(50);
})

it('Gameboard is set to the correct player string', () => {
    const game = new Game();
    const gb = new Gameboard(game, 'playerOne');
    expect(gb.player).toBe('playerOne');
})

it('Gameboard.areValidCoords() returns the correct boolean val', () => {
    const game = new Game();
    const gb = new Gameboard(game);

    expect(gb.areValidCoords([10,10])).toBe(true);
    expect(gb.areValidCoords([11,11])).toBe(false);    
})

it('Gameboard.receiveAttack() logs the attack correctly', () => {
    const game = new Game();
    const gb = new Gameboard(game);
    
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
    const game = new Game();
    const gb = new Gameboard(game);
    
    gb.receiveHit([10,7]);
    expect(gb.isAlreadyHit([10,7])).toBe(true);
})

// it('Gameboard.registerShip() correctly stores the ship', () => {
//     const gb = new Gameboard();
    
//     gb.registerShip(4, [4,4], true);
//     expect(gb.getShips()[0]).not.toBeUndefined();
//     gb.registerShip(2, [10,8], false);
//     expect(gb.getShips()[1]).not.toBeUndefined();
// })

it('Gameboard.setShipCoords(args) correctly sets the ship coords', () => {
    const game = new Game();
    const gb = new Gameboard(game);

    const ship21 = gb.getShips().find((shipObj) => { return shipObj.id === '2-1' }).ship;
    expect(ship21.getShipCoords()).toEqual([ [-1,-1], [0, -1]])
    gb.setShipCoords('2-1', [1,3], true);
    expect(ship21.getShipCoords()).toEqual([ [1,3], [2,3] ]);
})

it('Gameboard correctly calls Gameboard.lose() when all ships are destroyed', () => {
    const game = new Game();
    const gb = new Gameboard(game);

    const loseSpy = jest.spyOn(gb, 'lose');

    gb.setShipCoords('4-1', [1,1], true);

    gb.setShipCoords('3-1', [1,3], true);
    gb.setShipCoords('3-2', [5,3], true);

    gb.setShipCoords('2-1', [1,5], true);
    gb.setShipCoords('2-2', [4,5], true);
    gb.setShipCoords('2-3', [7,5], true);

    gb.setShipCoords('1-1', [1,7], true);
    gb.setShipCoords('1-2', [3,7], true);
    gb.setShipCoords('1-3', [5,7], true);
    gb.setShipCoords('1-4', [7,7], true);

    game.switchActivePlayer(PLAYER.ONE);

    //4-1
    gb.receiveHit([1,1]);
    gb.receiveHit([2,1]);
    gb.receiveHit([3,1]);
    gb.receiveHit([4,1]);
    //3-1
    gb.receiveHit([1,3]);
    gb.receiveHit([2,3]);
    gb.receiveHit([3,3]);
    //3-2
    gb.receiveHit([5,3]);
    gb.receiveHit([6,3]);
    gb.receiveHit([7,3]);
    //2-1
    gb.receiveHit([1,5]);
    gb.receiveHit([2,5]);
    //2-2
    gb.receiveHit([4,5]);
    gb.receiveHit([5,5]);
    gb.receiveHit([6,5]);
    //2-3
    gb.receiveHit([7,5]);
    gb.receiveHit([8,5]);

    //1s
    gb.receiveHit([1,7]);
    gb.receiveHit([3,7]);
    gb.receiveHit([5,7]);
    gb.receiveHit([7,7]);


    expect(loseSpy).toHaveBeenCalled();
})

it('Gameboard.hit(xy) returns true if a ship is hit', () => {
    const game = new Game();
    const gb = new Gameboard(game);

    gb.setShipCoords('4-1', [2,2], false);

    let wasHit = gb.receiveHit([5,5]);
    expect(wasHit).toBe(false);
    wasHit = gb.receiveHit([2,2]);
    expect(wasHit).toBe(true);
})

it('Gameboard.findOccupiedCoords() returns correct array', () => {
    const game = new Game();
    const gb = new Gameboard(game);

    gb.setShipCoords('4-1', [2,2], true);

    expect(gb.findOccupiedCoords()).toEqual([ [2,2], [3,2], [4,2], [5,2] ]);
})

it('Gameboard.findPaddedOccupiedCoords() return correct array', () => {
    const game = new Game();
    const gb = new Gameboard(game);

    gb.setShipCoords('4-1', [2,2], true)
    const occupiedCoordsPadded = gb.findOccupiedCoordsPadded();

    expect(occupiedCoordsPadded).toEqual([
        [ 2, 2 ], [ 3, 2 ], [ 4, 2 ], [ 5, 2 ], // Original coords
        [ 1, 2 ], [ 6, 2 ], // fore padding // aft padding
        [ 2, 3 ], [ 2, 1 ], // orig-y + 1 // orig-y - 1
        [ 3, 3 ], [ 3, 1 ], // orig-y + 1 // orig-y - 1
        [ 4, 3 ], [ 4, 1 ], // orig-y + 1 // orig-y - 1
        [ 5, 3 ], [ 5, 1 ]  // orig-y + 1 // orig-y - 1
    ]);

    const gb2 = new Gameboard(game);
    gb2.setShipCoords('2-1', [5,5], false);
    const occupiedCoordsPadded2 = gb2.findOccupiedCoordsPadded();

    expect(occupiedCoordsPadded2).toEqual([
        [5,5], [5,6], // Original coords
        [5,4], [5,7], // fore padding // aft padding
        [6,5], [4,5], // orig-x + 1 // orig-x - 1
        [6,6], [4,6]  // orig-x + 1 // orig-x - 1
    ]);
})