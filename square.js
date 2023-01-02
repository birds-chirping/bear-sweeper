//  ---------------------- S Q U A R E ----------------------------------------


export default class Square {
    getName() {
        return 'Square';
    }

    constructor(parent, id, row, col) {
        this.parent = parent;
        this.id = id;
        this.row = row;
        this.col = col;
        this.value = 0;
        this.div = document.createElement('div');
        this.status = 'hidden';
        this.addAttributes();
        this.clickHandler = this.clicked.bind(this);
        this.onClick();
    }

    addAttributes() {
        this.div.setAttribute('class','square');
        this.div.setAttribute('id', `${this.id}`);
    }
    
    onClick() {
        this.div.addEventListener('click', this.clickHandler);
    };

    clicked() {
        // console.log(this.parent);
        if (this.status === 'visible') {
            this.status = 'inactive';
            // if value, show neighbours if
            // neighbours are only digits/digits & spaces (floodfill)
            // 
            // 
            this.div.removeEventListener('click', this.clickHandler);
            
        } else if (this.status === 'inactive') {        // to be removed
            console.log('now inactive');                // to test removeEventListener; to be removed.
       
        } else if (this.value === 'bear') {
            // game over
            this.parent.gameOver();

        } else if (this.value !== 0) {
            this.showSquare();
            this.status = 'visible';

        } else {
            // console.log(this.status);
            // flood fill algorithm
            this.parent.clearArea(this);
            // 
            
        }
    }



    showSquare() {
        this.div.textContent = this.value;
        this.div.style.color = 'blue';                  // to be removed
        this.div.style.backgroundColor = 'salmon';      // to be removed
    }

    showBear() {
        this.div.textContent = 'x';
        this.div.style.color = 'salmon';                  // to be removed
        this.div.style.backgroundColor = 'white';      // to be removed
    }


    // rightclick -> flag
    // 
    //
      
    placeBear() {
        this.div.setAttribute('data-value', 'bear');
        this.value = 'bear';
    }

    updateValue() {
        if (this.value != 'bear') {
            ++this.value;
            this.div.textContent = this.value;          // to be removed
        }
    }
}

