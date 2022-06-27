//Función anónima que se ejecuta a sí misma
(function(){
    self.Board = function(width, height) {
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars =[];
        this.ball = null;
    }

    //Modificamos el prototipo de la clase para colocar métodos
    self.Board.prototype = {
        get elements(){
            let elements = this.bars;
            elements.push(ball);
            return elements;
        }
    }
}) ();

(function(){
    self.BoardView = function(canvas, board){
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }
}) ();

self.addEventListener("load", main);

function main(){
    //Instanciamos un objeto de la clase Board y establecemos las medidas
    let board = new Board(800, 400);

    let canvas = document.getElementById("canvas");

    let board_view = new BoardView(canvas, board);
}