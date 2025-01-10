import Ship from "./Ship.js";

class Gameboard {
    constructor(size = [20,20], playerStr = null) {
        this.size = size;
        this.hits = [];
        this.ships = [];
        this.player = playerStr;
    }

    areValidCoords(xy) {
        return xy[0] <= this.size[0] && xy[1] <= this.size[1];
    }

    getHits() {
        return this.hits.slice();
    }

    isAlreadyHit(xy) {
        return !!this.getHits().find((hit) => {
            return hit[0] === xy[0] && hit[1] === xy[1];
        });
    }

    receiveAttack(xy) {
        if (!this.areValidCoords(xy))
            throw new Error('Invalid coords provided to Gameboard.receiveAttack()');

        if (this.isAlreadyHit(xy))
            throw new Error('Coords provided to Gameboard.receiveAttack(xy) were already hit!');


        this.hits.push(xy);
        // this.dispatchHitEv(xy);

        this.getShips().forEach((ship) => {
            ship.hit(xy);
        });

        const allShipsSunk = this.getShips().every((ship) => { return ship.isSunk(); });

        if (allShipsSunk) {
            this.lose();
        }

        return this.hits.slice();
    }

    // dispatchHitEv(xy) {
    //     const hitEv = new CustomEvent('hit', { detail: { xy: xy } });
    //     this.dispatchEvent(hitEv);
    // }

    registerShip(length, xy, isHori) {
        const ship = new Ship(length, xy, isHori);

        this.ships.push(ship);

        return ship;
    }

    getShips() {
        return this.ships.slice();
    }

    lose() {
        // const loseEv = new Event('lose');
        // this.dispatchEvent(loseEv);
    }

    getPlayer() {
        return this.player;
    }
}

export default Gameboard;
