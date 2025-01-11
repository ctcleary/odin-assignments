import Ship from "./Ship.js";

class Gameboard {
    constructor(size = [10,10], playerStr = null) {
        this.size = size;
        this.hits = [];
        this.player = playerStr;
        
        //TODO - Decide what to do about default ship sizes [4,3,3,2,2,2,1,1,1]
        this.ships = [];
    }

    areValidCoords(xy) {
        return xy[0] <= this.size[0] && xy[1] <= this.size[1];
    }

    getHits() {
        return this.hits.slice();
    }

    isAlreadyHit(xy) {
        return !!this.getHits().find((hit) => {
            return hit.xy[0] === xy[0] && hit.xy[1] === xy[1];
        });
    }

    receiveHit(xy) {
        if (!this.areValidCoords(xy))
            throw new Error('Invalid coords provided to Gameboard.receiveAttack()');

        if (this.isAlreadyHit(xy))
            throw new Error('Coords provided to Gameboard.receiveAttack(xy) were already hit!');

        let isShipHit = false;
        this.getShips().forEach((ship) => {
            const didHit = ship.hit(xy);
            if (didHit) {
                isShipHit = true;
            }
        });

        this.hits.push({ xy: xy, shipHit: isShipHit });

        const allShipsSunk = this.getShips().every((ship) => { return ship.isSunk(); });

        if (allShipsSunk) {
            this.lose();
        }

        return isShipHit;
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
