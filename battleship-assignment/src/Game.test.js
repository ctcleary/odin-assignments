import Game from "./Game.js";

it('Game correctly sets up initial conditions', () => {
    const g = new Game();

    expect(g.size).toEqual([20,20]);

    expect(g.gameboards.playerOne).toStrictEqual(g.playerOne.ownGB);
    expect(g.gameboards.playerTwo).toStrictEqual(g.playerOne.oppGB);

    expect(g.gameboards.playerTwo).toEqual(g.playerTwo.ownGB);
    expect(g.gameboards.playerOne).toEqual(g.playerTwo.oppGB);
})

