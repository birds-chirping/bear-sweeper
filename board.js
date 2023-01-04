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
        this.setRootSize();
        this.addSquares(this.setBoardContainer());
        this.addBears(this.bearCount);
        this.addNewGameBtn();
        this.updateFlagCounter();
    }

    setRootSize() {
        document.querySelector(':root').style.setProperty('--grid-size', `${this.size}`);
    }

    setBoardContainer() {
        let board = document.querySelector('.board-wrapper');
        board.textContent = '';
        return board;
    }

    addSquares(boardContainer) {
        let id = 0;
        for (let row = 0; row < this.size; row++) {
            let squareRow = [];
            for (let col = 0; col < this.size; col++) {
                let square = new Square(this, id, row, col);
                this.ids.push(id++);
                squareRow.push(square);
                boardContainer.appendChild(square.div);
            }
            this.squares.push(squareRow);
        } 
    }

    addBears(bearCount) {
        let randomSquareIDs = this.pickRandomSquares(bearCount, this.ids);
        this.bearSquares = this.placeBears(randomSquareIDs, bearCount);
        this.markAroundBearSquares(this.bearSquares, bearCount);
    }

    pickRandomSquares(count, ids) {
        let idlist = ids.map((x) => x);
        return this.shuffle(idlist).splice(1, count);
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
    
    placeBears(randomIDsList, bearCount) {
        let bearSquares = [];
        for (let i = 0; i < bearCount; i++) {
            let square = this.idToSquare(randomIDsList[i]);
            square.placeBear();
            bearSquares.push(square);
        }
        return bearSquares;
    }

    idToSquare(id) {
        return this.squares[Math.floor((id)/this.size)][id%this.size];
    }
    
    markAroundBearSquares(bearSquares, bearCount) {
        for(let i = 0; i < bearCount; i++) {
            let row = bearSquares[i].row;
            let col = bearSquares[i].col;
            this.adjacentSquares(row, col, 'update');
         }
    }

    adjacentSquares(row, col, action) {
        let count = 0;
        for (let r = row-1; r <= row+1; r++) {
            for(let c = col-1; c <= col+1; c++) {
                try {
                    switch(true) {
                        case (action ===  'update'):
                            this.squares[r][c].updateValue();
                            break;
                        case (action === 'show' && this.squares[r][c].value > 0):
                            this.squares[r][c].textContent = this.squares[r][c].value;
                            this.squares[r][c].showSquare();
                            break;
                        case (action === 'getflags'):
                            count += (this.squares[r][c].flagged == 'yes');
                            break;
                        case (action === 'chord'):
                            if (this.squares[r][c].status !== 'visible' && this.squares[r][c].flagged === 'no') {
                                this.squares[r][c].clicked();
                            }
                    }
                } catch {
                    continue;
                }
            }
        }
        return count;
    }

    // Flood fill algorithm
    clearArea(row, col) {
        if (this.squares[row][col].value || this.squares[row][col].status !== 'hidden') {
            this.squares[row][col].flagged = 'no';
            return;
        }

        this.squares[row][col].showSquare();

        let neighbours = [
            [row-1, col],
            [row+1, col],
            [row, col+1],
            [row, col-1]
        ];
        for (let n of neighbours) {
            try {
                this.adjacentSquares(row, col, 'show');
                this.clearArea(n[0], n[1]);
            } catch {
                continue;
            }
        }
    }

    // ------------ N E W   G A M E / G A M E   O V E R -------//

    addNewGameBtn() {
        document.querySelector('.new-game-btn').addEventListener('click', this.newGame.bind(this));
    }

    newGame() {
        document.querySelector(':root').style.setProperty('--display', 'none');
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
            console.log(this.clearedSquares.size, this.clearedSquares);
        }
    }
}

