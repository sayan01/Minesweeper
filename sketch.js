/*jshint esversion: 6 */

/**
 * Minesweeper game by Sayan Ghosh
 */
var grid;
var grid_size;
var canvas_size;
var sc;
var gameOver;
var count;
var won = false;
var myfont;
var difficulty;
var bombs;
function preload(){
    myfont = loadFont('assets/text.ttf');
    
}
function setup() {
    console.log("Version 2.5");
    canvas_size = 800;
    createCanvas(canvas_size , canvas_size);

    grid_size = 15;
    isgameOver = false;
    count = 0;
    difficulty = 2;
    bombs = floor(grid_size * random(difficulty - 1, difficulty + 1));
    grid = new Array(grid_size);
    for(var i = 0; i< grid_size; i++){
        grid[i] = new Array(grid_size);
    }
    sc = canvas_size / grid_size;
    setgrid();

    //reset button
    button = createButton('reset');
    button.position(300, 800);
    button.size(170,100);
    button.style('font-size','300%');
    button.style('font',myfont);
    button.mouseReleased(function(){
        setgrid();
        loop();
    });

    //no right clicking
    document.addEventListener('contextmenu', event => event.preventDefault());

}

function draw() {
    background(51);
    display();
    checkWon();
}

function setgrid(){
    count = 0;
    for(i = 0; i< grid_size;i++){
        for(j = 0;j<grid_size;j++){
                grid[i][j] = -2;
        }
    }
    for(i = 0; i < bombs ; i++ ){
        x = floor(random(0, grid_size));
        y = floor(random(0, grid_size));
        if(grid[x][y] != -2){
            i--; continue;
        }
        grid[x][y] = -1;
    }
}
//function to display the grid
function display(){
    for(i = 0;i<grid_size;i++){
        for(j=0;j<grid_size;j++){
            push();
            translate(i*sc ,j*sc );
            stroke(250);
            strokeWeight(3);
            rectMode(CENTER);
            if(grid[i][j]  < 0 && grid[i][j] !== -5){
                fill(65,51,60);
                rect(sc/2, sc/2, sc-10, sc-10, 15, 15, 15, 15);
            }
            else if(grid[i][j] >= 0 ) {
                fill(200);
                rect(sc/2, sc/2, sc-10, sc-10, 15, 15, 15, 15);
                if(grid[i][j] !== 0){
                    fill(25);
                    textSize(36);
                    textFont(myfont);
                    textAlign(CENTER, CENTER);
                    text(grid[i][j]+"", sc/2, sc/2);
                }
            }
            else {                     // if ( grid[i][j] === -5 )
                fill(220,50,50);
                rect(sc/2, sc/2, sc-10, sc-10, 15, 15, 15, 15);
            }
            pop();
        }
    }
}
// Function to perform actions based on user input
function mouseClicked(){
    mx = mouseX;
    my = mouseY;

    if(mx>canvas_size || my > canvas_size){return;}
    
    x = floor(mx / sc);
    y = floor(my / sc);

    if(grid[x][y] === -2){
        grid[x][y] = findValue(x,y);
        count++;
        if(grid[x][y] === 0){
            expose(x,y);
        }
        checkWon();
    }
    if(grid[x][y] === -1){
        if(count === 0){
            grid[x][y] = -2;
            mouseClicked();
        }
        else{
            grid[x][y] = -5;
            gameOver();
        }
        count++;
    }
}
//function to stop game after game over
function gameOver(){
    for(var i = 0; i < grid_size; i++){
        for(var j = 0; j < grid_size; j++){
            if(grid[i][j] === -1)
                grid[i][j] = -5;
        }
    }
    noLoop();
}
//function to calculate values of helper boxes
function findValue(x,y){
    var c = 0;
    for(var i = x-1; i <= x+1 && i < grid_size; i++){
        if(i<0) continue;
        for(var j = y-1; j <= y+1 && j < grid_size; j++){
            if(j<0) continue;
            if(grid[i][j] == -1 || grid[i][j] == -5 ) c++;
        }
    }
    return c;
}

function expose(x,y){
    for(var i = x-1; i <= x+1 && i < grid_size; i++){
        if(i<0)continue;
        for(var j = y-1; j <= y+1 && j < grid_size; j++){
            if(j<0)continue;
            if(grid[i][j] === -2){
                grid[i][j] = findValue(i,j);
                if(grid[i][j] === 0){
                    expose(i,j);
                }
            }
        }
    }
}

function checkWon(){
    // console.log("check");
    var iswon = true;
    for(var i = 0; i< grid_size;i++){
        for(var j = 0; j< grid_size;j++){
            if(grid[i][j] === -2 || grid[i][j] === -5){
                iswon = false;
            }
        }
        if(!iswon)break;
    }
    won = iswon;
    if(iswon){
        push();
        fill(51);
        rectMode(CENTER);
        rect(grid_size/2*sc, grid_size/2*sc,600,150,15,15,15,15);
        fill(250);
        textSize(128);
        textFont(myfont);
        textAlign(CENTER, CENTER);
        text("You Won!", grid_size/2*sc, grid_size/2*sc);
        pop();
        noLoop();
    }
}

// 0 : not bomb and no adjacent bomb (opened) (white)
// 1-9 : not bomb, but N adjacent bombs (opened) (N written on white)
// -1 : unopened bomb
// -2 : unopend not bomb
// -5 : opened bomb