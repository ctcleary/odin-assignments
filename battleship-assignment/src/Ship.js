class Ship {
    constructor(length = 1, xy = [0,0], isHori = true) {
        this.length = length;
        this.hits = [];

        this.coords = this.determineCoords(length, xy, isHori);
    }

    // Returns true if xy hits and the ship is sunk.
    hit(xy) {
        if (this.getHitCt() >= this.length) {
            return true;
        }

        if (!xy) {
            throw new Error('Ship.hit() was given invalid coordinates.');
        }

        if (this.areShipCoords(xy)) {
            this.hits.push(xy);
        }

        return this.isSunk();
    }

    areShipCoords(xy) {
        const foundHit = this.coords.find((coord) => {
            return coord[0] === xy[0] && coord[1] === xy[1];
        });

        return !!foundHit;
    }

    getHits() {
        return this.hits.slice();
    }

    getHitCt() {
        return this.hits.length;
    }

    isSunk() {
        // This relies on hit() functioning properly to determine invalid coords.
        return this.hits.length >= this.length;
    }

    // x,y is always the START node of the array
    determineCoords(length, xy, isHori) {
        const coords = [];

        for (let i = 0; i < length; i++) {
            const currX = isHori ? xy[0] + i : xy[0];
            const currY = !isHori? xy[1] + i : xy[1];

            coords.push([currX, currY]);
        }

        return coords;
    }

    // setGameboard(gb) {
    //     this.gb = gb;
    //     this.gb.addEventListener('hit', this.hitListener);
    // }

    hitListener(e) {
        const hitCoords = e.detail.xy;
        if (this.areShipCoords(hitCoords)) {
            this.hit(hitCoords);
            return this.getHits();
        }
        
        return false;
    }
}

export default Ship;
