class Player {
    constructor(ownGameboard, oppGameboard) {
        this.ownGB = ownGameboard;
        this.oppGB = oppGameboard;
    }

    attack(xy) {
        this.oppGB.receiveAttack(xy);
    }
}

export default Player;
