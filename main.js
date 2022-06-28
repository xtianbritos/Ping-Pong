//Función anónima que se ejecuta a sí misma
(function(){
    self.Board = function(width, height) {
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars =[];
        this.ball = null;
        this.playing = false;
    }

    //Modificamos el prototipo de la clase para colocar métodos
    self.Board.prototype = {
        get elements(){
            let elements = this.bars.map(function(bar){ return bar; }); //Hacemos una copia del arreglo para evitar un error al llenarse la memoria
            elements.push(this.ball);
            return elements;
        }
    }
}) ();

(function(){
    self.Ball = function(x, y, radius, board){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed_y = 0;
        this.speed_x = 3;
        this.board = board;
        this.direction = 1;

        board.ball = this;
        this.kind = "circle";
    }
    
    self.Ball.prototype = {
        move: function(){
            //Cuando direction sea 1 la bola se mueve a la derecha y cuando sea -1 se mueve a la izquierda
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y);
            
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
        this.board.bars.push(this); //Le agrego este objeto a las barras del board
        this.kind = "rectangle";
        this.speed = 10;
    }

    //Agregamos métodos para mover las  barras
    self.Bar.prototype = {
        down: function(){
            this.y += this.speed; //Le aumentamos la velocidad a la coordinada Y
        },
        up: function(){
            this.y -= this.speed; //Le reducimos la velocidad a la coordinada Y
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

    self.BoardView.prototype = {
        clean: function(){
            this.ctx.clearRect(0, 0, this.board.width, this.board.height);
        },
        draw: function(){
            for(let i=this.board.elements.length-1; i>=0; i--){
                let el = this.board.elements[i];
                //Dibujamos el contexto y el elemento
                draw(this.ctx, el);
            }
        },
        play: function(){
            //Si el juego no está en pausa
            if (this.board.playing){
                //Indicamos que se limpie con cada cambio
                this.clean();
                //Indicamos que se dibujen todos los elementos
                this.draw();
                //Indicamos que se mueva la pelota
                this.board.ball.move();
            }
        }
    }

    //Función que dibuja elementos
    function draw(ctx, element){
        switch(element.kind){
            case "rectangle":
                ctx.fillRect(element.x, element.y, element.width, element.height);
                break;
            case "circle":
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.radius, 0, 7);
                ctx.fill();
                ctx.closePath();
                break;
        }
    }
}) ();

//Instanciamos los objetos 
let board = new Board(800, 400);
let bar1 = new Bar(20, 100, 40, 100, board);
let bar2 = new Bar(735, 100, 40, 100, board);
let canvas = document.getElementById("canvas");
let board_view = new BoardView(canvas, board);
let ball = new Ball(350, 100, 10, board);


document.addEventListener("keydown", function(e){
    
    //Si oprimimos la tecla abajo o arriba movemos la barra 1
    if(e.keyCode === 38){
        e.preventDefault();
        bar1.up();
    }else if(e.keyCode === 40){
        e.preventDefault();
        bar1.down();
    }
    //Si oprimimos W o S movemos la barra 2
    else if(e.keyCode === 87){
        e.preventDefault();
        bar2.up();
    }else if (e.keyCode === 83){
        e.preventDefault();
        bar2.down();
    }
    //Si oprimimos la barra espaciadora se pausa o reanuda el juego
    else if (e.keyCode === 32){
        e.preventDefault();
        board.playing = !board.playing;
    }
});

//Dibujamos los elementos para ver algo aunque no se oprima la barra espaciadora
board_view.draw();

//Animamos las barras
self.requestAnimationFrame(controller);

function controller(){

    board_view.play();

    //Para que se ejecute cosntantemente la animación lo colocamos aquí también
    self.requestAnimationFrame(controller);

}