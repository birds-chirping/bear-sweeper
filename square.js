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
    

    // ------------------- M O U S E    E V E N T S --------------------//
    onClick() {
        this.div.addEventListener('click', this.clickHandler);
    }

    onRightClick() {
        this.div.addEventListener('contextmenu', this.rightClickHandler);
    }

    clicked() {
        if (this.status === 'visible') {
            this.status = 'inactive';
            this.div.removeEventListener('click', this.clickHandler);
            // CHORDING - uncover all adjacent squares if 
            // value == number of adjacent paws.
            // 
            // 
        } else if (this.value === 'bear') {
            this.parent.gameOver();
            this.div.style.backgroundColor = 'pink';
        } else if (this.value) {
            this.showSquare();
        } else {
            this.parent.clearArea(this.row, this.col);
            this.parent.checkFlags();
        }
    }

    rightClicked(evt) {
            evt.preventDefault();
            this.toggleFlagged();

    }

    // -------------------------------------------------------------------//

    toggleFlagged () {
        if (this.flagged === 'no') {
            this.div.removeEventListener('click', this.clickHandler);
            this.flagged = 'yes';
            this.div.classList.add('flagged');
            this.parent.addFlaggedSquare(this);
        } else {
            this.onClick();
            this.flagged = 'no';
            this.div.classList.remove('flagged');
            this.parent.removeFlaggedSquare(this);
        }
    }

    showSquare() {
            this.status = 'visible';
            this.flagged= 'no';
            this.div.textContent = this.value;
            this.div.classList.add('visible-square');
    }

    showBear() {
        if (this.flagged === 'no') {
            this.div.classList.add('show-bear');
        }
    }

    showWrongFlag() {
        if (this.flagged === 'yes' && this.value !== 'bear') {
            this.showSquare();
            this.div.textContent = '';
            this.div.style.backgroundImage = 'url(./img/bear-pawprint-wrong.png)';
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

