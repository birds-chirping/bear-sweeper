import Square from "./square.js";

// --------------------------------- B O A R D -------------------------------
export default class Board {

    constructor(size=16, bearCount=40) {
        this.size = size;
        this.bearCount = bearCount;
        this.squares = [];
        this.ids = [];
        this.extraBear;
        this.bearSquares = [];
        this.flaggedSquares = []
        this.clearedSquares = new Set();
        this.firstClickHandler = this.onFirstClick.bind(this);
        this.board = document.querySelector('.board-wrapper');

    }

    createGrid() {
        this.setRootVariables();
        this.board.textContent = '';
        this.addSquares(this.board);
        this.linkAdjacentSquares();
        this.addBears();
        this.updateFlagCounter();
        this.firstClickEvent();
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

    // ----------------- add squares and bears ----------------------

    addSquares(boardContainer) {
        let id = 0;
        for (let row = 0; row < this.size; row++) {
            let squareRow = [];
            for (let col = 0; col < this.size; col++) {
                let square = new Square(this, id, row, col);
                square.addAttributes();
                this.ids.push(id++);
                squareRow.push(square);
                boardContainer.appendChild(square.div);
            }
            this.squares.push(squareRow);
        } 
    }


    // --------------- generate bears --------------------------------

    addBears() {
        let randomIDsList = this.pickRandomIDs(this.ids);

        for (let i = 0; i < this.bearCount; i++) {
            let square = this.idToSquare(randomIDsList[i]);
            this.addBear(square);
        }
        this.bearSquares.forEach(bear => {
            this.markAroundBearSquare(bear);
        });
    }
    
    addBear(square) {
        square.placeBear();
        this.bearSquares.push(square);
    }
    
    markAroundBearSquare(bear, v=1) {
        bear.getAdjacentSquares().forEach(square => {
            if(square) square.updateValue(v);
        });
    }

    //  ------------ helpers--------

    pickRandomIDs(ids) {
        let idlist = ids.map((x) => x);
        let randomBears = this.shuffle(idlist);
        this.extraBear = this.idToSquare(randomBears[this.bearCount]);
        return randomBears.splice(0, this.bearCount);
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
    
    // ------------------ F I R S T   C L I C K -> S A F E -----------//

    firstClickEvent() {
        this.board.addEventListener('click', this.firstClickHandler, true);
    }

    onFirstClick(e) {
        let square = this.idToSquare(e.target.getAttribute('id'))
        if (square.value == 'bear') {
            this.removeFirstBear(square);
            this.addExtraBear();
        }
        this.board.removeEventListener('click', this.firstClickHandler, true);
    }

    removeFirstBear(square) {
        // set new square value & color
        square.value = null;      
        square.getAdjacentSquares().forEach(adjSquare => {
            if (adjSquare) {
                if (adjSquare.value == 'bear') {
                    square.value++;
                }
            }
        });
        square.div.style.setProperty('color', square.color_palette[square.value]);

        this.bearSquares.splice(this.bearSquares.indexOf(square), 1);   // del from list of bears
        this.markAroundBearSquare(square, -1);    // update adjacent values
    }

    addExtraBear() {
        this.addBear(this.extraBear);
        this.markAroundBearSquare(this.extraBear);
    }

    // ------------------ F L O O D   F I L L ----------------//

    clearArea(square) {
        if (square.status !== 'hidden') {
            return;
        }

        if (square.value) {
            square.showSquare();
            return;
        }

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
        if (square.n && square.n.value) {
            if (square.w && square.w.value) {
                square.nw.value ? square.nw.showSquare() : this.clearArea(square.nw);
            } 
            if (square.e && square.e.value) {
                square.ne.value ? square.ne.showSquare() : this.clearArea(square.ne);
            }
        }

        if (square.s && square.s.value) {
            if (square.w && square.w.value) {
                square.sw.value ? square.sw.showSquare() : this.clearArea(square.sw);
            }
            if (square.e && square.e.value) {
                square.se.value ? square.se.showSquare() : this.clearArea(square.se);
            }
        }
    }


    // -------------- C H O R D I N G ------------------------//

    chord(square) {
        if (this.getAdjacentFlags(square) == square.value) {
            square.getAdjacentSquares().forEach(adjSquare => {
                if (adjSquare && adjSquare.status === 'hidden' && adjSquare.flagged === 'no') {
                    if (adjSquare.value === 'bear') {
                        adjSquare.div.style.backgroundColor = 'var(--clicked-bear-color)';
                        this.gameOver();
                    } else if (adjSquare.value == null) {
                        this.clearArea(adjSquare);
                    } else {
                        adjSquare.showSquare();
                    }
                }
            });
            return true;
        }
    }

    getAdjacentFlags(square) {
        let count = 0;
        square.getAdjacentSquares().forEach(adjSquare => {
            if (adjSquare) count += (adjSquare.flagged == 'yes');
        });
        return count;        
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

    // ------------------ G A M E   O V E R -----------------//

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

    // ----------------------- W I N -------------------------//

    addClearedSquare(id) {
        this.clearedSquares.add(id);
        this.checkWin();
    }

    checkWin() {
        if (this.clearedSquares.size == this.size ** 2 - this.bearCount) {
            document.querySelector('.game-message').textContent = 'You win!';
            document.querySelector(':root').style.setProperty('--display', 'flex');
        } 
    }
}

