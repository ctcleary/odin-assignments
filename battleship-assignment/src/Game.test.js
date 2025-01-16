import Game from "./Game.js";
import { PLAYER } from "./Player.js"; 

it('Game correctly sets up initial conditions', () => {
    const g = new Game();

    expect(g.size).toEqual([10,10]);

    expect(g.gameboards[PLAYER.ONE]).toStrictEqual(g.players[PLAYER.ONE].ownGB);
    expect(g.gameboards[PLAYER.TWO]).toStrictEqual(g.players[PLAYER.ONE].oppGB);

    expect(g.gameboards[PLAYER.TWO]).toEqual(g.players[PLAYER.TWO].ownGB);
    expect(g.gameboards[PLAYER.ONE]).toEqual(g.players[PLAYER.TWO].oppGB);
})

it('Game.switchActivePlayer() successfully switches active player', () => {
    const g = new Game();

    expect(g.activePlayer).toBe(null);
    g.switchActivePlayer(PLAYER.TWO);
    expect(g.activePlayer).toBe(PLAYER.TWO);
    g.switchActivePlayer();
    expect(g.activePlayer).toBe(PLAYER.ONE);
})

it('Game.unsetActivePlayer() successfully sets Game.player to null', () => {
    const g = new Game();

    expect(g.activePlayer).toBe(null);
    g.switchActivePlayer(PLAYER.ONE);
    expect(g.activePlayer).toBe(PLAYER.ONE);
    g.unsetActivePlayer();
    expect(g.activePlayer).toBe(null);

});

