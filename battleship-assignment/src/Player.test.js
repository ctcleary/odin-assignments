import Player from "./Player.js";
import Gameboard from "./Gameboard.js";
import { PLAYER } from "./Game.js";

it('Player constructor correctly takes playerID and two Gameboard objects', () => {
    const ownGB = new Gameboard();
    const oppGB = new Gameboard();

    const player = new Player(PLAYER.ONE, ownGB, oppGB);
    expect(player.ownGB).toEqual(ownGB);
    expect(player.oppGB).toEqual(oppGB);
})

it('Player.attack(xy) correctly calls Gameboard.receiveHit(xy)', () => {
    const ownGB = new Gameboard();
    const oppGB = new Gameboard();
    
    const spy = jest.spyOn(oppGB, 'receiveHit');

    const player = new Player(PLAYER.ONE, ownGB, oppGB);
    player.attack([10, 6]);

    // Is this testing a side effect and therefore not great?
    expect(spy).toHaveBeenCalledWith([10, 6]);
})