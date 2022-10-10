/* 
    Name: Katie Stevens
    Class: CPSC 314 - Web Development
    Last Mofified: 11/9/21
    Homework: HW6 JQuery Stopwatch  
*/

$(document).ready(function () {
    var seconds = 00;
    var tens = 00;
    let $appendTens = $("#tens");
    let $appendSeconds = $("#seconds");
    let $buttonStart = $("#button-start");
    let $buttonStop = $("#button-stop");
    let $buttonReset = $("#button-reset");
    let $timer = $("#timer");
    let $star = $(".star");
    var interval;
    var opacityInterval;

    $timer.addClass("timer-background");
    $buttonStart.addClass("button");
    $buttonStop.addClass("button");
    $buttonReset.addClass("button");

    
    $("*").css("font-family", "Comic Sans MS");
    $(".wrapper").css("padding", "200px");
    $(".wrapper").css("background-color", "lightyellow");
    // $star.css("background-image", "url('star.jpg')"); This doesn't work so I just added it in css file.
    $star.css("background-repeat", "no-repeat");
    $star.css("background-attachment", "fixed");
    $star.css("background-size", "550px");
    $star.css("background-position", "center 0");

    $timer.css("width", "200px");
    $timer.css("margin", "0 auto 15px");
    $timer.css("border", "2px solid black");
    $timer.css("border-radius", "10px");

    $buttonStart.click(function () {
        clearInterval(interval);
        clearInterval(opacityInterval);
        interval = setInterval(startTimer, 10);
        opacityAnimation();
        $timer.removeClass("stopped");
        $timer.addClass("running");
        console.log("start");
    });

    $buttonStop.click(function () {
        clearInterval(interval);
        clearInterval(opacityInterval);
        if ($timer.hasClass("running")) {
            $timer.removeClass("running");
        $timer.addClass("stopped");
        }
    });

    $buttonReset.click(function () {
        clearInterval(interval);
        clearInterval(opacityInterval);
        tens = "00";
        seconds = "00";
        $appendTens.html(tens);
        $appendSeconds.html(seconds);
        $timer.removeClass("running");
        $timer.removeClass("stopped");
    });

    function startTimer() {
        tens++;

        if (tens < 9) {
            $appendTens.text("0" + tens);
        }

        if (tens > 9) {
            $appendTens.html(tens);

        }

        if (tens > 99) {
            console.log("seconds");
            seconds++;
            $appendSeconds.html("0" + seconds);
            tens = 0;
            $appendTens.html("0" + 0);
        }

        if (seconds > 9) {
            $appendSeconds.html(seconds);
        }
    }

    function opacityAnimation() {
        opacityInterval = setInterval(function() {
            $timer.animate({
                opacity: 0.8
            }, 250);
            $timer.animate({
                opacity: 1.0
            }, 250);  
        }, 500);
    }
});