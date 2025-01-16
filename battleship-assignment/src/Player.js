const PLAYER = {
    ONE: 'playerOne',
    TWO: 'playerTwo',
};

const AI_PLAYER = {
    HUMAN: 'human',
    AI: 'ai',
}

class Player {
    constructor(playerStr, ownGameboard, oppGameboard) {
        this.player = playerStr;

        this.ownGB = ownGameboard;
        this.oppGB = oppGameboard;
    }

    attack(xy) {
        this.oppGB.receiveHit(xy);
    }
}

export { PLAYER, AI_PLAYER };
export default Player;
