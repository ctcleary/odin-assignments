import Player from "./Player.js";
import Gameboard from "./Gameboard.js";
import Game from "./Game.js";
import { PLAYER } from "./Game.js";

it('Player constructor correctly takes playerID and two Gameboard objects', () => {
    const game = new Game();
    const ownGB = game.gameboards[PLAYER.ONE];
    const oppGB = game.gameboards[PLAYER.TWO];

    const player = new Player(PLAYER.ONE, ownGB, oppGB);
    expect(player.ownGB).toEqual(ownGB);
    expect(player.oppGB).toEqual(oppGB);
})

it('Player.attack(xy) correctly calls Gameboard.receiveHit(xy)', () => {
    const game = new Game();
    const ownGB = game.gameboards[PLAYER.ONE];
    const oppGB = game.gameboards[PLAYER.TWO];
    
    const spy = jest.spyOn(oppGB, 'receiveHit');

    const player = new Player(PLAYER.ONE, ownGB, oppGB);
    player.attack([10, 6]);

    // Is this testing a side effect and therefore not great?
    expect(spy).toHaveBeenCalledWith([10, 6]);
})