
function Board (language, backup_data) {
    /*
        INIT
     */
    var data = {};
    
    if (language !== undefined) {
        data = {
            history: {
                matrix: [],
                letterset: []
            },
            matrix: {},
            lastPlayCells: {},
            language: language,
            letterset: language.letterset,
            cleanrules: language.clean_rules,
            splitrules: {
                "equivalents": {},
                "splitters": []
            },
            
            end: false
        };
        
        for (var letter in data.language.letterset) {
            if (letter.length > 1) {
                data.splitrules.splitters.push(letter);
            }
            
            if (data.language.letterset[letter].equivalents) {
                for (var index in data.language.letterset[letter].equivalents) {
                    var equiv = data.language.letterset[letter].equivalents[index];
                    data.splitrules.equivalents[equiv] = letter;
                }
            }
        }
        
        for (var i = 0; i < 15; ++i) {
            var letter = String.fromCharCode("A".charCodeAt(0) + i);
            data.matrix[letter] = [];
            for (var j = 1; j <= 15; ++j) {
                data.matrix[letter][j] = {
                    name: new Cell(letter+j).getName(),
                    value: "",
                    occupied: false
                };
            }
        }
    }
    
    if (backup_data !== undefined) {
        data = backup_data;
        for (var c in data.lastPlayCells) {
            var rebuilt_cell = new Cell("A1");
            rebuilt_cell.rebuild(data.lastPlayCells[c]);
            data.lastPlayCells[c] = rebuilt_cell;
        }
    }

    /*
        END OF INIT
     */

    var matrixCell = function (cell) {
        return data.matrix[cell.getRow()][cell.getCol()];
    };

    var addedNow = function (cell, added) {
        for (var index in added) {
            var test = added[index];
            if (test.equals(cell)) return true;
        }

        return false;
    };

    var cleanWord = function (word) {
        for (var wrong in data.cleanrules) {
            word = word.replace(wrong, data.cleanrules[wrong]);
        }
        
        return word;
    };

    var splitWord = function (word) {

        word = word.toUpperCase();
        
        for (var wrong in data.splitrules.equivalents) {
            word = word.replace(wrong, data.splitrules.equivalents[wrong]);
        }

        for (var wrong in data.splitrules.splitters) {
            word = word.replace(data.splitrules.splitters[wrong], wrong);
        }

        word = word.split("");

        for (var index in word) {
            if (!isNaN(word[index])) {
                word[index] = data.splitrules.splitters[word[index]];
            }
        }

        return word;
    };

    var clearLastPlayCells = function () {
        for (var index in data.lastPlayCells) {
            var cell = data.lastPlayCells[index];
            matrixCell(cell).fromlastmove = false;
        }
        data.lastPlayCells = [];
    };

    var addWord = function (raw_word, cell) {
        var ret = {};
        
        clearLastPlayCells();
        data.history.matrix.push(JSON.stringify(data.matrix));
        data.history.letterset.push(JSON.stringify(data.letterset));
        raw_word = cleanWord(raw_word);
        var word = splitWord(raw_word);
        
        var added_tiles = [];
        
        var t_cell = cell.copy();
        
        var warned_num_letter_err = false;
        
        for (var index in word) {
            var letter = word[index];
            
            if (matrixCell(t_cell).value === '' || matrixCell(t_cell).value === letter) {
                if (matrixCell(t_cell).value !== letter) {
                    matrixCell(t_cell).fromlastmove = true;
                    added_tiles.push(t_cell.copy());
                    
                    data.letterset[letter].total -= 1;
                }
                
                matrixCell(t_cell).value = letter;
                matrixCell(t_cell).points = data.letterset[letter].value;
                matrixCell(t_cell).occupied = true;
                data.lastPlayCells.push(t_cell.copy());
                
                if (data.letterset[letter].total < 0 && !warned_num_letter_err) {
                    if (!ret.warnings) ret.warnings = [];
                    ret.warnings.push("WARN_LETTER_NUM_ERROR");
                    warned_num_letter_err = true;
                }
            } else  {
                return {
                    rollback: true,
                    error: "ERR_NO_FIT_BOARD"
                };
            }
            
            if (t_cell.getDir() == 'down') {
                t_cell.moveDown();
            } else {
                t_cell.moveRight();
            }
        }
        
        if (added_tiles.length > 7) {
            return {
                rollback: true,
                error: "ERR_TOO_MANY_TILES"
            };
        }
        
        if (added_tiles.length === 0) {
            return {
                rollback: true,
                error: "ERR_NO_NEW_PLAYED_TILES"
            };
        }
        
        var points = getPoints(raw_word, cell, added_tiles, true);
        
        var wordlist = points.words.map(function (item) {
            return item.word;
        }).join(",");

        ret.rollback = false;
        ret.position = cell.getCoordinates();
        ret.wordlist = wordlist;
        ret.points = points.points;
        ret.scrabble = points.scrabble;
        
        return ret;
    };

    var numberToLetter = function (number) {
        return String.fromCharCode(number + "A".charCodeAt(0));
    };

    var letterToNumber = function (letter) {
        return letter.charCodeAt(0) - "A".charCodeAt(0);
    };

    var getAdjacentWords = function (raw_word, cell, added_tiles) {
        var found_words = [];

        for (var index in added_tiles) {
            var t_cell = added_tiles[index];

            if (cell.getDir() == 'down') {
                var lettersleft = 0;

                var i = t_cell.getCol() - 1;
                while (i >= 1 && data.matrix[t_cell.getRow()][i].value != '') {
                    lettersleft += 1;
                    i -= 1;
                }

                var lettersright = 0;

                i = t_cell.getCol() + 1;
                while (i <= 15 && data.matrix[t_cell.getRow()][i].value != '') {
                    lettersright += 1;
                    i += 1;
                }

                if ((lettersleft + lettersright) > 0) {

                    var found_word = [];
                    i = t_cell.getCol() - lettersleft;
                    while (i <= 15 && data.matrix[t_cell.getRow()][i].value != '') {
                        found_word.push(data.matrix[t_cell.getRow()][i].value);
                        i += 1;
                    }

                    while (lettersleft > 0) {
                        lettersleft -= 1;
                        t_cell.moveLeft();
                        t_cell.setDir("right");
                    }

                    found_words.push({
                        cell: t_cell,
                        word: found_word.join("")
                    });
                }

            } else {
                var lettersup = 0;

                var i = letterToNumber(t_cell.getRow()) - 1;
                while (i >= 0 && data.matrix[numberToLetter(i)][t_cell.getCol()].value != '') {
                    lettersup += 1;
                    i -= 1;
                }

                var lettersdown = 0;

                i = letterToNumber(t_cell.getRow()) + 1;
                while (i <= 14 && data.matrix[numberToLetter(i)][t_cell.getCol()].value != '') {
                    lettersdown += 1;
                    i += 1;
                }

                if ((lettersdown + lettersup) > 0) {

                    var found_word = [];
                    i = letterToNumber(t_cell.getRow()) - lettersup;
                    while (i <= 14 && data.matrix[numberToLetter(i)][t_cell.getCol()].value != '') {
                        found_word.push(data.matrix[numberToLetter(i)][t_cell.getCol()].value);

                        i += 1;
                    }

                    while (lettersup > 0) {
                        t_cell.moveUp();

                        lettersup -= 1;
                    }

                    found_words.push({
                        cell: t_cell,
                        word: found_word.join("")
                    });
                }
            }
        }

        return found_words;
    };

    var getPoints = function (raw_word, cell, added_tiles, recursive) {
        var scrabble = false;
        if (recursive && added_tiles.length == 7) scrabble = true;
        var word = splitWord(raw_word);

        var t_cell = cell.copy();

        var points = 0;
        var multiplier = 1;

        for (var index in word) {
            var letter = word[index];

            if (addedNow(t_cell, added_tiles)) {
                points += data.letterset[letter].value * t_cell.getLetterMultiplier();
                multiplier *= t_cell.getWordMultiplier();
            } else {
                points += data.letterset[letter].value;
            }


            if (t_cell.getDir() == 'down') {
                t_cell.moveDown();
            } else {
                t_cell.moveRight();
            }
        }

        points = points*multiplier;

        console.log("Points for word: "+raw_word+"["+cell.getCoordinates()+"]: "+points);

        if (recursive) {
            var copy_added_tiles = [];
            for (var index in added_tiles) {
                copy_added_tiles.push(added_tiles[index].copy());
            }
            var adjacents = getAdjacentWords(raw_word, cell, copy_added_tiles);

            for (var index in adjacents) {
                var item = adjacents[index];
                
                copy_added_tiles = [];
                for (var index in added_tiles) {
                    copy_added_tiles.push(added_tiles[index].copy());
                }
                
                var extra = getPoints(item.word, item.cell, copy_added_tiles, false);
                points += extra.points;
            }

            adjacents.unshift({
                word: raw_word,
                cell: cell
            });
            
            /*
             * COUNT SCRABBLES
             */
            if (scrabble) points += 50;

            return {
                scrabble: scrabble,
                points: points,
                words: adjacents
            };
        }
        
        return {
            scrabble: false,
            points: points,
            words: []
        };
    };

    var overrideMatrix = function (newmatrix) {
        for (var i in data.matrix) {
            for (var j in data.matrix[i]) {
                data.matrix[i][j] = newmatrix[i][j];
            }
        }
    };
    
    var overrideLastPlayCells = function (newlpc) {
        data.lastPlayCells = [];
        for (var i in newlpc) {
            data.lastPlayCells.push(newlpc[i].copy());
        }
    };
    
    var overrideLetterset = function (newlts) {
        for (var letter in data.letterset) {
            data.letterset[letter].total = newlts[letter].total;
        }
    };

    var goBack = function () {
        overrideMatrix(JSON.parse(data.history.matrix.pop()));
        overrideLetterset(JSON.parse(data.history.letterset.pop()));
    };
    
    var endGame = function () {
        data.end = true;
    };
    
    var undoEndGame = function () {
        data.end = false;
    };
    
    return {
        data: data,
        
        addWord: addWord,
        goBack: goBack,
        endGame: endGame,
        undoEndGame: undoEndGame
    };
};