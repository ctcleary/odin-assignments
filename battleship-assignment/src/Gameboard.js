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

        const allShipsSunk = this.getShips().every((shipObj) => { return shipObj.ship.isSunk(); });

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

    lose() {
        this.bus.publish(PLAYER.TWO + '-lose');
        // const loseEv = new Event('lose');
        // this.dispatchEvent(loseEv);
    }

    getPlayer() {
        return this.player;
    }
}

export default Gameboard;
