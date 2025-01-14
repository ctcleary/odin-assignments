// import { PLAYER } from "./Player.js";

class ViewShipPlacer {
    constructor(game, shipEl, shipObj, player) {
        this.id = 'shipPlacer-'+player+'-'+shipObj.id; // e.g. 'shipPlacer-playerOne-4-1'
        this.game = game;
        this.bus = game.bus;
        this.player = player;
        this.shipEl = shipEl;
        this.shipObj = shipObj;

        this.mousePos = [null, null];

        this.attachEventHandlers(shipEl, shipObj, player);
    }

    attachEventHandlers(shipEl, shipObj, player) {
        shipEl.dataset.pickedUp = false;

        let mouseMoveHandler;
        let endClickHandler;

        shipEl.addEventListener('click', (evt) => {
            if (!!window.pickedUpShip) {
                return;
            }
            evt.stopPropagation();
            window.pickedUpShip = this.id;

            shipEl.classList.add('picked-up');
            shipEl.style.left = '';
            shipEl.style.top = '';
            shipEl.dataset.pickedUp = true;
            document.body.classList.add('picked-up-ship');

            const mouseMoveHandlerWrapper = (evt) => {
                this.mouseMoveHandler(evt, shipEl);
            }
            const spaceDownHandlerWrapper = (evt) => {
                console.log('keydown evt', evt);
                if (evt.code === 'Space') {
                    this.spaceDownHandler(evt, shipEl);
                }
            }
            const endClickHandlerWrapper = (evt) => {
                evt.stopPropagation();
                this.endClickHandler(evt, shipEl, shipObj);
                console.log('removeEventListeners');
                window.removeEventListener('mousemove', mouseMoveHandlerWrapper);
                window.removeEventListener('keydown', spaceDownHandlerWrapper);
                window.removeEventListener('click', endClickHandlerWrapper);
                window.pickedUpShip = null;
            }

            window.addEventListener('mousemove', mouseMoveHandlerWrapper);
            window.addEventListener('keydown', spaceDownHandlerWrapper);
            window.addEventListener('click', endClickHandlerWrapper);
        })
    }

    mouseMoveHandler(evt, shipEl) {
        const mousePos = [evt.clientX, evt.clientY];
        // console.log('mousePos', mousePos);
        // console.log(shipEl);
        this.mousePos = mousePos;
        if (shipEl.classList.contains('hori')) {
            shipEl.style.left = (mousePos[0]-20)+'px'; // -20 to put nose of ship at mouse point
            shipEl.style.top = (mousePos[1]-10)+'px'; // -10 to put nose of ship at mouse point
        } else {
            // shipEl.style.left = (mousePos[0]-100)+'px'; // -20 to put nose of ship at mouse point
            // shipEl.style.top = (mousePos[1]+50)+'px'; // -10 to put nose of ship at mouse point
            shipEl.style.left = (mousePos[0]-20)+'px'; // -20 to put nose of ship at mouse point
            shipEl.style.top = (mousePos[1]-10)+'px'; // -10 to put nose of ship at mouse point
        }
    }

    endClickHandler(evt, shipEl, shipObj) {
        console.log('endclick target', evt.target);
        const targetEl = evt.target;
        if (targetEl.classList.contains('cell')) {
            const xy = [
                parseInt(targetEl.dataset.x, 10),
                parseInt(targetEl.dataset.y, 10),
            ];
            const length = parseInt(shipObj.id.charAt(0), 10);
            const player = shipObj.player;
            const isHori = shipEl.classList.contains('hori');
            const isValidPlacement = (isHori && (xy[0]+length) <= 10) || (!isHori && (xy[1]+length) <= 10);
            console.log('isValidPlacement', isValidPlacement);

            if (isValidPlacement) {
                this.bus.publish('ship-placed', { shipId: shipObj.id, shipPlayer: shipObj.player, xy: xy});
                // TODO add subscription via Game for .. Gameboard? I think?
                shipEl.classList.add('hidden');
            }
        } else {
            // evt.stopPropagation();
            shipEl.classList.remove('vert');
            shipEl.classList.add('hori');
        }

        shipEl.classList.remove('picked-up');
        shipEl.dataset.pickedUp = false;

    }

    spaceDownHandler(evt, shipEl) {
        if (shipEl.classList.contains('hori')) {
            shipEl.classList.remove('hori');
            shipEl.classList.add('vert');
        } else {
            shipEl.classList.remove('vert');
            shipEl.classList.add('hori');
        }

        if (shipEl.classList.contains('hori')) {
            shipEl.style.left = (this.mousePos[0]-20)+'px'; // -20 to put nose of ship at mouse point
            shipEl.style.top = (this.mousePos[1]-10)+'px'; // -10 to put nose of ship at mouse point
        } else {
            shipEl.style.left = (this.mousePos[0]-20)+'px'; // -20 to put nose of ship at mouse point
            shipEl.style.top = (this.mousePos[1]-10)+'px'; // -10 to put nose of ship at mouse point
        }
    }
}

export default ViewShipPlacer;
