import AIPlayer from "./AIPlayer.js";

it('AIPlayer ySortHits correctly sorts vertical hits', () => {
    const ai = new AIPlayer();
    const hits = [ { xy: [4,7] }, { xy: [4,5] }, { xy: [4,6] } ];

    // console.log('ai.ySortHits(hits)', ai.ySortHits(hits));
    expect(ai.ySortHits(hits)).toStrictEqual([ { xy: [4,5] }, { xy: [4,6] }, { xy: [4,7] } ]);
});

it('AIPlayer xSortHits correctly sorts horizontal hits', () => {
    const ai = new AIPlayer();
    const hits = [ { xy: [7,4] }, { xy: [5,4] }, { xy: [6,4] } ];

    // console.log('ai.xSortHits(hits)', ai.ySortHits(hits));
    expect(ai.xSortHits(hits)).toStrictEqual([ { xy: [5,4] }, { xy: [6,4] }, { xy: [7,4] } ]);
});

it('AIPlayer isAlreadyHit returns correctly', () => {
    const ai = new AIPlayer();
    const hits = [ { xy: [5,4] }, { xy: [6,4] }, { xy: [7,4] } ];

    expect(ai.isAlreadyHit([5,4], hits)).toBe(true);
    expect(ai.isAlreadyHit([6,4], hits)).toBe(true);
    expect(ai.isAlreadyHit([7,4], hits)).toBe(true);
    expect(ai.isAlreadyHit([5,5], hits)).toBe(false);
    expect(ai.isAlreadyHit([6,5], hits)).toBe(false);
    expect(ai.isAlreadyHit([7,5], hits)).toBe(false);
});

it('AIPlayer.determineShipHitAttempt() returns the correct coordinates', () => {
    const ai = new AIPlayer();
    const hits = [ { xy: [7,3], shipHit: true }, { xy: [6,3] }, { xy: [7,2] }, { xy: [8,3] } ];

    expect(ai.determineShipHitAttempt(hits, hits[0])).toEqual([7,4]);

})

