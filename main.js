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
            elements.push(this.ball);
            return elements;
        }
    }
}) ();

(function(){
    self.Bar = function(x, y, width, height, board){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;

        //Le agrego este objeto a las barras del board
        this.board.bars.push(this);
        this.kind = "rectangle";
    }

    self.Bar.prototype = {
        down: function(){},
        up: function(){}
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

    self.BoardView.prototype = {
        draw: function(){
            for(let i=this.board.elements.length-1; i>=0; i--){
                let el = this.board.elements[i];

                //Dibujamos el contexto y el elemento
                draw(this.ctx, el);
            }
        }
    }

    //Función que dibuja
    function draw(ctx, element){
        //Si el elemento no es nulo y tiene una propiedad kind ejecutamos el switch 
        if(element !== null && element.hasOwnProperty("kind")){
            switch(element.kind){
                case "rectangle":
                    ctx.fillRect(element.x, element.y, element.width, element.height);
                    break;
            }
        }
        
    }
}) ();

self.addEventListener("load", main);

function main(){
    //Instanciamos los objetos 
    let board = new Board(800, 400);

    let bar1 = new Bar(20, 100, 40, 100, board);
    let bar2 = new Bar(735, 100, 40, 100, board);

    let canvas = document.getElementById("canvas");

    let board_view = new BoardView(canvas, board);

    //Indicamos que se dibujen todos los elementos
    board_view.draw();
}