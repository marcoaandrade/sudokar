function Sudokar() {
    /*
     * Constructor of the SuDoku solver.
     */
    BOARD_SIZE = 9;           // Width and height of the SuDoku board
    BOX_SIZE = 3;             // Width and height of the inner boxes
    EMPTY = "";               // Empty cell marker

    var board = new Array();  // Cells array

    var custo_linha = new Array();
    var custo_coluna = new Array();
    var custo_elemento = new Array();

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

    function calcula_custo_linha(qtd_linhas) {
        var index = 0;

        for (var linha = 0; linha < qtd_linhas; linha++) {
            for (var coluna = 0; coluna < qtd_linhas; coluna++) {
                index = (linha - 1) * BOARD_SIZE + (coluna - 1);
                if (board[index].value != EMPTY) {
                    custo_linha[linha]++;
                }
            }
        }
    }

    function calcula_custo_coluna(qtd_colunas) {
        var index = 0;

        for (var coluna = 0; coluna < qtd_colunas; coluna++) {
            for (var linha = 0; linha < qtd_colunas; linha++) {
                index = (linha - 1) * BOARD_SIZE + (coluna - 1);
                if (board[index].value != EMPTY) {
                    custo_coluna[coluna]++;
                }
            }
        }
    }

    function calcula_custo() {
        calcula_custo_linha(BOARD_SIZE);
        calcula_custo_coluna(BOARD_SIZE);

        var index = 0;

        for (var coluna = 0; coluna < BOARD_SIZE; coluna++) {
            for (var linha = 0; linha < BOARD_SIZE; linha++) {
                index = (linha - 1) * BOARD_SIZE + (coluna - 1);
                custo_elemento[index] = custo_linha[linha] + custo_coluna[coluna];
            }
        }
    }

    function box_completa(box) {
        var index = 0;

        for (var linha = Math.floor(box / BOX_SIZE) * 3 + 1; linha < (Math.floor(box / BOX_SIZE) * 3) + BOX_SIZE; linha++) {
            for (var coluna = box % BOX_SIZE + 1; coluna < box % BOX_SIZE + 3; coluna++) {
                index = (linha - 1) * BOARD_SIZE + (coluna - 1);
                if (board[index].value == EMPTY) {
                    return false;
                }
            }
        }

        return true;
    }

    function primeiro_elemento(box) {
        var linha = Math.floor(box / BOX_SIZE) * 3 + 1;
        var coluna = box % BOX_SIZE + 1;

        return (linha - 1) * BOARD_SIZE + (coluna - 1);

    }

    function guess(index) {
        /*
         * Recursively test all candidate numbers for a given cell until
         * the board is complete.
         */
        var row = Math.floor(index / BOARD_SIZE);
        var col = index % BOARD_SIZE;

        var box_atual = 1;

        if (index >= board.length)
            return true;

        if (board[index].value != EMPTY) {
            if(row <= 3) {
                if(col <= 3) {
                    box_atual = 1;
                }

                else if(col <= 6) {
                    box_atual = 2;
                }
                else {
                    box_atual = 3;
                }
            }

            else if(row <= 6) {
                if(col <= 3) {
                    box_atual = 4;
                }

                else if(col <= 6) {
                    box_atual = 5;
                }
                else {
                    box_atual = 6;
                }
            }
            else {
                if(col <= 3) {
                    box_atual = 7;
                }

                else if(col <= 6) {
                    box_atual = 8;
                }
                else {
                    box_atual = 9;
                }
            }

            var menor_custo = -1;

            for (var linha = Math.floor(box_atual / BOX_SIZE) * 3 + 1; linha < (Math.floor(box_atual / BOX_SIZE) * 3) + BOX_SIZE; linha++) {
                for (var coluna = box_atual % BOX_SIZE + 1; coluna < box_atual % BOX_SIZE + 3; coluna++) {
                    index = (linha - 1) * BOARD_SIZE + (coluna - 1);
                    if(menor_custo >= 0) {
                        if((custo_elemento[index] < custo_elemento[menor_custo]) && (custo_elemento[index] > 0)) {
                            menor_custo = index;
                        }
                    }
                    else {
                        menor_custo = index;
                    }
                }
            }

            return guess(menor_custo);
        }

        for (var i=1; i<=BOARD_SIZE; i++) {
            if (check(i, row, col)) {
                board[index].value = i;
                calcula_custo();
                if(!box_completa(box_atual)) {
                    if (guess(index))
                        return true;
                }
                else {
                    if(box_atual + 1 > BOARD_SIZE) {
                        return true;
                    }
                    if (guess(primeiro_elemento(box_atual + 1)))
                        return true;
                }
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
