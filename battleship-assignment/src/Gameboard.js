import Ship from "./Ship.js";
import MessageBus from "./MessageBus.js";
import { PLAYER } from "./Player.js";

class Gameboard {
    constructor(game, playerStr = null) {
        this.size = game.size;
        this.hits = [];
        this.player = playerStr;

        this.bus = new MessageBus();

        this.ships = [
            { id: '4-1', player: this.player, ship: new Ship(4) },

            { id: '3-1', player: this.player, ship: new Ship(3) },
            { id: '3-2', player: this.player, ship: new Ship(3) },

            { id: '2-1', player: this.player, ship: new Ship(2) },
            { id: '2-2', player: this.player, ship: new Ship(2) },
            { id: '2-3', player: this.player, ship: new Ship(2) },

            { id: '1-1', player: this.player,  ship: new Ship(1) },
            { id: '1-2', player: this.player, ship: new Ship(1) },
            { id: '1-3', player: this.player, ship: new Ship(1) },
            { id: '1-4', player: this.player, ship: new Ship(1) },
        ];
    }

    setShipCoords(shipId, xy, isHori) {
        const shipObj = this.ships.find((shipObj) => { return shipObj.id === shipId; });
        shipObj.ship.setShipCoords(xy, isHori);
    }

    setBus(messageBus) {
        this.bus = messageBus;
        // this.getShips().forEach((shipObj) => {
        //     shipObj.ship.setBus(this.bus);
        // })
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

        // console.log('Gameboard receiveHit', xy);
        let isShipHit = false;
        this.getShips().forEach((shipObj) => {
            const didHit = shipObj.ship.hit(xy);
            if (didHit) {
                // console.log('didHit '+ shipObj.id);
                isShipHit = true;
            }
        });

        // this.bus.publish(this.player + '-hit', { xy: xy });

        // console.log('1 :: this.hits.length', this.hits.length);
        this.hits.push({ xy: xy, shipHit: isShipHit });
        // console.log('2 :: this.hits.length', this.hits.length);

        const allShipsSunk = this.allShipsSunk();

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

        ship.setBus(this.bus);

        this.ships.push(ship);


        return ship;
    }

    getShips() {
        return this.ships;
    }

    getShipByID(shipID) {
        return this.getShips().find((shipObj) => {
            return shipObj.id === shipID;
        });
    }

    lose() {
        this.bus.publish(this.player+'-lose');
        // const loseEv = new Event('lose');
        // this.dispatchEvent(loseEv);
    }

    getPlayer() {
        return this.player;
    }

    allShipsSunk() {
        return this.getShips().every((shipObj) => { return shipObj.ship.isSunk(); })
    }

    allShipsPlaced() {
        return this.getShips().every((shipObj) => { return shipObj.ship.getShipCoords()[0][0] !== -1; })
    }

    findOccupiedCoords(doPad = false) {
        // console.log('findOccupiedCoords');
        const ships = this.getShips().map((shipObj) => { return shipObj.ship });
        let occupiedCoords = [];

        for (let i = 0; i < ships.length; i++) {
            const ship = ships[i];
            const shipCoordsArr = ship.getShipCoords();
            if (shipCoordsArr[0][0] === -1) {
                continue;
            }

            if (doPad) {
                const paddedShipCoordsArr = shipCoordsArr.slice();
                const arrLen = shipCoordsArr.length;
                const lastIndex = arrLen-1;
                if (ship.isHori) {
                    paddedShipCoordsArr.push( [ shipCoordsArr[0][0] - 1, shipCoordsArr[0][1] ] ) // fore padding
                    paddedShipCoordsArr.push( [ shipCoordsArr[lastIndex][0] + 1, shipCoordsArr[lastIndex][1] ] ) // aft padding
                    
                    for (let j = 0; j < shipCoordsArr.length; j++) { // For each hori coord
                        const origCoords = shipCoordsArr[j];
                        paddedShipCoordsArr.push([ origCoords[0], origCoords[1] + 1]); // y+1
                        paddedShipCoordsArr.push([ origCoords[0], origCoords[1] - 1]); // y-1
                    }

                } else {
                    paddedShipCoordsArr.push( [ shipCoordsArr[0][0], shipCoordsArr[0][1] - 1 ] ) // fore padding
                    paddedShipCoordsArr.push( [ shipCoordsArr[lastIndex][0], shipCoordsArr[lastIndex][1] + 1 ] ) // aft padding
                    
                    for (let j = 0; j < shipCoordsArr.length; j++) {
                        const origCoords = shipCoordsArr[j];
                        paddedShipCoordsArr.push([ origCoords[0] + 1, origCoords[1]]); // x+1
                        paddedShipCoordsArr.push([ origCoords[0] - 1, origCoords[1]]); // x-1
                    }
                }
                occupiedCoords = occupiedCoords.concat(paddedShipCoordsArr);
            } else {
                occupiedCoords = occupiedCoords.concat(shipCoordsArr);
            }
        }

        return occupiedCoords;
    }

    findOccupiedCoordsPadded() {
        return this.findOccupiedCoords(true);
    }

    unplaceAllShips() {
        const ships = this.getShips().map((shipObj) => { return shipObj.ship });
        ships.forEach((ship) => {
            ship.setShipCoords([-1,-1], true);
        });
    }

    findConflictingCoords(occupiedArr, shipCoordsArr) {
        // I wonder if theres a better way to do this?
        return occupiedArr.find((occ) => {
            return shipCoordsArr.find((shipCoord) => {
                return shipCoord[0] === occ[0] && shipCoord[1] === occ[1];
            })
        })
    }

    randomizeAllShips() {
        const ships = this.getShips().map((shipObj) => { return shipObj.ship });
        ships.forEach((ship) => {
            const occArr = this.findOccupiedCoordsPadded();
            let foundValidCoords;
            let isHori;
            while (!foundValidCoords) {
                const x = 1 + Math.round(Math.random()*9);
                const y = 1 + Math.round(Math.random()*9);
                isHori = Math.random() > 0.5 ? true : false;
                const detCoords = ship.determineCoords([x,y], ship.getLength(), isHori);

                const valid = detCoords.every((xy) => {
                    return this.areValidCoords(xy)
                });

                if (valid && !this.findConflictingCoords(occArr, detCoords)) {
                    foundValidCoords = detCoords;
                }
            }
            console.log(isHori);
            ship.setShipCoords(foundValidCoords[0], isHori);
        });
    }
}

export default Gameboard;
