/************************************************************************
 *
 * sudokiller.js - Javascript SuDoku solver (see it at work!)
 *
 * Author: Daniele Mazzocchio
 * Last update: Jan 30, 2006
 *
 * Download sources
 ************************************************************************/

function SudoKiller() {
    /*
     * Constructor of the SuDoku solver.
     */
    BOARD_SIZE = 9;           // Width and height of the SuDoku board
    BOX_SIZE = 3;             // Width and height of the inner boxes
    EMPTY = "";               // Empty cell marker

    var board = new Array();  // Cells array

    function check(num, row, col) {
        /*
         * Check if num is, according to SuDoku rules, a legal candidate
         * for the given cell.
         */
        var row_index, col_index, box_index;    // Indexes of the cells to check
        var r = (Math.floor(row / BOX_SIZE) * BOX_SIZE);
        var c = (Math.floor(col / BOX_SIZE) * BOX_SIZE);

        for (var i=0; i<BOARD_SIZE; i++) {
            row_index = (row * BOARD_SIZE) + i;
            col_index = col + (i * BOARD_SIZE);
            box_index = (r + Math.floor(i / BOX_SIZE)) * BOARD_SIZE + c + (i % BOX_SIZE);
            if (num == board[row_index].value ||
                num == board[col_index].value ||
                num == board[box_index].value)
                return false;
        }
        return true;
    }

    function guess(index) {
        /*
         * Recursively test all candidate numbers for a given cell until
         * the board is complete.
         */
        var row = Math.floor(index / BOARD_SIZE);
        var col = index % BOARD_SIZE;

        if (index >= board.length)
            return true;

        if (board[index].value != EMPTY)
            return guess(index + 1);

        for (var i=1; i<=BOARD_SIZE; i++) {
            if (check(i, row, col)) {
                board[index].value = i;
                if (guess(index + 1))
                    return true;
            }
        }

        board[index].value = EMPTY;
        return false;
    }

    this.kill = function() {
        /*
         * Get the board content and start solving the game.
         */
        board = document.getElementsByTagName("input");
        if (!guess(0))
            alert("Sorry, solution not found!");
    }
}

SudoKiller.prototype.drawBoard = function() {
    /*
     * Draw the game board.
     */
    var hstyle, vstyle;      // Borders styles
    for (var row=0; row<BOARD_SIZE; row++) {
        document.write('<tr>');
        hstyle = row % BOX_SIZE ? "" : "border-top: 1px solid #000;";
        for (var col=0; col<BOARD_SIZE; col++) {
            vstyle = col % BOX_SIZE ? "" : "border-left: 1px solid #000;";
            document.write('<td style="' + hstyle + vstyle + '">');
            document.write('<input type="text" size="1" maxlength="1" /></td>');
        }
        document.write('</tr>');
    }
}
