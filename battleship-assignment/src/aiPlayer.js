const aiPlayer = (function() {
    function findAttackCoords(humanHits) {
        if (humanHits.length === 0) {
            return getRandomXY();
        }

        const foundShipHitCoordsArr = humanHits.filter((hit) => {
            if (hit.isSunk || !hit.shipHit) {
                return false;
            }
            return true;
        })
        console.log(foundShipHitCoordsArr);
        if (foundShipHitCoordsArr.length === 0) {
            return getRandomUnhitXY(humanHits);
        }
        return determineShipHitAttempt(humanHits, foundShipHitCoordsArr);
    };

    const direction = [
        [0,-1], //north
        [1,0],  //east
        [0,-1], //south
        [-1,0], //west
    ];

    function determineShipHitAttempt(humanHits, shipHits) {
        let validRandomHit = null;
        while (!validRandomHit) {
            const randomHit = shipHits[ Math.ceil(Math.random() * shipHits.length) - 1 ]
            if (hasOpenAdjacentCell(randomHit.xy, humanHits)) {
                validRandomHit = randomHit;
            }
        }

        console.log('validRandomHit', validRandomHit);
        let hitXY = null;
        while (!hitXY) {
            const newRandomDir = direction[Math.round(Math.random()*3)];
            const newCoords = addDirection(validRandomHit.xy, newRandomDir);
            if (isValidCoords(newCoords) && !isAlreadyHit(newCoords, humanHits)) {
                hitXY = newCoords;
            }
            // Otherwise continue the loop and search again.
        }

        return hitXY;
    }
    
    function hasOpenAdjacentCell(xy, humanHits) {
        const north = addDirection(xy, direction[0]);
        const east = addDirection(xy, direction[1]);
        const south = addDirection(xy, direction[2]);
        const west = addDirection(xy, direction[3]);

        const openAdjacent = [north,east,south,west].find((xy) => {
            return isValidCoords(xy) && !isAlreadyHit(xy, humanHits)
        })

        return !!openAdjacent ? true : false;
    }

    function addDirection(xy, dir) {
        return [ xy[0] + dir[0], xy[1] + dir[1] ];
    }

    function isValidCoords(xy) {
        return xy[0] > 0 && xy[0] <= 10 && xy[1] > 0 && xy[1] <= 10;
    }
    function isAlreadyHit(xy, humanHits) {
        return humanHits.find((hit) => {
            return hit.xy[0] === xy[0] && hit.xy[1] === xy[1];
        });
    }

    function getRandomUnhitXY(humanHits) {
        let cleanHit = null;
        while (!cleanHit) {
            const xy = getRandomXY();
            const alreadyAttacked = humanHits.find((hit) => { return xy[0] === hit.xy[0] && xy[1] === hit.xy[1]});
            if (!alreadyAttacked) {
                cleanHit = xy;
            }
        }

        return cleanHit;
    }

    function getRandomXY() {
        const x = 1 + Math.round(Math.random()*9);
        const y = 1 + Math.round(Math.random()*9);

        return [x,y];
    };

    return {
        findAttackCoords
    };
})();

export default aiPlayer;