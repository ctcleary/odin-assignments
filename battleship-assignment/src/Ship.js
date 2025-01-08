class Ship {
    constructor(length = 1, x = 0, y = 0, isHori = true) {
        this.length = length;
        this.hitCt = 0;

        this.coords = this.determineCoords(length, x, y, isHori);
    }

    // Returns true if the ship is sunk.
    hit() {
        if (this.hitCt >= this.length) {
            throw new Error('Ship.hit() called on a Ship that is already sunk.');
        }

        this.hitCt += 1;

        return this.isSunk();
    }

    isSunk() {
        return this.hitCt >= this.length;
    }

    // x,y is always the START node of the array
    determineCoords(length, x, y, isHori) {
        const coords = [];

        for (let i = 0; i < length; i++) {
            const currX = isHori ? x + i : x;
            const currY = !isHori? y + i : y;

            coords.push([currX, currY]);
        }

        return coords;
    }
}

export default Ship;
