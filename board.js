import Square from "./square.js";

// --------------------------------- B O A R D -------------------------------
export default class Board {

    squares = [];
    ids = [];
    bearSquares = [];
    
    constructor(size=10, bearCount=20) {
        this.size = size;
        this.bearCount = bearCount;
        this.createGrid();
    }

    createGrid() {
        this.setRootSize();
        this.addSquares(this.setBoardContainer());
        this.addBears(this.bearCount);
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

            for (let r = row-1; r <= row+1; r++) {
                for(let c = col-1; c <= col+1; c++){
                    try {
                        this.squares[r][c].updateValue();
                    } catch {
                        continue;
                    }
                }
            }
         }
    }


    clearArea(square) {
        console.log(square);
    }

    gameOver() {
        this.showAllBears();
        document.querySelector(':root').style.setProperty('--display', 'flex');
        document.querySelector('.new-game-btn').addEventListener('click', this.newGame.bind(this));
    }


    newGame() {
        document.querySelector(':root').style.setProperty('--display', 'none');
        new Board();

    }

    showAllBears() {
        for (let bear of this.bearSquares) {
            bear.showBear();
        }
    }
}

