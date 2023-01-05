import Square from "./square.js";
import { play } from "./app.js";

// --------------------------------- B O A R D -------------------------------
export default class Board {

    squares = [];
    ids = [];
    bearSquares = [];
    flaggedSquares = []
    clearedSquares = new Set();
    
    constructor(size=16, bearCount=40) {
        this.size = size;
        this.bearCount = bearCount;
        this.createGrid();
    }

    createGrid() {
        this.setRootVariables();
        this.addSquares(this.setBoardContainer());
        this.linkAdjacentSquares();
        this.addBears();
        this.addNewGameBtn();
        this.updateFlagCounter();
    }

    linkAdjacentSquares() {
        this.squares.forEach(row => {
            row.forEach(square => square.setAdjacentSquares());
         })
    }


    // ----------------- S E T    B O A R D ----------------------//
    setRootVariables() {
        document.querySelector(':root').style.setProperty('--display', 'none');
        document.querySelector(':root').style.setProperty('--grid-size', `${this.size}`);
    }

    setBoardContainer() {
        let board = document.querySelector('.board-wrapper');
        board.textContent = '';
        return board;
    }

    // ----------------- add squares and bears ----------------------//

    addSquares(boardContainer) {
        let id = 0;
        for (let row = 0; row < this.size; row++) {
            let squareRow = [];
            for (let col = 0; col < this.size; col++) {
                let square = new Square(this, id, row, col);
                this.ids.push(id++);
                squareRow.push(square);
                boardContainer.appendChild(square.div);
                console.log('A SQUARE');
            }
            this.squares.push(squareRow);
        } 
    }


    // --------------- generate bears ----------------------------------------
    addBears() {
        this.placeBears(this.pickRandomIDs(this.ids));
        this.markAroundBearSquares();
    }
    
    placeBears(randomIDsList) {
        for (let i = 0; i < this.bearCount; i++) {
            let square = this.idToSquare(randomIDsList[i]);
            square.placeBear();
            this.bearSquares.push(square);
        }
    }

    markAroundBearSquares() {
        for(let i = 0; i < this.bearCount; i++) {
            let row = this.bearSquares[i].row;
            let col = this.bearSquares[i].col;
            this.adjacentSquares(row, col, 'update');
         }
    }

    //  ------------ helpers--------

    pickRandomIDs(ids) {
        let idlist = ids.map((x) => x);
        return this.shuffle(idlist).splice(1, this.bearCount);
    }

    idToSquare(id) {
        return this.squares[Math.floor((id)/this.size)][id%this.size];
    }
    
    // Fisher–Yates shuffle
    shuffle(list) {
        let m = list.length, t, i;
        
        while (m) {
            i = Math.floor(Math.random() * m--);
            t = list[m];
            list[m] = list[i];
            list[i] = t;
        }
        return list;
    }
    

    // ---------------------------------------------------------------------

    adjacentSquares(row, col, action) {
        let count = 0;
        for (let r = row-1; r <= row+1; r++) {
            for(let c = col-1; c <= col+1; c++) {
                if (r < 0 || r > this.size - 1 || c < 0 || c > this.size - 1 || r == row && c == col) {
                    // console.log('sq:', row, col, 'n:', r, c);
                    continue;
                } else {
                    switch(true) {
                        case (action ===  'update'):
                            this.squares[r][c].updateValue();
                            break;
                        case (action === 'getflags'):
                            count += (this.squares[r][c].flagged == 'yes');
                            break;
                        case (action === 'chord'):
                            if (this.squares[r][c].status === 'hidden' && this.squares[r][c].flagged === 'no') {
                                if (this.squares[r][c].value === 'bear') {
                                    this.squares[r][c].div.style.backgroundColor = '#dfb1b3';
                                    this.gameOver();
                                } else if (this.squares[r][c].value == null) {
                                    this.clearArea(this.squares[r][c]);
                                } else {
                                    this.squares[r][c].showSquare();
                                }
                            }
                    }
                }
            }
        }
        return count;
    }

    clearArea(square) {
        // already visible:
        if (square.status !== 'hidden') {
            return;
        }

        // Hidden numbers: 
        if (square.value) {
            square.showSquare();
            return;
        }

        // Empty squares:
        square.showSquare();

        if (square.n) {
            this.clearArea(square.n);
            if (square.n.value) this.checkCorners(square);
        }
        if (square.e) {
            this.clearArea(square.e);
            if (square.e.value) this.checkCorners(square);
        }
        if (square.s) {
            this.clearArea(square.s);
            if (square.s.value) this.checkCorners(square);
        }
        if (square.w) {
            this.clearArea(square.w);
            if (square.w.value) this.checkCorners(square);
        }
    }

    checkCorners(square) {
        if (square.nw && square.n.value && square.w.value) {
            square.nw.value ? square.nw.showSquare() : this.clearArea(square.nw);
        } 
        if (square.ne && square.n.value && square.e.value) {
            square.ne.value ? square.ne.showSquare() : this.clearArea(square.ne);
        }
        if (square.sw && square.s.value && square.w.value) {
            square.sw.value ? square.sw.showSquare() : this.clearArea(square.sw);
        }
        if (square.se && square.s.value && square.e.value) {
            square.se.value ? square.se.showSquare() : this.clearArea(square.se);
        }
    }

    // ------------ N E W   G A M E / G A M E   O V E R -------//

    addNewGameBtn() {
        document.querySelector('.new-game-btn').addEventListener('click', this.newGame.bind(this));
    }

    newGame() {
        document.querySelector('.new-game-btn').replaceWith(document.querySelector('.new-game-btn').cloneNode(true));
        play();
    }

    gameOver() {
        this.showAllBears();
        this.showWrongFlags();
        document.querySelector('.game-message').textContent = 'Game over';
        document.querySelector(':root').style.setProperty('--display', 'flex');
    }

    showAllBears() {
        for (let bear of this.bearSquares) {
            bear.showBear();
        }
    }

    // -------------------- F L A G S -----------------------//

    addFlaggedSquare(square) {
        this.flaggedSquares.push(square);
        this.updateFlagCounter();
    }

    removeFlaggedSquare(square) {
        this.flaggedSquares.splice(this.flaggedSquares.indexOf(square), 1);
        this.updateFlagCounter();
    }

    showWrongFlags() {
        for (let square of this.flaggedSquares) {
            square.showWrongFlag();
        }
    }

    checkFlags() {
        let i = 0;
        while (this.flaggedSquares.length > 0 && i < this.flaggedSquares.length) {
            if (this.flaggedSquares[i].flagged == 'no') {
                this.removeFlaggedSquare(this.flaggedSquares[i]);
                i--;
            }
            i++;
        }
    }

    updateFlagCounter() {
        document.querySelector('.paws').textContent = `Bears: ${this.bearCount - this.flaggedSquares.length}`;
    }
    
    // -------------- C H O R D I N G ------------------------//

    chord(square) {
        if (this.getAdjacentFlags(square) == square.value) {
            this.adjacentSquares(square.row, square.col, 'chord');
            return true;
        }
    }

    getAdjacentFlags(square) {
        return this.adjacentSquares(square.row, square.col, 'getflags');
    }

    // ----------------------- W I N -------------------------//

    addClearedSquare(id) {
        this.clearedSquares.add(id);
        this.checkWin();
    }

    checkWin() {
        if (this.clearedSquares.size == this.size ** 2 - this.bearCount) {
            document.querySelector('.game-message').textContent = 'You win!';
            document.querySelector(':root').style.setProperty('--display', 'flex');
        } else {
            // console.log(this.clearedSquares.size, this.clearedSquares);
        }
    }
}

