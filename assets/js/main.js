$(document).ready(function () {
    /*=========================
              Layout
    ==========================*/
    setting();
    bgColor();
    $(window).on("resize", function () {
        bgColor();
    });

    $("#btnStart").on("click", function () {
        boardSizeExpand();
        btnReset();
        containerPosition();
        $(".score").css({
            opacity: "1"
        });
        $(window).on("resize", function () {
            btnReset();
            containerPosition();
        });
    });

    $("#btnReset").on("click", function () {
        boardSizeRevert();
        bgColor();
        $(".score").css({
            opacity: "0"
        });
        $("#board").css({
            "margin-bottom": "0"
        });
        $("#btnReset").css({
            display: "none",
            opacity: "0"
        });
        $(".container").css({
            height: "100%"
        });
        $(window).on("resize", function () {
            bgColor();
        });
    });

    /*=========================
             Game logic
    ==========================*/
    settingPlayer();
    settingToken();
    $("#btnStart").on("click", function () {
        currentMove();
    });
    $("#btnReset").on("click", function () {
        gameReset();
    });
}); //document.ready

/*=========================
    Game logic functions
==========================*/

var scoreCircle = 0;
var scoreCross = 0;
var clicks = 0;
var rounds = 1;
var firstMoveToken = "tokenCircle";
var secondMoveToken = "tokenCross";
var player = 1;
var winCombos = [
  ["#box1", "#box2", "#box3"],
  ["#box1", "#box4", "#box7"],
  ["#box1", "#box5", "#box9"],
  ["#box2", "#box5", "#box8"],
  ["#box3", "#box5", "#box7"],
  ["#box3", "#box6", "#box9"],
  ["#box4", "#box5", "#box6"],
  ["#box7", "#box8", "#box9"]
];
var RandomNum = 0;
var makeRandomMove = "#box" + RandomNum;
var turn = '';
var notTurn = '';

function gameReset() {
    //reset round
    rounds = 1;
    //reset token
    clicks = 0;
    firstMoveToken = "tokenCircle ";
    secondMoveToken = "tokenCross";
    $(".selectionToken").css({
        left: "0px"
    });
    $(".box").removeClass("tokenCircle tokenCross");
    //reset player
    player = 1;
    $(".selectionPlayer").css({
        left: "0px"
    });
    //reset score
    scoreCircle = 0;
    $("#scoreCircle").html(scoreCircle);
    scoreCross = 0;
    $("#scoreCross").html(scoreCross);
    //reset winCombos
    winCombos = [
    ["#box1", "#box2", "#box3"],
    ["#box1", "#box4", "#box7"],
    ["#box1", "#box5", "#box9"],
    ["#box2", "#box5", "#box8"],
    ["#box3", "#box5", "#box7"],
    ["#box3", "#box6", "#box9"],
    ["#box4", "#box5", "#box6"],
    ["#box7", "#box8", "#box9"]
  ];
    //reset box click
    $(".box").off("click");
}

function settingPlayer() {
    $("#btnOnePlayer").on("click", function () {
        player = 1;
    });
    $("#btnTwoPlayers").on("click", function () {
        player = 2;
    });
}

function settingToken() {
    $("#btnStartWithCircle").on("click", function () {
        firstMoveToken = "tokenCircle";
        secondMoveToken = "tokenCross";
    });
    $("#btnStartWithCross").on("click", function () {
        firstMoveToken = "tokenCross";
        secondMoveToken = "tokenCircle";
    });
}

function currentMove() {
    if (player === 2) {
        turn = '.turn-' + firstMoveToken;
        notTurn = '.turn-' + secondMoveToken;
        $(turn).css({
            'opacity': '1'
        });
        $(notTurn).css({
            'opacity': '0'
        });
        $(".box").on("click", function () {
            if (
                $(this).hasClass("tokenCross") === false &&
                $(this).hasClass("tokenCircle") === false
            ) {
                clicks++;
                if (clicks % 2 == 0) {
                    //check for even move
                    $(this).addClass(secondMoveToken);
                    $(turn).css({
                        'opacity': '1'
                    });
                    $(notTurn).css({
                        'opacity': '0'
                    });
                } else {
                    //check for odd move
                    $(this).addClass(firstMoveToken);
                    $(turn).css({
                        'opacity': '0'
                    });
                    $(notTurn).css({
                        'opacity': '1'
                    });
                }
            }
            if (roundResult() == "Circle scores") {
                $(turn).css({
                    'opacity': '0'
                });
                $(notTurn).css({
                    'opacity': '0'
                });
                scoreAnimation("scoreCircle");
                scoreCircle++;
                $('#scoreCircle').html(scoreCircle);
                roundResult();
                changeTurn();
            } else if (roundResult() == "Cross scores") {
                $(turn).css({
                    'opacity': '0'
                });
                $(notTurn).css({
                    'opacity': '0'
                });
                scoreAnimation("scoreCross");
                scoreCross++;
                $('#scoreCross').html(scoreCross);
                roundResult();
                changeTurn();
            } else if (clicks > 8 && roundResult() == "No one scores") {
                $(turn).css({
                    'opacity': '0'
                });
                $(notTurn).css({
                    'opacity': '0'
                });
                tie(); //Need to design what "tie" looks like
                roundReset();
                changeTurn();
            }
        });
    } else if (player === 1) {
        checkRounds();
    } //else if (player === 1)
} //function currentMove()

function checkRounds() {
    if (rounds % 2 != 0) {
        onePlayerOddRounds();
    } else if (rounds % 2 == 0) {
        setTimeout(function () {
            onePlayerEvenRounds();
        }, 2000);
    }
}

function onePlayerOddRounds() {
    $('.box').off('click'); //reset clicks every round
    $(".box").css({
        "pointer-events": "auto"
    }); //Enable clicks
    //Indicate who's turn
    turn = '.turn-' + firstMoveToken;
    notTurn = '.turn-' + secondMoveToken;
    $(turn).css({
        'opacity': '1'
    });
    $(notTurn).css({
        'opacity': '0'
    });

    $(".box").on("click", function () {
        clicks++;
        if (
            $(this).hasClass("tokenCross") === false &&
            $(this).hasClass("tokenCircle") === false
        ) {
            //Human moves first
            $(this).addClass(firstMoveToken);

            console.log(roundResult());
            console.log(clicks);

            $(".box").css({
                "pointer-events": "none"
            }); //Disable clicks before computer makes a move
            //Check result      
            if (clicks <= 4) {
                if (roundResult() == "Circle scores") {
                    $(turn).css({
                        'opacity': '0'
                    });
                    $(notTurn).css({
                        'opacity': '0'
                    });
                    scoreAnimation("scoreCircle");
                    scoreCircle++;
                    $('#scoreCircle').html(scoreCircle);
                    roundResult();
                    rounds++;
                    checkRounds();
                } else if (roundResult() == "Cross scores") {
                    $(turn).css({
                        'opacity': '0'
                    });
                    $(notTurn).css({
                        'opacity': '0'
                    });
                    scoreAnimation("scoreCross");
                    scoreCross++;
                    $('#scoreCross').html(scoreCross);
                    roundResult();
                    rounds++;
                    checkRounds();
                } else if (roundResult() == "No one scores") {
                    $(turn).css({
                        'opacity': '0'
                    });
                    $(notTurn).css({
                        'opacity': '1'
                    });
                    RandomNum = getRandomInteger(1, 9);
                    makeRandomMove = "#box" + RandomNum;
                    while (
                        //Keep generating random moves until a possible move
                        $(makeRandomMove).hasClass("tokenCircle") === true ||
                        $(makeRandomMove).hasClass("tokenCross") === true
                    ) {
                        RandomNum = getRandomInteger(1, 9);
                        makeRandomMove = "#box" + RandomNum;
                    }
                    setTimeout(function () {
                        // Computer makes a move
                        $(makeRandomMove).addClass(secondMoveToken);
                        $(turn).css({
                            'opacity': '1'
                        });
                        $(notTurn).css({
                            'opacity': '0'
                        });
                        // Check result after computer makes a move
                        if (roundResult() == "Circle scores") {
                            $(turn).css({
                                'opacity': '0'
                            });
                            $(notTurn).css({
                                'opacity': '0'
                            });
                            scoreAnimation("scoreCircle");
                            scoreCircle++;
                            $('#scoreCircle').html(scoreCircle);
                            roundResult();
                            rounds++;
                            checkRounds();
                        } else if (roundResult() == "Cross scores") {
                            $(turn).css({
                                'opacity': '0'
                            });
                            $(notTurn).css({
                                'opacity': '0'
                            });
                            scoreAnimation("scoreCross");
                            scoreCross++;
                            $('#scoreCross').html(scoreCross);
                            roundResult();
                            rounds++;
                            checkRounds();
                        }
                        $(".box").css({
                            "pointer-events": "auto"
                        }); //enable clicks after computer made a move
                    }, 500);
                }
                //Last human move result
            } else if (clicks > 4) {
                $(turn).css({
                    'opacity': '0'
                });
                $(notTurn).css({
                    'opacity': '0'
                });
                if (roundResult() == "Circle scores") {
                    scoreAnimation("scoreCircle");
                    scoreCircle++;
                    $('#scoreCircle').html(scoreCircle);
                    roundResult();
                    rounds++;
                    checkRounds();
                } else if (roundResult() == "Cross scores") {
                    scoreAnimation("scoreCross");
                    scoreCross++;
                    $('#scoreCross').html(scoreCross);
                    roundResult();
                    rounds++;
                    checkRounds();
                } else if (roundResult() == "No one scores") {
                    tie(); //Need to design what "tie" looks like
                    roundReset();
                    rounds++;
                    checkRounds();
                }
            } //else if (clicks > 4) 
        } //if ($(this).hasClass('tokenCross')
    });
}

function onePlayerEvenRounds() {
    $('.box').off('click'); //reset clicks every round
    $(".box").css({
        "pointer-events": "none"
    }); //Disable clicks before computer makes a move
    //Indicate who's turn
    turn = '.turn-' + firstMoveToken;
    notTurn = '.turn-' + secondMoveToken;
    $(turn).css({
        'opacity': '0'
    });
    $(notTurn).css({
        'opacity': '1'
    });

    // Computer makes first move
    //Keep generating random moves until a possible move
    RandomNum = getRandomInteger(1, 9);
    makeRandomMove = "#box" + RandomNum;
    while (
        $(makeRandomMove).hasClass("tokenCircle") === true ||
        $(makeRandomMove).hasClass("tokenCross") === true
    ) {
        RandomNum = getRandomInteger(1, 9);
        makeRandomMove = "#box" + RandomNum;
    }
    setTimeout(function () {
        $(makeRandomMove).addClass(secondMoveToken);
        clicks++;
        console.log(clicks);
        $(turn).css({
            'opacity': '1'
        });
        $(notTurn).css({
            'opacity': '0'
        });
    }, 500); //setTimeout


    //Human makes second move
    $(".box").css({
        "pointer-events": "auto"
    }); //Enable clicks after computer made a move
    $(".box").on("click", function () {
        if (
            $(this).hasClass("tokenCross") === false &&
            $(this).hasClass("tokenCircle") === false
        ) {
            //Human moves
            $(this).addClass(firstMoveToken);

            console.log(roundResult());

            //Check result after human moves
            if (roundResult() == "Circle scores") {
                $(turn).css({
                    'opacity': '0'
                });
                $(notTurn).css({
                    'opacity': '0'
                });
                scoreAnimation("scoreCircle");
                scoreCircle++;
                $('#scoreCircle').html(scoreCircle);
                roundResult();
                rounds++;
                checkRounds();
            } else if (roundResult() == "Cross scores") {
                $(turn).css({
                    'opacity': '0'
                });
                $(notTurn).css({
                    'opacity': '0'
                });
                scoreAnimation("scoreCross");
                scoreCross++;
                $('#scoreCross').html(scoreCross);
                roundResult();
                rounds++;
                checkRounds();
            } else if (roundResult() == "No one scores") {
                $(turn).css({
                    'opacity': '0'
                });
                $(notTurn).css({
                    'opacity': '1'
                });
                setTimeout(function () {
                    // Computer makes a move again after human makes a move          
                    RandomNum = getRandomInteger(1, 9);
                    makeRandomMove = "#box" + RandomNum;
                    while (
                        //Keep generating random moves until a possible move
                        $(makeRandomMove).hasClass("tokenCircle") === true ||
                        $(makeRandomMove).hasClass("tokenCross") === true
                    ) {
                        RandomNum = getRandomInteger(1, 9);
                        makeRandomMove = "#box" + RandomNum;
                    }
                    $(makeRandomMove).addClass(secondMoveToken);
                    clicks++;
                    console.log(clicks);
                    // Check result after computer makes a move
                    if (roundResult() == "Circle scores") {
                        $(turn).css({
                            'opacity': '0'
                        });
                        $(notTurn).css({
                            'opacity': '0'
                        });
                        scoreAnimation("scoreCircle");
                        scoreCircle++;
                        $('#scoreCircle').html(scoreCircle);
                        roundResult();
                        rounds++;
                        checkRounds();
                    } else if (roundResult() == "Cross scores") {
                        $(turn).css({
                            'opacity': '0'
                        });
                        $(notTurn).css({
                            'opacity': '0'
                        });
                        scoreAnimation("scoreCross");
                        scoreCross++;
                        $('#scoreCross').html(scoreCross);
                        roundResult();
                        rounds++;
                        checkRounds();
                    } else if (clicks <= 4 && roundResult() == "No one scores") {
                        $(turn).css({
                            'opacity': '1'
                        });
                        $(notTurn).css({
                            'opacity': '0'
                        });
                    } else if (clicks > 4 && roundResult() == "No one scores") {
                        $(turn).css({
                            'opacity': '0'
                        });
                        $(notTurn).css({
                            'opacity': '0'
                        });
                        tie(); //Need to design what "tie" looks like
                        roundReset();
                        rounds++;
                        checkRounds();
                    }
                    // $(".box").css({ "pointer-events": "auto" }); //enable clicks after computer made a move
                }, 500);
            }
        } //if $(this).hasClass("tokenCross")
    }); //$(".box").on("click")
}

function scoreAnimation(string) {
    var scoreID = "#" + string;
    console.log(scoreID);
    $(scoreID).addClass('animated flash');
    setTimeout(function () {
        $(scoreID).removeClass('animated flash');
    }, 2000); //The time should sync with roundReset();
}

function getRandomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function roundResult() {
    for (var i = 0; i < winCombos.length; i++) {
        if (
            $(winCombos[i][0]).hasClass("tokenCircle") == true &&
            $(winCombos[i][1]).hasClass("tokenCircle") == true &&
            $(winCombos[i][2]).hasClass("tokenCircle") == true
        ) {
            $(winCombos[i][0]).addClass('animated flash');
            $(winCombos[i][1]).addClass('animated flash');
            $(winCombos[i][2]).addClass('animated flash');
            setTimeout(function () {
                $(winCombos[i][0]).removeClass('animated flash');
                $(winCombos[i][1]).removeClass('animated flash');
                $(winCombos[i][2]).removeClass('animated flash');
            }, 2000); //The time should sync with roundReset();
            winCombos[i] = null; //Take out the winCombo from the array
            roundReset();
            return "Circle scores";
        }
        if (
            $(winCombos[i][0]).hasClass("tokenCross") == true &&
            $(winCombos[i][1]).hasClass("tokenCross") == true &&
            $(winCombos[i][2]).hasClass("tokenCross") == true
        ) {
            $(winCombos[i][0]).addClass('animated flash');
            $(winCombos[i][1]).addClass('animated flash');
            $(winCombos[i][2]).addClass('animated flash');
            setTimeout(function () {
                $(winCombos[i][0]).removeClass('animated flash');
                $(winCombos[i][1]).removeClass('animated flash');
                $(winCombos[i][2]).removeClass('animated flash');
            }, 2000); //The time should sync with roundReset();
            winCombos[i] = null; //Take out the winCombo from the array
            roundReset();
            return "Cross scores";
        }
    }
    return "No one scores";
}

function roundReset() {
    //reset token
    clicks = 0;
    //reset winCombos
    winCombos = [
    ["#box1", "#box2", "#box3"],
    ["#box1", "#box4", "#box7"],
    ["#box1", "#box5", "#box9"],
    ["#box2", "#box5", "#box8"],
    ["#box3", "#box5", "#box7"],
    ["#box3", "#box6", "#box9"],
    ["#box4", "#box5", "#box6"],
    ["#box7", "#box8", "#box9"]
  ];
    //reset tokens
    setTimeout(function () {
        $(".box").removeClass("tokenCircle tokenCross");
    }, 2000);
}

function tie() {
    $('.tieMessage div').css({
        'opacity': '1'
    });
    $('.tieMessage div').addClass('animated fadeInDown');
    setTimeout(function () {
        $('.tieMessage div').removeClass('animated fadeInDown');
        $('.tieMessage div').css({
            'opacity': '0'
        });
    }, 2000); //The time should sync with roundReset();
}

function changeTurn() {
    var firstToken = firstMoveToken;
    firstMoveToken = secondMoveToken;
    secondMoveToken = firstToken;
    turn = '.turn-' + firstMoveToken;
    notTurn = '.turn-' + secondMoveToken;
    setTimeout(function () {
        $(turn).css({
            'opacity': '1'
        });
        $(notTurn).css({
            'opacity': '0'
        });
    }, 2000); //The time should sync with roundReset();
}

/*=========================
      Layout functions
==========================*/

function bgColor() {
    if ($(window).width() > 768) {
        $(".bgLeft").css({
            height: "100%",
            width: "50%",
            left: "0"
        });
        $(".bgRight").css({
            height: "100%",
            width: "50%",
            top: "0",
            right: "0",
            bottom: "auto"
        });
    } else {
        $(".bgLeft").css({
            width: "100%",
            height: "50%"
        });
        $(".bgRight").css({
            width: "100%",
            height: "50%",
            bottom: "0",
            top: "auto"
        });
    }
}

function containerPosition() {
    if ($(window).width() > 768) {
        $(".container").css({
            height: "100%"
        });
    } else {
        $(".container").css({
            height: "calc(100% - 48px)"
        });
    }
}

function btnReset() {
    if ($(window).width() > 768) {
        $(".bgLeft").css({
            height: "100%",
            width: "50%",
            left: "0"
        });
        $(".bgRight").css({
            height: "100%",
            width: "50%",
            top: "0",
            right: "0",
            bottom: "auto"
        });
        $("#btnReset").css({
            display: "block",
            opacity: "1",
            position: "absolute",
            bottom: "-88px",
            left: "50%",
            margin: "0 0 20px -64px",
            width: "128px"
        });
    } else {
        //When screen < 768
        $(".bgLeft").css({
            width: "100%",
            height: "calc(50% - 24px)"
        });
        $(".bgRight").css({
            width: "100%",
            height: "calc(50% - 24px)",
            bottom: "48px",
            top: "auto"
        });
        $("#btnReset").css({
            display: "block",
            opacity: "1",
            position: "fixed",
            bottom: "0",
            left: "0",
            margin: "0",
            width: "100%"
        });
    }
}

function boardSizeExpand() {
    $("#gameSetting").css({
        transform: "scale(0)"
    });
    setTimeout(function () {
        $("#gameSetting").css({
            display: "none"
        });
    }, 300);
    setTimeout(function () {
        $("#boxes").css({
            display: "flex"
        });
        $("#boxes").css({
            transform: "scale(1)"
        });
        var boardHeight = $("#board").width();
        $("#board").css({
            height: boardHeight
        });
    }, 800);
    // var boardHeight = "360px";
    $("#board").css({
        "max-width": "80%",
        width: "360px",
        height: "360px"
    });
    $(window).on("resize", function boardResponsive() {
        var boardHeight = $("#board").width();
        $("#board").css({
            height: boardHeight
        });
    });
}

function boardSizeRevert() {
    $("#boxes").css({
        display: "none"
    });
    $("#gameSetting").css({
        display: "flex"
    });
    setTimeout(function () {
        $("#gameSetting").css({
            transform: "scale(1)"
        });
    }, 400);
    $("#board").css({
        width: "280px",
        height: "340px"
    });
    $(window).off("resize");
}

function setting() {
    $("#btnTwoPlayers").on("click", function () {
        $(".selectionPlayer").css({
            left: "114px"
        });
    });

    $("#btnOnePlayer").on("click", function () {
        $(".selectionPlayer").css({
            left: "0"
        });
    });

    $("#btnStartWithCross").on("click", function () {
        $(".selectionToken").css({
            left: "114px"
        });
    });

    $("#btnStartWithCircle").on("click", function () {
        $(".selectionToken").css({
            left: "0"
        });
    });
}