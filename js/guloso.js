function Sudokar() {
    //  Construtor do solucionador do Sudoku por meio do método da Busca Gulosa
    //  As linhas e colunas do tabuleiro possuem custos que são calculados pela quantidade de elementos vaz

    TAM_TABULEIRO = 9;           // Altura e Largura do tabuleiro (9x9)
    TAM_CAIXA = 3;             // Altura e largura da caixa interna (3x3)
    VAZIA = "";               // Marcador de célula vazia

    var tabuleiro = new Array();  // Cells array

    // Variáveis para armazenar o custo de cada célula
    var custo_linha = new Array();
    var custo_coluna = new Array();
    var custo_elemento = new Array();

    function verifica_numero(num, linha, col) {
        /* 
        Analisa se a variavel num passada como parametro é um número candidato a uma dada celula,
        isso de acordo com as regras do jogo
        */
        
        var linha_index, col_index, caixa_index;    // Index das celulas a serem analisadas
        var l = (Math.floor(linha / TAM_CAIXA) * TAM_CAIXA);
        var c = (Math.floor(col / TAM_CAIXA) * TAM_CAIXA);

        //
        for (var i=0; i<TAM_TABULEIRO; i++) {
            linha_index = (linha * TAM_TABULEIRO) + i;
            col_index = col + (i * TAM_TABULEIRO);
            caixa_index = (l + Math.floor(i / TAM_CAIXA)) * TAM_TABULEIRO + c + (i % TAM_CAIXA);
            if (num == tabuleiro[linha_index].value ||
                num == tabuleiro[col_index].value ||
                num == tabuleiro[caixa_index].value)
                return false;
        }
        return true;
    }

    function calcula_custo_linha(qtd_linhas) {
       //Função para calcular o custo da linha
       //Para cada espaço vazio na linha o custo é incrementado
       
        var index = 0;
        for (var linha = 0; linha < qtd_linhas; linha++) {
            for (var coluna = 0; coluna < qtd_linhas; coluna++) {
                index = (linha) * TAM_TABULEIRO + (coluna);
                if (tabuleiro[index].value != VAZIA) {  //Mudar ==
                    custo_linha[linha]++;
                }
            }
        }
    }

    function calcula_custo_coluna(qtd_colunas) {
       //Função para calcular o custo da coluna
       //Para cada espaço vazio na coluna o custo é incrementado
        var index = 0;
        for (var coluna = 0; coluna < qtd_colunas; coluna++) {
            for (var linha = 0; linha < qtd_colunas; linha++) {
                index = (linha) * TAM_TABULEIRO + (coluna);
                if (tabuleiro[index].value != VAZIA) { // Mudar para ==
                    custo_coluna[coluna]++;
                }
            }
        }
    }

    function calcula_custo() {
        //Função para calcular o custo do elemento somando o custo da sua respectiva linha e coluna
        calcula_custo_linha(TAM_TABULEIRO);
        calcula_custo_coluna(TAM_TABULEIRO);

        var index = 0;
        //Soma os valores nos vetores de custo_linha e custo_coluna
        for (var coluna = 0; coluna < TAM_TABULEIRO; coluna++) {
            for (var linha = 0; linha < TAM_TABULEIRO; linha++) {
                index = (linha - 1) * TAM_TABULEIRO + (coluna - 1);
                custo_elemento[index] = custo_linha[linha] + custo_coluna[coluna];
            }
        }
    }

    function caixa_completa(caixa) {
        var index = 0;
        //Função para verificar se a caixa (3x3) foi completa
        for (var linha = Math.floor(caixa / TAM_CAIXA) * 3 + 1; linha < (Math.floor(caixa / TAM_CAIXA) * 3) + TAM_CAIXA; linha++) {
            for (var coluna = caixa % TAM_CAIXA + 1; coluna < caixa % TAM_CAIXA + 3; coluna++) {
                index = (linha - 1) * TAM_TABULEIRO + (coluna - 1);
                if (tabuleiro[index].value == VAZIA) {
                    return false;
                }
            }
        }

        return true;
    }

    function primeiro_elemento(caixa) {
        var linha = Math.floor(caixa / TAM_CAIXA) * 3 + 1;
        var coluna = caixa % TAM_CAIXA + 1;

        return (linha - 1) * TAM_TABULEIRO + (coluna - 1);

    }

    function adivinha_elemento(index) {
        // Testa recursivamente todos os numeros candidatos para uma dada célula até que Sudoku esteja resolvido

        var linha = Math.floor(index / TAM_TABULEIRO);
        var col = index % TAM_TABULEIRO;

        var caixa_atual = 1;

        if (index >= tabuleiro.length)
            return true;
        
        // Verifica qual numero da caixa (3x3) o algoritmo está analisando
        // 1 | 2 | 3
        // 4 | 5 | 6
        // 7 | 8 | 9
        if (tabuleiro[index].value != VAZIA) {
            if(linha <= 3) {
                if(col <= 3)
                    caixa_atual = 1;
                else if(col <= 6)
                    caixa_atual = 2;
                else
                    caixa_atual = 3;
            }

            else if(linha <= 6) {
                if(col <= 3)
                    caixa_atual = 4;
                else if(col <= 6)
                    caixa_atual = 5;
                else
                    caixa_atual = 6;
            }
            else {
                if(col <= 3)
                    caixa_atual = 7;
                else if(col <= 6)
                    caixa_atual = 8;
                else
                    caixa_atual = 9;
            }
        
             var menor_custo = -1;
             
            //Analisa qual index com menor custo e utiliza como parametro recursivamente para funcao adivinha_elemento
             for (var linha = Math.floor(caixa_atual / TAM_TABULEIRO) * 3 + 1; linha < (Math.floor(caixa_atual / TAM_CAIXA) * 3 + 1) + TAM_CAIXA; linha++) {
                for (var coluna = caixa_atual % TAM_CAIXA + 1; coluna < caixa_atual % TAM_CAIXA + 1 + TAM_CAIXA; coluna++) {
                    index = (linha - 1) * TAM_TABULEIRO + (coluna - 1);
                    if(menor_custo >= 0) {
                        if((custo_elemento[index] < custo_elemento[menor_custo]) && (custo_elemento[index] > 0)) {
                            menor_custo = index;
                        }
                    }
                    else
                        menor_custo = index;
                }
            }
            return adivinha_elemento(menor_custo);
        }   
    
        //Preenche a tabela com a função verifica numero
        for (var i=1; i<=TAM_TABULEIRO; i++) {
            if (verifica_numero(i, linha, col)) {
                tabuleiro[index].value = i;
                calcula_custo();
                if(!caixa_completa(caixa_atual)) {
                    if (adivinha_elemento(index))
                        return true;
                }
                else {
                    if(caixa_atual + 1 > TAM_TABULEIRO) {
                        return true;
                    }
                    if (adivinha_elemento(primeiro_elemento(caixa_atual + 1)))
                        return true;
                }
            }
        }
        /* CASO NAO ACHE A SOLUCAO */
        tabuleiro[index].value = VAZIA;
        return false;
    }

    this.kill = function() {
        // Recebe os dados preenchidos da tabela e resolve o Sudoku
        tabuleiro = document.getElementsByTagName("input");
        if (!adivinha_elemento(0))
            alert("Solução não encontrada  =(");
    }
}

Sudokar.prototype.drawBoard = function() {
    // Interface do Tabuleiro
    var hstyle, vstyle;      
    for (var linha=0; linha < TAM_TABULEIRO; linha++) {
        document.write('<tr>');
        hstyle = linha % TAM_CAIXA ? "" : "border-top: 1px solid #000;";
        for (var col=0; col < TAM_TABULEIRO; col++) {
            vstyle = col % TAM_CAIXA ? "" : "border-left: 1px solid #000;";
            document.write('<td style="' + hstyle + vstyle + '">');
            document.write('<input type="text" size="1" maxlength="1" /></td>');
        }
        document.write('</tr>');
    }
}
