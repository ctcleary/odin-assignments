import Game from "./Game.js";
import { PLAYER } from "./Game.js";

it('Game correctly sets up initial conditions', () => {
    const g = new Game();

    expect(g.size).toEqual([20,20]);

    expect(g.gameboards[PLAYER.ONE]).toStrictEqual(g.players[PLAYER.ONE].ownGB);
    expect(g.gameboards[PLAYER.TWO]).toStrictEqual(g.players[PLAYER.ONE].oppGB);

    expect(g.gameboards[PLAYER.TWO]).toEqual(g.players[PLAYER.TWO].ownGB);
    expect(g.gameboards[PLAYER.ONE]).toEqual(g.players[PLAYER.TWO].oppGB);
})

it('Game.switchActivePlayer() successfully switches active player', () => {
    const g = new Game();

    expect(g.activePlayer).toBe(PLAYER.ONE);
    g.switchActivePlayer();
    expect(g.activePlayer).toBe(PLAYER.TWO);
    g.switchActivePlayer();
    expect(g.activePlayer).toBe(PLAYER.ONE);
})

