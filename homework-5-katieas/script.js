/*
Name: Katie Stevens
Class: CPSC 314 Web Development Fall 2021
Assignment: HW5
Last Modified: 10/29/21 
*/

var color1 = "#82c0e7"
var color2 = "#130a7b"

window.onload = function () {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var ballRadius = 10;
    var x = canvas.width / 2;
    var y = canvas.height - 30;
    var dx = 2;
    var dy = -2;
    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width - paddleWidth) / 2;
    var rightPressed = false;
    var leftPressed = false;
    var brickRowCount = 5;
    var brickColumnCount = 3;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;
    var score = 0;
    var lives = 3;

    var bricks = [];

    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    function keyDownHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = true;
        }
        else if (e.keyCode == 37) {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = false;
        }
        else if (e.keyCode == 37) {
            leftPressed = false;
        }
    }

    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    function collisionDetection() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                var b = bricks[c][r];
                if (b.status == 1) {
                    if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        if (score == brickRowCount * brickColumnCount) {
                            //TODO: draw message on the canvas
                            checkWinState();
                            //alert("YOU WIN, CONGRATS!");
                            //TODO: pause game instead of reloading
                            paused = true;
                            //document.location.reload();
                        }
                    }
                }
            }
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = color2;
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = color2;
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft;
                    var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = color1;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = color2;
        ctx.fillText("Score: " + score, 60, 20);
    }

    function drawLives() {
        ctx.font = "16px Arial";
        ctx.fillStyle = color2;
        ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawHighScore();
        drawLives();
        collisionDetection();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        }
        else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            }
            else {
                lives--;
                if (lives <= 0) {
                    //TODO: draw message on the canvas
                    checkWinState();
                    //alert("GAME OVER");
                    //TODO: pause game instead of reloading
                    paused = true;
                    //document.location.reload();
                }
                else {
                    x = canvas.width / 2;
                    y = canvas.height - 30;
                    dx = 3;
                    dy = -3;
                    paddleX = (canvas.width - paddleWidth) / 2;
                }
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        }
        else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        //TODO: adjust speed
        x += dx * speed;
        y += dy * speed;

        //TODO: pause game check
        if (!paused) {
            requestAnimationFrame(draw);
        }
    }

    /*
        Additions to starter code
    */

    //Additional variables used to help make dimensions/locations easier to reuse            
    //controls game speed            
    //pause game variable            
    //high score tracking variables
    //other variables?            

    //event listeners added
    //game speed changes handler            
    //pause game event handler            
    //start a new game event handler            
    //continue playing
    //reload click event listener  
    var pauseButton = document.getElementById("pause-btn");
    var newGameButton = document.getElementById("newGame-btn");
    var continueButton = document.getElementById("continue-btn");
    var reloadButton = document.getElementById("reload-btn");
    var speedLabel = document.getElementById("speedmult-label");
    var speedSlider = document.getElementById("speedmult");

    var speed = 1;
    var highScore = 0;
    var paused = false;
    var win = false;
    
    var menuWidth = canvas.width - 40;
    var menuHeight = canvas.height - 40;
    var lengthText = 128
    var buttonX = (menuWidth / 2) - (lengthText / 2) - 5;
    var buttonY = 155;
    var buttonWidth = lengthText + 15;
    var buttonHeight = 50;

    pauseButton.addEventListener('click', togglePauseGame);
    speedSlider.addEventListener('input', adjustGameSpeed);
    newGameButton.addEventListener('click', startNewGame);
    continueButton.addEventListener('click', continuePlaying);
    reloadButton.addEventListener('click', () => {
        document.location.reload();
    });

    //Drawing a high score
    function drawHighScore() {
        ctx.font = "bold 16px Arial";
        ctx.fillStyle = color2;
        ctx.fillText("High Score: " + highScore, 235, 20);
    }

    //draw the menu screen, including labels and button
    function drawMenu() {
        
        //draw the rectangle menu backdrop
        ctx.fillStyle = "#ffc0cb"; // pink
        ctx.fillRect(20, 20, menuWidth, menuHeight);
        

        //draw the menu header
        setShadow();

        ctx.font = "bold 30px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#666699"; // purple
        ctx.fillText("Breakout Game!", menuWidth / 2, menuHeight / 3);

        //start game button area
        ctx.font = "bold 24px Arial";
        ctx.fillStyle = "white";
        ctx.fillRect(buttonX, buttonY, lengthText + 15, buttonHeight);
        ctx.fillStyle = "black";
        ctx.fillText("Start Game", menuWidth / 2, menuHeight * 2 / 3);


        //event listener for clicking start
        //need to add it here because the menu should be able to come back after 
        //we remove the it later                
        canvas.addEventListener("click", startGameClick);
    }

    //function used to set shadow properties
    function setShadow() {
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 5;
        ctx.shadowColor = "gray";
    };

    //function used to reset shadow properties to 'normal'
    function resetShadow() {
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = "transparent";
    };

    //function to clear the menu when we want to start the game
    function clearMenu() {
        //remove event listener for menu, 
        //we don't want to trigger the start game click event during a game
        canvas.removeEventListener("click", startGameClick); 
        ctx.clearRect(20, 20, menuWidth, menuHeight); 
        resetShadow();              
    }

    //function to start the game
    //this should check to see if the player clicked the button
    //i.e., did the user click in the bounds of where the button is drawn
    //if so, we want to trigger the draw(); function to start our game
    function startGameClick(event) {
        var xVal = event.pageX - canvas.offsetLeft;
        var yVal = event.pageY - canvas.offsetTop;

        if (xVal > buttonX && xVal < (buttonX + buttonWidth) &&
            yVal > buttonY && yVal < (buttonY + buttonHeight)) {
                // start game
                console.log("Start Game");
                clearMenu();
                draw();
        }

    };

    //function to handle game speed adjustments when we move our slider
    function adjustGameSpeed() {
        //update the slider display                
        //update the game speed multiplier 
        speed = speedSlider.value;
        var value = Number(speed).toFixed(2);
        speedLabel.innerText = "Game Speed: " + value;             
    };

    //function to toggle the play/paused game state
    function togglePauseGame() {
        //toggle state                
        //if we are not paused, we want to continue animating (hint: zyBook 8.9)
        paused = !paused;
        if (!paused) {
            draw();
        }
        console.log("paused");
    };

    //function to check win state
    //if we win, we want to accumulate high score and draw a message to the canvas
    //if we lose, we want to draw a losing message to the canvas
    function checkWinState() {
        if (score == brickRowCount * brickColumnCount) { // win 
            setShadow();
            ctx.font = "bold 45px Arial";
            ctx.fillStyle = color2;
            ctx.fillText("You Win!", 240, 130);
            ctx.fillText("Congratulations!", 240, 180);
            win = true;
        }
        else if (lives <= 0) { // lose
            setShadow();
            ctx.font = "bold 50px Arial";
            ctx.textAlign = "center";
            ctx.fillStyle = "#990000";
            ctx.fillText("Sorry! Game Over!", 240, 150);
            win = false;
        }
    };

    //function to clear the board state and start a new game (no high score accumulation)
    function startNewGame(resetScore) {
        resetBoard(3); // reset with 3 lives
        highScore = 0;
        draw();
    };

    //function to reset the board and continue playing (accumulate high score)
    //should make sure we didn't lose before accumulating high score
    function continuePlaying() {
        if (win) {
            highScore += score;
        }

        if (lives > 0) {
            resetBoard(lives); // reset with current lives
            draw();
        }
        else {
            console.log("ERROR: Cannot continue game. No Lives Remaining.");
        }
    };

    //function to reset starting game info
    function resetBoard(resetLives) { // resets but speeds game up
        //ctx.clearRect(0, 0, canvas.width, canvas.height); 
        //reset paddle and ball position
        paddleX = (canvas.width - paddleWidth) / 2;
        x = canvas.width / 2;
        y = canvas.height - 30;

        //reset score and lives
        score = 0;
        lives = resetLives;
        win = false;

        //reset bricks
        for (var c = 0; c < brickColumnCount; c++) {
            bricks[c] = [];
            for (var r = 0; r < brickRowCount; r++) {
                bricks[c][r] = { x: 0, y: 0, status: 1 };
            }
        } 
        togglePauseGame();
        clearAnimationFrame(draw);
    };

    //draw the menu.
    drawMenu();
    //we don't want to immediately draw... only when we click start game            
    //draw();

};//end window.onload function