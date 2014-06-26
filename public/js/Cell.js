
function Cell(stringpos) {
    var row, col, dir;

    var position = stringpos.split("");

    var base_row, base_col;

    if (position.length === 3) {
        if (isNaN(position[0])) {
            base_row = position[0];
            base_col = parseInt(position[1]) * 10 + parseInt(position[2]);
            dir = 'right';
        } else {
            base_row = position[2];
            base_col = parseInt(position[0]) * 10 + parseInt(position[1]);
            dir = 'down';
        }

    } else {
        if (!isNaN(position[0])) {
            base_row = position[1];
            base_col = parseInt(position[0]);
            dir = 'down';
        } else {
            base_row = position[0];
            base_col = parseInt(position[1]);
            dir = 'right';
        }
    }

    row = base_row;
    col = base_col;

    var cellName = function() {
        return row + col;
    };

    var cellCoordinates = function () {
        if (dir == 'right') {
            return row + col;
        } else {
            return "" + col + row;
        }
    };

    var compare = function(othercell) {
        return row == othercell.getRow() && col == othercell.getCol();
    };

    var getDir = function() {
        return dir;
    };

    var getRow = function() {
        return row;
    };

    var getCol = function() {
        return col;
    };

    var setDir = function (newdir) {
        dir = newdir;
    };

    var setRow = function (newrow) {
        row = newrow;
    };

    var setCol = function (newcol) {
        col = newcol;
    };

    var moveRight = function () {
        if (col < 15) {
            col += 1;
        }
    };

    var moveLeft = function () {
        if (col > 1) {
            col -= 1;
        }
    };

    var moveUp = function () {
        if (row != "A") {
            row = String.fromCharCode(row.charCodeAt(0) - 1);
        }
    };

    var moveDown = function () {
        if (row != "O") {
            row = String.fromCharCode(row.charCodeAt(0) + 1);
        }
    };

    var copy = function () {
        return new Cell(cellCoordinates());
    };

    var getLetterMultiplier = function () {
        switch (getRow()) {
            case "A":
            case "O":
                if (getCol() == 4 || getCol() == 12) return 2;
                break;
            case "B":
            case "N":
                if (getCol() == 6 || getCol() == 10) return 3;
                break;
            case "C":
            case "M":
                if (getCol() == 7 || getCol() == 9) return 2;
                break;
            case "D":
            case "L":
                if (getCol() == 1 || getCol() == 8 || getCol() == 15) return 2;
                break;
            case "F":
            case "J":
                if (getCol() == 2 || getCol() == 6 || getCol() == 10 || getCol() == 14) return 3;
                break;
            case "G":
            case "I":
                if (getCol() == 3 || getCol() == 7 || getCol() == 9 || getCol() == 13) return 2;
                break;
            case "H":
                if (getCol() == 4 || getCol() == 12) return 2;
                break;
        }
        return 1;
    };

    var getWordMultiplier = function () {
        switch (getRow()) {
            case "A":
            case "O":
                if (getCol() == 1 || getCol() == 8 || getCol() == 15) return 3;
                break;
            case "B":
            case "N":
                if (getCol() == 2 || getCol() == 14) return 2;
                break;
            case "C":
            case "M":
                if (getCol() == 3 || getCol() == 13) return 2;
                break;
            case "D":
            case "L":
                if (getCol() == 4 || getCol() == 12) return 2;
                break;
            case "E":
            case "K":
                if (getCol() == 5 || getCol() == 11) return 2;
                break;
            case "H":
                if (getCol() == 1 || getCol() == 15) return 3;
                if (getCol() == 8) return 2;
                break;
        }
        return 1;
    };
    
    var rebuild = function (oldcell) {
        if (oldcell.dir == 'right') {
            return new Cell(""+oldcell.row+oldcell.col);
        } else {
            return new Cell(""+oldcell.col+oldcell.row);
        }
    };

    return {
        col: col,
        row: row,
        dir: dir,
        getCol: getCol,
        getRow: getRow,
        getDir: getDir,
        getName: cellName,
        getCoordinates: cellCoordinates,
        equals: compare,
        setDir: setDir,
        setCol: setCol,
        setRow: setRow,
        moveRight: moveRight,
        moveLeft: moveLeft,
        moveUp: moveUp,
        moveDown: moveDown,
        copy: copy,
        getLetterMultiplier: getLetterMultiplier,
        getWordMultiplier: getWordMultiplier,
        rebuild: rebuild
    };
}