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
        if (this.status === 'visible') {
            this.status = 'inactive';
            this.div.removeEventListener('click', this.clickHandler);
            // if value, show neighbours if
            // neighbours are only digits/digits & spaces (floodfill)
            // 
            // 
        } else if (this.value === 'bear') {
            this.parent.gameOver();
            this.div.style.backgroundColor = 'pink';
        } else if (this.value) {
            this.showSquare();
        } else {
            this.parent.clearArea(this.row, this.col);
        }
    }

    showSquare() {
        this.status = 'visible';
        this.div.textContent = this.value;
        this.div.style.setProperty('border', 'none'); 
        this.div.style.setProperty('border-top', '0.5vmin solid #777777'); 
        this.div.style.setProperty('border-left', '0.5vmin solid #777777');

    }

    showBear() {
        this.div.style.backgroundColor = '#b0c7b0';
        this.div.style.backgroundImage = 'url(./img/bear.png)';
        this.div.style.backgroundPosition = 'center';
        this.div.style.backgroundSize = '95%';
        this.div.style.backgroundRepeat = 'no-repeat';
        this.div.style.setProperty('border', 'none'); 
        this.div.style.setProperty('border-top', '0.5vmin solid #777777'); 
        this.div.style.setProperty('border-left', '0.5vmin solid #777777');
    }

    placeBear() {
        this.div.setAttribute('data-value', 'bear');
        this.value = 'bear';
    }

    updateValue() {
        if (this.value != 'bear') {
            ++this.value;
            this.div.style.setProperty('color', this.color_palette[this.value-1]);
            console.log(this.div);
        }
    }
}


    // rightclick -> flag
    // 
    //
