let boardContainer = document.querySelector('.board-wrapper');
let r = document.querySelector(':root');

let squares = [];
let ids = []



function play() {
    let gridSize = 16;
    createGrid(gridSize);
    let bearCount = 40;
    addBears(bearCount);
}

function createGrid(size) {
    setSize(size);
    boardContainer.textContent = '';
    let id = 0;
    for (let row = 1; row <= size; row++) {
        for (let col = 1; col <= size; col++) {
            const square = document.createElement('div');
            square.setAttribute('class','square');
            square.setAttribute('id', `${id}`);
            square.setAttribute('data-col', col);
            square.setAttribute('data-row', row);
            square.setAttribute('data-pos', `${row}_${col}`);
            square.setAttribute('data-value', 0);
            ids.push(id);
            id++;
            squares.push(square);
            boardContainer.appendChild(square);
        }
    } 
}

function setSize(size) {
    r.style.setProperty('--grid-size', `${size}`);
}

function addBears(count) {
    let randomBearIds = pickRandomSquares(count, ids);
    markBearPlaces(randomBearIds, count);
    markAroundBearPlaces(randomBearIds, count);
}

function pickRandomSquares(count, ids) {
    let idlist = ids.map((x) => x);
    idlist = shuffle(idlist);
    return idlist.splice(1, count);
}

// Fisher–Yates shuffle
function shuffle(list) {
    let m = list.length;
    let t;
    let i;
    
    while(m) {
        i = Math.floor(Math.random() * m--);
        t = list[m];
        list[m] = list[i];
        list[i] = t;
    }
    return list;
}

function markBearPlaces(bearIds, count) {
    for (let i = 0; i < count; i++) {
        squares[bearIds[i]].setAttribute('data-value', 'bear');
    }
}

function markAroundBearPlaces(bearIds, count) {
    for (let i = 0; i < count; i++) {
        let row = Number(squares[bearIds[i]].getAttribute('data-row'));
        let col = Number(squares[bearIds[i]].getAttribute('data-col'));

        markCell(document.querySelector(`[data-pos='${row-1}_${col-1}']`));
        markCell(document.querySelector(`[data-pos='${row}_${col-1}']`));
        markCell(document.querySelector(`[data-pos='${row+1}_${col-1}']`));
        markCell(document.querySelector(`[data-pos='${row-1}_${col}']`));
        markCell(document.querySelector(`[data-pos='${row+1}_${col}']`));
        markCell(document.querySelector(`[data-pos='${row-1}_${col+1}']`));
        markCell(document.querySelector(`[data-pos='${row}_${col+1}']`));
        markCell(document.querySelector(`[data-pos='${row+1}_${col+1}']`));
    }
}

function markCell(cell) {
    if (cell) {
        value = cell.getAttribute('data-value');
        if (value != 'bear') {
            value = Number(value) + 1;
            cell.setAttribute('data-value', value);
            cell.textContent = value;
        }
    }
}



play();

// 8x8 - 10x10 => 10 bears
// 13x15 - 16x16 => 40 bears
//  16x30 => 99 bears

