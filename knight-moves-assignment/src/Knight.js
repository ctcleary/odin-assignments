class Knight {
    constructor() {
        this.moveOpts = [
            [2, 1],
            [2, -1],
            [1, 2],
            [1, -2],
            [-2, 1],
            [-2, -1],
            [-1, 2],
            [-1, -2],
        ];
    }

    moves(fromCoords, toCoords) {
        if (!this.#areValidCoords(fromCoords) || !this.#areValidCoords(toCoords)) {
            throw new Error('Invalid coordinates provided. Coordinates must be 0 - 7.')
        }

        // Will console.log some stuff when it finds a successful path.
        this.#doMoves({ 
            toCoords: toCoords, 
            movesRecords: [[fromCoords]], 
            visited: [fromCoords],
        });
    }

    /* movesObj.movesRecords examples:
            movesObj.movesRecords ===
            1st call : [ [0,0] ]
            
            movesObj.movesRecords ===
            2nd rec call :: [ 
                    [ [0,0], [2,1] ]
                    [ [0,0]. [1,2] ] 
                ]
                    
            movesObj.movesRecords ===
            3rd rec call :: [ 
                    [ [0,0], [2,1], [4,2] ],
                    [ [0,0], [2,1], [4,0] ],
                    [ [0,0], [2,1], [3,3] ],
                    [ [0,0], [2,1], [3,-1] ], -X- INVALID - off board
                    [ [0,0], [2,1], [0,2] ],
                    [ [0,0], [2,1], [0,0] ], -X- INVALID - already visited
                    [ [0,0], [2,1], [1,3] ],
                    [ [0,0], [2,1], [0,-1] ], -X- INVALID - off board

                    [ [0,0], [1,2], [3,4] ],
                    [ [0,0], [1,2], [3,1] ],
                    [ [0,0], [1,2], [2,4] ],
                    [ [0,0], [1,2], [2,0] ],
                    [ [0,0], [1,2], [-1,3] ], -X- INVALID - off board
                    [ [0,0], [1,2], [-1,1] ], -X- INVALID - off board
                    [ [0,0], [1,2], [0,4] ], -X- INVALID - already been visited in another current-call path
                    [ [0,0], [1,2], [0,0] ], -X- INVALID - already visited
                ]
    */
    #doMoves(movesObj) {
        // console.log('movesRecord path ct:', movesObj.movesRecords.length)

        const visitedArray = movesObj.visited;
        const toCoords = movesObj.toCoords;
        const newMovesRecords = []

        for (let i = 0; i < movesObj.movesRecords.length; i++) {
            const movesRecord = movesObj.movesRecords[i]; // [ [0,0], [2,1], ... ]
            const currCoords = movesRecord[movesRecord.length-1];

            // Get an array of coordinates that are from valid moves.
            const nextValidCoordsArr = this.getValidMoveCoords(currCoords, visitedArray);

            // nextValidCoordsArr.forEach((validCoords) => {
            for (let i = 0; i < nextValidCoordsArr.length; i++) {
                const validCoords = nextValidCoordsArr[i];
                const movesRecordCopy = movesRecord.slice();
                   
                if (this.#coordsEqual(validCoords, toCoords)) {
                    // Found a successful shortest path.
                    movesRecordCopy.push(validCoords);
                    console.log(`You made it in ${movesRecordCopy.length} moves! Here's your path:`)
                    movesRecordCopy.forEach((coords) => {
                        console.log(coords);
                    })
                    return movesRecordCopy;
                }

                visitedArray.push(validCoords); // Catalog all visited nodes.
                movesRecordCopy.push(validCoords); // Add current coords to this movesRecord
                newMovesRecords.push(movesRecordCopy);
            };
        };

        // We have not yet found successful shortest path
            // do another iteration
        return this.#doMoves({ 
            toCoords: toCoords, 
            movesRecords: newMovesRecords, 
            visited: visitedArray,
        });
    }

    // Because for `var x = [3,1]; var y = [3,1];` x DOES NOT EQUAL y!
    #coordsEqual(coordsA, coordsB) {
        return coordsA[0] === coordsB[0] && coordsA[1] === coordsB[1];
    }


    getDiff(fromCoords, toCoords) {
        // fromCoords [3, 2];
            // toCoords [6, 7];
        const xDiff = Math.abs(fromCoords[0] - toCoords[0]);
        const yDiff = Math.abs(fromCoords[1] - toCoords[1]);
        // console.log('xDiff:',xDiff,'yDiff:',yDiff);
        return xDiff + yDiff;
    }

    // Returns an array of [coords, coords, ...] for each valid move.
    getValidMoveCoords(fromCoords, visitedArray) {
        const validMoveOpts = this.moveOpts.slice().filter((move) => {
            const nextCoords = [fromCoords[0] + move[0], fromCoords[1] + move[1]];

            return this.#notAlreadyVisited(nextCoords, visitedArray) && this.#areValidCoords(nextCoords);
        });
        // validMoveOpts ex: [2,1], [-2, 1], [-1, -2], etc.
        return validMoveOpts.map((validMoveOpt) => { 
            return [ 
                fromCoords[0] + validMoveOpt[0], 
                fromCoords[1] + validMoveOpt[1] 
            ]
        });
    }

    #areValidCoords(coords) {
        return coords[0] >= 0 && coords[0] <= 7 && coords[1] >= 0 && coords[1] <= 7;
    }

    #notAlreadyVisited(coords, visitedArray) {
        for (let i = 0; i < visitedArray.length; i++) {
            const prevMoveCoords = visitedArray[i];
            if (coords[0] === prevMoveCoords[0] && coords[1] === prevMoveCoords[1]) {
                return false;
            }
        }

        return true;
    }
}

export default Knight;
