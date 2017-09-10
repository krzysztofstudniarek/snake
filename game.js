
var width = 500, height = 600, fps=100, extensionTime = 250, move = 50, lvl= 0;

var won = 0;

var randx = Math.floor(Math.random()*10) + 20
var randy = Math.floor(Math.random()*10) + 20

var door = {
    x : Math.floor(Math.random()*40) + 4,
    y : Math.floor(Math.random()*50) + 4,
    timer : 500
}

var snake = {
    elements : [{
        x : randx,
        y : randy
    },
    {
        x : randx-1,
        y : randy
    },
    {
        x : randx-2,
        y : randy
    },
    {
        x : randx-3,
        y : randy
    }]
}

var next = "right";
var extend = false;

var hero = {
    x : randx - (Math.floor(Math.random()*20)-10),
    y : randy - (Math.floor(Math.random()*20)-10)
}

var counter = 0;

// drawing function
function draw()
{
    snake.elements.forEach(function(element){
         rectfill(canvas,element.x * 10 + 1,element.y *10 + 1, 8, 8,makecol(0,0,0));
    });

    rectfill(canvas,hero.x * 10 + 1,hero.y *10 + 1, 8, 8,makecol(0,0,0));

    if(door.timer < 0){
        drawDoor();
    }
}

// update game logic
function update()
{
    counter ++;
    door.timer --;

    if(counter%move == 0){
        if(extend){
            var newElement = {};
            Object.assign(newElement, snake.elements[snake.elements.length -1]);
        }

        for(var i = snake.elements.length -1 ; i >= 1; i--){
            Object.assign(snake.elements[i], snake.elements[i-1]);
        }

        if(next == "right"){
            snake.elements[0].x ++; 
        }
        
        if(next == "left"){
            snake.elements[0].x --; 
        }

        if(next == "up"){
            snake.elements[0].y --; 
        }
        
        if(next == "down"){
            snake.elements[0].y ++; 
        }
        
        if(extend){
            snake.elements.push(newElement);
            extend = false;
        }
    }
}

function controls()
{
    if(pressed[KEY_UP]){
        hero.y --;
    }else if(pressed[KEY_DOWN]){
        hero.y ++;
    }else if(pressed[KEY_LEFT]){
        hero.x --;
    }else if(pressed[KEY_RIGHT]){
        hero.x ++;
    }

    if(counter%move == 0){
        var dist = [];

        if(next != "left"){
            dist.push({
                dir : "right",
                dist : distance(snake.elements[0].x + 1, snake.elements[0].y, hero.x, hero.y)
            });
        }

        if(next != "right"){
            dist.push({
                dir : "left", 
                dist : distance(snake.elements[0].x - 1, snake.elements[0].y, hero.x, hero.y)
            });
        }

        if(next != "down"){
            dist.push({
                dir: "up",
                dist :distance(snake.elements[0].x, snake.elements[0].y - 1, hero.x, hero.y)
            });
        }

        if(next != "up"){
            dist.push({
                dir : "down",
                dist : distance(snake.elements[0].x, snake.elements[0].y + 1, hero.x, hero.y)
            });
        }

        var min = dist.reduce(function(a,b){
            if(a.dist > b.dist){
                return b;
            }else{
                return a;
            }
        });

        next = min.dir;
    }
}

function logic()
{
    if(counter%extensionTime == 0){
        extend = true;
    }
    
}

function haveWon()
{
    snake.elements.forEach(function(element){
        if(element.x == hero.x && element.y == hero.y){
            won = -1;
        }
    });
    
    if(door.timer <=0 && hero.x == door.x && hero.y == door.y){
        won = 1;
    }
}

function drawInterface()
{
    for(var i =0; i<50; i++){
         rectfill(canvas,i * 10 + 1,1, 8, 8,makecol(0,0,0));
         rectfill(canvas,i * 10 + 1,height-9, 8, 8,makecol(0,0,0));
    }

    for(var i = 0; i<61; i++){
        rectfill(canvas,1,i * 10 + 1, 8, 8,makecol(0,0,0));
         rectfill(canvas,491,i * 10 + 1, 8, 8,makecol(0,0,0));
    }

    textout(canvas,font,"SCORE: "+lvl,20,40,15,makecol(0,0,0));
}

function initGraphics()
{
}

function distance(x1, y1, x2, y2){
    return Math.abs((x1 - x2)) + Math.abs((y1 - y2));
}

// entry point of our example
function main()
{
	enable_debug("debug");
	allegro_init_all("canvas_id", width, height);
        
    initGraphics();

	ready(function(){
		loop(function(){
			clear_to_color(canvas, makecol(154,197,3));
            if(won == 0){    
                controls();
                logic();
                draw();
                update();
                drawInterface(); 
            }else if(won > 0){
                controls();
                logic();
                draw();
                update();
                drawInterface();
                lvl ++; 
                move -= 5;
                door.timer = 500;
                door.x = Math.floor(Math.random()*40) + 4;
                door.y = Math.floor(Math.random()*50) + 4;
                won = 0;
            }else if(won < 0){
                textout(canvas,font,"You've lost!",195,265,15,makecol(0,0,0));
                textout(canvas,font,"SCORE: "+lvl,205,285,15,makecol(0,0,0));
            }
            haveWon();
	
		}, BPS_TO_TIMER(fps));
	});
	
	return 0;
}
END_OF_MAIN();

function drawDoor(){
    rectfill(canvas,(door.x -1) * 10 + 1,door.y *10 + 1, 8, 8,makecol(0,0,0));
    rectfill(canvas,(door.x -1) * 10 + 1,(door.y-1) *10 + 1, 8, 8,makecol(0,0,0));
    rectfill(canvas,(door.x -1) * 10 + 1,(door.y+1) *10 + 1, 8, 8,makecol(0,0,0));
    rectfill(canvas,(door.x) * 10 + 1,(door.y+1) *10 + 1, 8, 8,makecol(0,0,0));
    rectfill(canvas,(door.x) * 10 + 1,(door.y-1) *10 + 1, 8, 8,makecol(0,0,0));
    rectfill(canvas,(door.x +1) * 10 + 1,door.y *10 + 1, 8, 8,makecol(0,0,0));
    rectfill(canvas,(door.x +1) * 10 + 1,(door.y-1) *10 + 1, 8, 8,makecol(0,0,0));
    rectfill(canvas,(door.x +1) * 10 + 1,(door.y+1) *10 + 1, 8, 8,makecol(0,0,0));
}
