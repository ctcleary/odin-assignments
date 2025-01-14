class Ship {
    constructor(length = 1, xy = [-1,-1], isHori = true) {
        this.length = length;
        this.hits = [];
        this.isHori = isHori;

        // console.log('shipCoords', this.determineCoords(xy, length, isHori));
        this.shipCoords = this.determineCoords(xy, length, isHori);
        this.imgSrc = this.setImgSrc(length);
    }

    setBus(messageBus) {
        this.bus = messageBus;
    }

    // Returns xy hits or the ship is sunk.
    hit(xy) {
        if (!xy) {
            throw new Error('Ship.hit() was given invalid coordinates.');
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
        this.isHori = isHori;
        this.shipCoords = this.determineCoords(xy, this.length, isHori);
    }

    // x,y is always the START node of the array
    determineCoords(xy, length, isHori) {
        const coords = [];

        for (let i = 0; i < length; i++) {
            const currX = isHori ? xy[0] + i : xy[0];
            const currY = !isHori? xy[1] + i : xy[1];

            coords.push([currX, currY]);
        }

        return coords;
    }
    
    getImgSrc() {
        return this.imgSrc;
    }

    setImgSrc(length) {
        let imgSrc;

        switch (length) {
            case 4:
                imgSrc = './assets/battleship-length4.png';
                break;
            case 3:
                imgSrc = './assets/battleship-length3.png';
                break;
            case 2:
                imgSrc = './assets/battleship-length2.png';
                break;
            case 1:
            default:
                imgSrc = './assets/battleship-length1.png';
                break;
        }

        return imgSrc;
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
