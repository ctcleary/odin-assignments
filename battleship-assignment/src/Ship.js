class Ship {
    constructor(length = 1, xy = [-1,-1], isHori = true) {
        this.length = length;
        this.hits = [];

        // console.log('shipCoords', this.determineCoords(length, xy, isHori));
        this.shipCoords = this.determineCoords(length, xy, isHori);

        this.representation = this.setRepresentation(length);
    }

    setBus(messageBus) {
        this.bus = messageBus;
    }

    // Returns true if xy hits or the ship is sunk.
    hit(xy) {
        if (!xy) {
            throw new Error('Ship.hit() was given invalid coordinates.');
        }

        if (this.getHitCt() >= this.length) {
            return true;
        }

        if (this.areShipCoords(xy)) {
            this.hits.push(xy);
            return true;
        }

        return false;
    }

    areShipCoords(xy) {
        const foundHit = this.shipCoords.find((coord) => {
            return coord[0] === xy[0] && coord[1] === xy[1];
        });

        return !!foundHit;
    }

    getHits() {
        return this.hits;
    }

    getHitCt() {
        return this.hits.length;
    }

    isSunk() {
        // This relies on hit() functioning properly to determine invalid coords.
        return this.hits.length >= this.length;
    }

    getShipCoords() {
        return this.shipCoords;
    }

    setShipCoords(xy, isHori) {
        this.shipCoords = this.determineCoords(this.length, xy, isHori);
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

    setRepresentation(length) {
        let representation = '';
        switch(length) {
            case 4:
                representation = '<==}';
                break;
            case 3:
                representation = '<=}';
                break;
            case 2:
                representation = '<}';
                break;
            case 1:
            default:
                representation = '0';
                break;
        }

        return representation;
    }

    // setGameboard(gb) {
    //     this.gb = gb;
    //     this.gb.addEventListener('hit', this.hitListener);
    // }

    // hitListener(e) {
    //     const hitCoords = e.detail.xy;
    //     if (this.areShipCoords(hitCoords)) {
    //         this.hit(hitCoords);
    //         return this.getHits();
    //     }
        
    //     return false;
    // }
}

export default Ship;
