class Square {
    constructor(id, row, col) {
        this.id = id;
        this.row = row;
        this.col = col;
        this.value = 0;
        this.div = document.createElement('div');
        this.status = 'hidden';
        this.addAttributes();
        this.onClick();
    }

    addAttributes() {
        this.div.setAttribute('class','square');
        this.div.setAttribute('id', `${this.id}`);
    }

    updateValue() {
        if (this.value != 'bear') {
            ++this.value;
        }
    }

    placeBear() {
        this.div.setAttribute('data-value', 'bear');
        this.value = 'bear';
    }

    
    onClick() {
        this.div.addEventListener('click', () => {
            
            if (this.status === 'visible') {
                // if value, show neighbours
                // 
                // 
                this.status = 'inactive';

            } else if (this.status === 'inactive') {
                return;

            } else if (this.value === 'bear') {
                this.showSquare();
                // game over
                // 
                // 

            } else if (this.value !== 0) {
                this.showSquare();
                this.status = 'visible';

            } else {
                console.log(this.status);
                // flood fill algorithm
                // 
                // 
            }
    })};

    showSquare() {
        this.div.textContent = this.value;
    }

    // rightclick -> flag
}


class Board {
    squares = [];
    ids = [];
    
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
                let square = new Square(id, row, col);
                this.ids.push(id++);
                squareRow.push(square);
                boardContainer.appendChild(square.div);
            }
            this.squares.push(squareRow);
        } 
    }

    addBears(bearCount) {
        let randomSquareIDs = this.pickRandomSquares(bearCount, this.ids);
        let bearSquares = this.placeBears(randomSquareIDs, bearCount);
        this.markAroundBearSquares(bearSquares, bearCount);
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
}


function play() {
    new Board();
}

play();


// 8x8 - 10x10 => 10 bears
// 13x15 - 16x16 => 40 bears
//  16x30 => 99 bears

