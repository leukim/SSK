function Game (language, playerNames, backup_data) {
    
    var data = {};
    
    if (language !== undefined && playerNames !== undefined) {
        data = {
            language: language,
            playerNames: playerNames,
            plays: [],
            score: [],
            board: undefined,
            currentTurn: 0,
            new_word: "",
            cell: undefined,
            board: new Board(language)
        };
        
        for (var i in playerNames) {
            data.score[i] = {
                name: playerNames[i],
                points: 0
            };
        }
    }
    
    if (backup_data !== undefined) {
        data = backup_data.game_data;
        data.cell = undefined;
        data.board = new Board(language, backup_data.board_data);
    }
    
    /*
     * END OF INIT
     */

    var removeSelection = function () {
        if (data.cell != undefined) {
            angular.element(".board-cell.cell-"+data.cell.getName()).removeClass("board-selection-down board-selection-right");
        }
    };

    var clearFields = function () {
        data.new_word = "";
        removeSelection();
        if (data.cell != undefined) data.cell = undefined;
    };

    var add_word = function () {
        data.error = "";
        data.warnings = [];
        if (data.cell) {
            var newplay = data.board.addWord(data.new_word.toUpperCase(), data.cell);
            
            if (newplay.rollback) {
                data.board.goBack();
                data.error = newplay.error;
                
                return;
            }
            
            newplay.playerName = data.playerNames[data.currentTurn];
            
            data.plays.push(newplay);
            
            data.score[data.currentTurn].points += newplay.points;
            
            data.currentTurn++;
            if (data.currentTurn == data.playerNames.length) data.currentTurn = 0;
            
            clearFields();
            
            if (newplay.warnings) {
                data.warnings = newplay.warnings;
            }
        } else {
            data.error = "ERR_SELECT_CELL";
        }
    };
    
    var goBack = function () {
        if (data.plays.length !== 0) {
            var deleted_play = data.plays.pop();
            if (!deleted_play.pass) data.board.goBack();
            data.currentTurn--;
            if (data.currentTurn == -1) data.currentTurn = data.playerNames.length-1;
            
            data.score[data.currentTurn].points -= deleted_play.points;
            
            data.warnings = [];
            data.error = "";
        }
    };

    var clickCell = function (name) {
        removeSelection();

        var clicked_cell = new Cell(name);

        if (data.cell && data.cell.equals(clicked_cell)) {
            if (data.cell.getDir() == 'down') {
                angular.element(".board-cell.cell-"+name).addClass("board-selection-right");
                data.cell.setDir('right');
            } else {
                angular.element(".board-cell.cell-"+name).addClass("board-selection-down");
                data.cell.setDir("down");
            }
        } else {
            angular.element(".board-cell.cell-"+name).addClass("board-selection-right");
            data.cell = clicked_cell;
        }
    };
    
    var pass = function () {
        data.plays.push({
            rollback: false,
            position: "",
            wordlist: "",
            points: 0,
            scrabble: false,
            playerName: data.playerNames[data.currentTurn],
            pass: true
            
        });
        
        data.currentTurn++;
        if (data.currentTurn >= data.playerNames.length) data.currentTurn = 0;
    };
    
    return {
        data: data,
        
        clickCell: clickCell,
        addWord: add_word,
        goBack: goBack,
        clearFields: clearFields,
        pass: pass
    };
}