const DIRECTION = {
    NORTH: 0,
    EAST: 1,
    SOUTH: 2,
    WEST: 3,
};

const directionMod = [
    [0,-1], //north
    [1,0],  //east
    [0,-1], //south
    [-1,0], //west
];


class AIPlayer {
    constructor() {

    }

    findAttackCoords(humanHits) {
        if (humanHits.length === 0) {
            return this.getRandomUnhitXY([]);
        }

        const foundShipHitCoordsArr = humanHits.filter((hit) => {
            if (hit.isSunk || !hit.shipHit) {
                return false;
            }
            return true;
        })
        console.log('foundShipHitCoordsArr.length', foundShipHitCoordsArr.length);
        if (foundShipHitCoordsArr.length === 0) {
            return this.getRandomUnhitXY(humanHits);
        }
        if (foundShipHitCoordsArr.length === 1) {
            return this.determineShipHitAttempt(humanHits, foundShipHitCoordsArr[0]);
        }
        if (foundShipHitCoordsArr.length > 1) {
            return this.determineShipSinkAttempt(humanHits, foundShipHitCoordsArr);
        }
    };



    determineShipHitAttempt(humanHits, shipHit) {
        let hitXY = null;
        let uncheckedDirs = [0, 1, 2, 3];
        while (!hitXY) {
            let newDirIdx = Math.round(Math.random()*(uncheckedDirs.length-1)); // 0 - 3 at first
            // if (uncheckedDirs.indexOf(newDirIdx) === -1) {
            //     continue; // Just start again if we've already checked this direction.
            //     // I'm sure there's a more performant way to do this, but this seems fine for this application..
            // }
            const newDirValue = uncheckedDirs[newDirIdx]; // Get value before removing it from array.

            console.log('checkedDirs before splice', uncheckedDirs);
            console.log('newDirIdx', newDirIdx);
            console.log('newDirValue', newDirValue);
            uncheckedDirs.splice(newDirIdx, 1); // Remove the item from array.
            console.log('checkedDirs after splice', uncheckedDirs);

            const mod = directionMod[newDirValue];
            console.log('mod',mod);

            const newCoords = this.addDirection(shipHit.xy, mod);
            if (this.isValidCoords(newCoords) && !this.isAlreadyHit(newCoords, humanHits)) {
                hitXY = newCoords;
            }
            // Otherwise continue the loop and search again.
        }

        return hitXY;
    }

    determineShipSinkAttempt(humanHits, foundShipHitCoordsArr) {
        const isHori = this.determineShipAlignment(foundShipHitCoordsArr);

        console.log('foundShipHitCoordsArr', foundShipHitCoordsArr)
        if (isHori) {
            const xSorted = this.xSortHits(foundShipHitCoordsArr);
            console.log('xSorted', xSorted)
            const westCoords = [ xSorted[0].xy[0]-1, xSorted[0].xy[1] ];
            const westFree = (this.isValidCoords(westCoords) && !this.isAlreadyHit(westCoords, humanHits));
            if (westFree) {
                return westCoords;
            }
            const lastHit = xSorted[xSorted.length-1];
            const eastCoords = [ lastHit.xy[0]+1, lastHit.xy[1] ];
            return eastCoords;
                
        } else {
            const ySorted = this.ySortHits(foundShipHitCoordsArr);
            console.log('ySorted', ySorted)
            const northCoords = [ ySorted[0].xy[0], ySorted[0].xy[1]-1 ];
            const northFree = (this.isValidCoords(northCoords) && !this.isAlreadyHit(northCoords, humanHits));
            if (northFree) {
                return northCoords;
            }
            const lastHit = ySorted[ySorted.length-1];
            const southCoords = [ lastHit.xy[0], lastHit.xy[1]+1 ];
            return southCoords;
        }
    }

    determineShipAlignment(hitsArr) {
        const hits = hitsArr.slice();
        const xSorted = this.xSortHits(hitsArr);
        // console.log('xSorted', xSorted);

        const isHori = (xSorted[0].xy[0]+1 === xSorted[1].xy[0]);

        // console.log('ship to be sunk is hori', isHori);

        return isHori;
    }

    xSortHits(hitsArr) {
        return hitsArr.slice().sort((a, b) => {
            if (a.xy[0] >= b.xy[0]) {
                return 1;
            } else {
                return -1;
            }
        });
    }
    
    ySortHits(hitsArr) {
        return hitsArr.slice().sort((a, b) => {
            if (a.xy[1] >= b.xy[1]) {
                return 1;
            } else {
                return -1;
            }
        });
    }
    
    hasOpenAdjacentCell(xy, humanHits) {
        const north = this.addDirection(xy, directionMod[DIRECTION.NORTH]);
        const east = this.addDirection(xy, directionMod[DIRECTION.EAST]);
        const south = this.addDirection(xy, directionMod[DIRECTION.SOUTH]);
        const west = this.addDirection(xy, directionMod[DIRECTION.WEST]);

        const openAdjacent = [north,east,south,west].find((xy) => {
            return this.isValidCoords(xy) && !this.isAlreadyHit(xy, humanHits)
        })

        return !!openAdjacent ? true : false;
    }

    addDirection(xy, mod) {
        return [ xy[0] + mod[0], xy[1] + mod[1] ];
    }

    isValidCoords(xy) {
        return xy[0] > 0 && xy[0] <= 10 && xy[1] > 0 && xy[1] <= 10;
    }

    isAlreadyHit(xy, humanHits) {
        if (humanHits.length === 0) {
            return false;
        }

        const findMatch = humanHits.find((hit) => {
            return hit.xy[0] === xy[0] && hit.xy[1] === xy[1];
        });
        if (!!findMatch) {
            console.log('alreadyhit', xy);
        }
        return !!findMatch;
    }

    getRandomUnhitXY(humanHits) {
        let cleanHit = null;
        while (!cleanHit) {
            const xy = this.getRandomXY();            
            if (!this.isAlreadyHit(xy, humanHits)) {
                cleanHit = xy;
            }
        }

        return cleanHit;
    }

    getRandomXY() {
        const x = 1 + Math.round(Math.random()*9);
        const y = 1 + Math.round(Math.random()*9);

        return [x,y];
    }
}

//     return {
//         findAttackCoords
//     };
// })();

const aiPlayer = new AIPlayer();
export { aiPlayer }
export default AIPlayer;
