//  ---------------------- S Q U A R E ----------------------------------------


export default class Square {
    color_palette = ['blue', 'green', '#cc4545', 'purple', 'maroon', 'turquoise','black', 'gray'];

    constructor(parent, id, row, col) {
        this.parent = parent;
        this.id = id;
        this.row = row;
        this.col = col;
        this.value = null;
        this.div = document.createElement('div');
        this.status = 'hidden';
        this.flagged = 'no';

        this.clickedHandler = this.clicked.bind(this);
        this.rightClickedHandler = this.rightClicked.bind(this);
        this.touchStartEventHandler = this.touchStartEvent.bind(this);
        this.touchEndEventHandler = this.touchEndEvent.bind(this);
        this.touchMoveEventHandler = this.touchMoveEvent.bind(this);
        this.onLongClickHandler = this.onLongClick.bind(this);
        this.addTouchEvent();
        this.addClickEvent();
        this.addRightClickEvent();
        this.touched = 'no';
        this.moved = 'no'; 
        this.timeoutId;

    }

    addAttributes() {
        this.div.setAttribute('class','square');
        this.div.setAttribute('tabindex','-1');
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
    addClickEvent() {
        this.div.addEventListener('click', this.clickedHandler);
    }

    removeClickEvent() {
        this.div.removeEventListener('click', this.clickedHandler);
    }

    addRightClickEvent() {
        this.div.addEventListener('contextmenu', this.rightClickedHandler);
    }

    removeRightClickEvent() {
        this.div.removeEventListener('contextmenu', this.rightClickedHandler);
    }

    clicked() {
        // console.log('CLICK');
        if (this.touched == 'yes') {
            // this.touched = 'no';
            this.removeClickEvent();
            // return;
        }

        if (this.status === 'visible') {
            if (this.parent.chord(this)) {
                this.status = 'inactive'; //
                this.div.setAttribute('inactive', 'yes'); //
                this.removeClickEvent();
            }
        } else if (this.value === 'bear') {
            this.parent.gameOver();
            this.div.style.backgroundColor = 'var(--clicked-bear-color)';
        } else if (this.value) {
            this.showSquare();
        } else {
            this.parent.clearArea(this);
            this.parent.checkFlags();
        }
    }

    rightClicked(evt) {
        evt.preventDefault();
        if (this.status === 'hidden' && this.touched == 'no'){
            this.toggleFlagged();
        }
    }

    // -------------- Long press (touch) --------------
    addTouchEvent() {
        this.div.addEventListener('touchstart', this.touchStartEventHandler);
        this.div.addEventListener('touchend', this.touchEndEventHandler);        
        this.div.addEventListener('touchmove', this.touchMoveEventHandler);
    }

    touchStartEvent() {
        this.touched = 'yes';
        // this.removeClickEvent();
        this.timeoutId = setTimeout(this.onLongClickHandler, 200);
        };


    onLongClick() {
        this.timeoutId = null;
        if (this.status == 'hidden'){
            if (this.flagged == 'no') {
                this.flag()
            } else {
                this.unflag();
            }
        }
    }


    touchEndEvent() {
        if (this.timeoutId) {
            // console.log('click');
            clearTimeout(this.timeoutId); 
            if (this.moved != 'yes') {
                this.removeClickEvent();
                if (this.flagged === 'no') {
                    this.clicked();
                }
            }
            this.moved = 'no';
        } 
        else {
            // console.log('long');
            // if (this.flagged == 'no' && this.status != 'visible') {
            //     this.flag()
            // } else {
            //     this.unflag();
            // } 
        }
    }

    touchMoveEvent() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.moved = 'yes';
        }

    }

    // ----------------------- F L A G S --------------------------------//

    toggleFlagged () {
        if (this.flagged === 'no') this.flag();
        else this.unflag(); 
    }

    flag() {
        this.removeClickEvent();
        this.flagged = 'yes';
        this.div.classList.add('flagged');
        this.parent.addFlaggedSquare(this);
    }

    unflag() {
        if (this.touched == 'no') {
            this.addClickEvent();
        }
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
            if(!this.value) {
                this.removeClickEvent();
                this.removeRightClickEvent();
            }
            
            this.status = 'visible';
            this.flagged = 'no';
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
        this.div.setAttribute('data-value', 'bear'); //
        this.value = 'bear';
    }

    updateValue() {
        if (this.value != 'bear') {
            ++this.value;
            this.div.style.setProperty('color', this.color_palette[this.value-1]);
        }
    }
}
