//  ---------------------- S Q U A R E ----------------------------------------


export default class Square {
    color_palette = ['blue', 'green', 'red', 'purple', 'maroon', 'turquoise','black', 'gray']
    constructor(parent, id, row, col) {
        this.parent = parent;
        this.id = id;
        this.row = row;
        this.col = col;
        this.value = null;
        this.div = document.createElement('div');
        this.status = 'hidden';
        this.flagged = 'no';
        this.addAttributes();
        this.clickHandler = this.clicked.bind(this);
        this.rightClickHandler = this.rightClicked.bind(this);
        this.onClick();
        this.onRightClick();
    }

    addAttributes() {
        this.div.setAttribute('class','square');
        this.div.setAttribute('id', `${this.id}`);
    }
    
    setAdjacentSquares() {
        if (this.row > 0) this.n = this.parent.squares[this.row-1][this.col];
        if (this.col > 0) this.w = this.parent.squares[this.row][this.col-1];
        if (this.row < this.parent.size - 1) this.s = this.parent.squares[this.row+1][this.col];
        if (this.col < this.parent.size - 1) this.e = this.parent.squares[this.row][this.col+1];

        if (this.n && this.w) this.nw = this.parent.squares[this.row-1][this.col-1];
        if (this.n && this.e) this.ne = this.parent.squares[this.row-1][this.col+1];
        if (this.s && this.w) this.sw = this.parent.squares[this.row+1][this.col-1];
        if (this.s && this.e) this.se = this.parent.squares[this.row+1][this.col+1];
    }

    getAdjacentSquares() {
        return [this.n, this.w, this.s, this.e, this.nw, this.ne, this.sw, this.se];
    }
    
    // ------------------- M O U S E    E V E N T S --------------------//
    onClick() {
        this.div.addEventListener('click', this.clickHandler);
    }

    onRightClick() {
        this.div.addEventListener('contextmenu', this.rightClickHandler);
    }

    clicked() {
        if (this.status === 'visible') {
            if (this.parent.chord(this)) {
                this.status = 'inactive';
                this.div.setAttribute('inactive', 'yes');
                this.div.removeEventListener('click', this.clickHandler);
            }
        } else if (this.value === 'bear') {
            this.parent.gameOver();
            this.div.style.backgroundColor = '#dfb1b3';
        } else if (this.value) {
            this.showSquare();
        } else {
            this.parent.clearArea(this);
            this.parent.checkFlags();
        }
    }

    rightClicked(evt) {
            evt.preventDefault();
            if (this.status === 'hidden'){
                this.toggleFlagged();
            }
    }

    // ----------------------- F L A G S --------------------------------//

    toggleFlagged () {
        if (this.flagged === 'no') this.flag();
        else this.unflag(); 
    }

    flag() {
        this.div.removeEventListener('click', this.clickHandler);
        this.flagged = 'yes';
        this.div.classList.add('flagged');
        this.parent.addFlaggedSquare(this);
    }

    unflag() {
        this.onClick();
        this.flagged = 'no';
        this.div.classList.remove('flagged');
        this.parent.removeFlaggedSquare(this);
    }

    showWrongFlag() {
        if (this.flagged === 'yes' && this.value !== 'bear') {
            this.showSquare();
            this.div.textContent = '';
            this.div.style.backgroundImage = 'url(./img/bear-pawprint-wrong.png)';
        }
    }


    // ------------------------------------------------------------------//
    showSquare() {
            this.status = 'visible';
            this.flagged = 'no';
            this.onClick();
            this.div.textContent = this.value;
            this.div.classList.add('visible-square');
            this.parent.addClearedSquare(this.id);
    }

    showBear() {
        if (this.flagged === 'no') {
            this.div.classList.add('show-bear');
        }
    }

    placeBear() {
        this.div.setAttribute('data-value', 'bear');
        this.value = 'bear';
    }

    updateValue() {
        if (this.value != 'bear') {
            ++this.value;
            this.div.style.setProperty('color', this.color_palette[this.value-1]);
        }
    }
}

