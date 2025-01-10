class Player {
    constructor(playerStr, ownGameboard, oppGameboard) {
        this.player = playerStr;
        
        this.ownGB = ownGameboard;
        this.oppGB = oppGameboard;
    }

    attack(xy) {
        this.oppGB.receiveAttack(xy);
    }
}

export default Player;
