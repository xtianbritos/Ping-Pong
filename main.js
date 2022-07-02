//Funciones anónimas que se ejecutan a sí mismas
(function(){
    //Se crea la clase Board
    self.Board = function(width, height) {
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars =[];
        this.ball = null;
        this.playing = false;
        this.player1 = 0;
        this.player2 = 0;
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
        //Se crea la clase Ball
    self.Ball = function(x, y, radius, board){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed_y = 0;
        this.speed_x = 3;
        this.board = board;
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        this.speed = 3;

        board.ball = this;
        this.kind = "circle";
    }
    
    self.Ball.prototype = {
        move: function(){
            //Cuando direction sea 1 la bola se mueve a la derecha y cuando sea -1 se mueve a la izquierda
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y);
        },
        get width(){
            return this.radius * 2;
        },
        get height(){
            return this.radius * 2;
        },
        collision: function(bar){
            //Reacciona si la bola colisiona con una barra que recibe como parametro y le cambia su dirección
            let relative_intersect_y = (bar.y+(bar.height/2)) -this.y;

            let normalized_intersect_y = relative_intersect_y / (bar.height/2);

            this.bounce_angle =normalized_intersect_y * this.max_bounce_angle;

            this.speed_y = this.speed * -Math.sin(this.bounce_angle);
            this.speed_x = this.speed * Math.cos(this.bounce_angle);

            if(this.x > (this.board.width /2)){
                this.direction = -1;
            }else{
                this.direction = 1;
            }
        },
        borders: function(){
            //Reacciona si la bola colisiona con los bordes laterales
            if(this.y <= 10 || this.y >= this.board.height-10){
                this.speed_y = -this.speed_y;
            }
        },
        point: function(){
            //Reacciona si la bola sobrepasa los limites de los lados
            if(this.x > this.board.width){
                return 1;
            }
            if(this.x < 0){
                return 2;
            }else{
                return 0;
            }
        }
    }
}) ();

(function(){
    //Se crea la clase BoardView
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
        check_collisions: function(){
            for (let i=this.board.bars.length-1 ; i>=0; i--) {
                let bar = this.board.bars[i];
                if(hit(bar, this.board.ball)){
                    this.board.ball.collision(bar);
                }
            }

            this.board.ball.borders();

            let point = this.board.ball.point();

            if(point == 1){
                this.board.ball = new Ball(350, 100, 10, board);
                this.board.playing = false;
                this.board.player1++;
                if(this.board.player1 == 5){
                    alert("¡Felicitaciones jugador 1! \n ¡Ganaste la partida!");
                    this.board.player1 = 0;
                    this.board.player2 = 0;
                }
                else {
                    alert("¡Punto para el jugador 1! \n LLevas " + this.board.player1)
                }
            }
            if(point == 2){
                this.board.ball = new Ball(350, 100, 10, board);
                this.board.playing = false;
                this.board.player2++;
                if(this.board.player2 == 5){
                    alert("¡Felicitaciones jugador 2! \n ¡Ganaste la partida!");
                    this.board.player1 = 0;
                    this.board.player2 = 0;
                }
                else {
                    alert("¡Punto para el jugador 2! \n LLevas " + this.board.player2)
                }
            }
        },
        play: function(){
            //Si el juego no está en pausa
            if (this.board.playing){
                //Indicamos que se limpie con cada cambio
                this.clean();
                //Indicamos que se dibujen todos los elementos
                this.draw();
                //Indicamos que chequee las colisiones
                this.check_collisions();
                //Indicamos que se mueva la pelota
                this.board.ball.move();
            }
        }
    }

    //Función que revisa si hay colisiones
    function hit(a, b){
        let hit = false;

        //Colisiones horizontales
        if(b.x + b.width >= a.x && b.x < a.x + a.width){
            //Colisiones verticales
            if(b.y + b.height >= a.y && b.y < a.y + a.height){
                hit = true;
            }
        }
        //Colision de a con b
        if(b.x <= a.x && b.x + b.width >= a.x + a.width){
            if(b.y <= a.y && b.y + b.height >= a.y + a.height){
                hit = true;
            }
        }
        //Colision de b con a
        if(a.x <= b.x && a.x + a.width >= b.x + b.width){
            if(a.y <= b.y && a.y + a.height >= b.y + b.height){
                hit = true;
            }
        }

        return hit;
    }

    //Función que dibuja elementos
    function draw(ctx, element){
        switch(element.kind){
            case "rectangle":
                ctx.fillRect(element.x, element.y, element.width, element.height);
                break;
            case "circle":
                ctx.beginPath();
                ctx.fillStyle = "blue"
                ctx.arc(element.x, element.y, element.radius, 0, 7);
                ctx.fill();
                ctx.closePath();
                break;
        }
    }
}) ();


(function(){
    //Se crea la clase Bar
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
            if(this.y + this.height <= this.board.height){
                this.y += this.speed; //Le aumentamos la velocidad a la coordinada Y
            }
        },
        up: function(){
            if(this.y > 0){
                this.y -= this.speed; //Le reducimos la velocidad a la coordinada Y
            }
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
    if(e.keyCode === 87){
        e.preventDefault();
        bar1.up();
    }else if(e.keyCode === 83){
        e.preventDefault();
        bar1.down();
    }
    //Si oprimimos W o S movemos la barra 2
    else if(e.keyCode === 38){
        e.preventDefault();
        bar2.up();
    }else if (e.keyCode === 40){
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