import Game, { GAME_TYPE } from "./Game.js";
import { PLAYER } from "./Player.js"; 

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

