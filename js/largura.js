function Sudokar() {
    /*
     * Constructor of the SuDoku solver.
     */
    TAM_TABELA = 9;           // Width and height of the SuDoku board
    TAM_QUADRADO = 3;             // Width and height of the inner boxes
    EMPTY = "";               // Empty cell marker

    var board = new Array();  // Cells array

    function verifica_numero(num, row, col) {
        /*
         * Check if num is, according to SuDoku rules, a legal candidate
         * for the given cell.
         */
        var row_index, col_index, box_index;    // Indexes of the cells to check
        var r = (Math.floor(row / TAM_QUADRADO) * TAM_QUADRADO);
        var c = (Math.floor(col / TAM_QUADRADO) * TAM_QUADRADO);

        for (var i=0; i<TAM_TABELA; i++) {
            row_index = (row * TAM_TABELA) + i;
            col_index = col + (i * TAM_TABELA);
            box_index = (r + Math.floor(i / TAM_QUADRADO)) * TAM_TABELA + c + (i % TAM_QUADRADO);
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
        var row = Math.floor(index / TAM_TABELA);
        var col = index % TAM_TABELA;

        if (index >= board.length)
            return true;

        if (board[index].value != EMPTY)
            return guess(index + 1);

        for (var i=1; i<=TAM_TABELA; i++) {
            if (verifica_numero(i, row, col)) {
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

Sudokar.prototype.drawBoard = function() {
    /*
     * Draw the game board.
     */
    var hstyle, vstyle;      // Borders styles
    for (var row=0; row<TAM_TABELA; row++) {
        document.write('<tr>');
        hstyle = row % TAM_QUADRADO ? "" : "border-top: 1px solid #000;";
        for (var col=0; col<TAM_TABELA; col++) {
            vstyle = col % TAM_QUADRADO ? "" : "border-left: 1px solid #000;";
            document.write('<td style="' + hstyle + vstyle + '">');
            document.write('<input type="text" size="1" maxlength="1" /></td>');
        }
        document.write('</tr>');
    }
}
