var currentLevel = 1;
var sequenceNumber = 0;
var sequenceNumberPlayer = 0;
var isPlayersTurn = false;
var gameSequence = [];
var playerSequence = [];
var currentHighScore = 0;
const nextLevelEvent = new Event("nextLevel");
const colors = ["green", "red", "yellow", "blue"];

var started = false;

$("#highscore-title").text("Current Highscore " + 0);
$(".btn").fadeTo(100, 0.3);

$(".btn").click(buttonClicked);

// Listen for the event.
document.addEventListener("nextLevel", startSequence);

$(document).keypress(function (event) {
    if (event.key == "Enter" && !started)
    {
        
        started = true;
        currentLevel = 1;
        document.dispatchEvent(nextLevelEvent);
    }
});

function buttonClicked()
{
    if (isPlayersTurn)
    {
        var id = $(this).attr("id");
        console.log(id);
        playerSequence.push(id);
        flashButton(id);
        playSound(id);
        checkSequence();
    }
}


function startSequence()
{
    sequenceNumber = 0;
    setTitle("Level " + currentLevel);
    gameSequence = getSequence(currentLevel); 
    playerSequence = [];      
    playAndFlashButton();
}

function getSequence(level){

    var sequence = [];
    for (levelNumber = 1; levelNumber <= level; levelNumber++) {
        var colorNumber = Math.floor(Math.random() * 4);
        sequence.push(colors[colorNumber]);

    }

    return sequence;
}

function buttonPressed(id){    
    
    $("#" + id).addClass("pressed");
    setTimeout(function (){
        $("#" + id).removeClass("pressed");
    },200);
}

function playSound(color)
{
    var audio = new Audio("./sounds/" + id + ".mp3");
    audio.play();
}

function playAndFlashButton(){
    
    var id = gameSequence[sequenceNumber];
    console.log(" - Level " + currentLevel + ": play sound " + sequenceNumber + " -> " + id);
    
    
    var audio = new Audio("./sounds/" + id + ".mp3");

    audio.addEventListener("ended", function (){
        setTimeout(function () { sequenceNumber++;
            playNext()}, 100)});
    audio.play();
    flashButton(id);
}

function flashButton(color)
{
    $("."+color).fadeTo(300, 1).fadeTo(100, 0.3);
}
    

function playSound(id)
{
    var audio = new Audio("./sounds/" + id + ".mp3");
    audio.play();
}

function playNext(){
    
    this.removeEventListener("ended", function (){
        setTimeout(function () { sequenceNumber++;
            playNext()}, 100)});
    if (sequenceNumber < gameSequence.length)
    {
        
        playAndFlashButton(gameSequence);

    }
    else{
        isPlayersTurn = true;
    }
}

function checkSequence()
{
        if (gameSequence[sequenceNumberPlayer] != playerSequence[sequenceNumberPlayer])
        {
            isPlayersTurn = false;
            playSound("wrong");
            $("body").addClass("game-over");
            setTimeout(function () {
                
                $("body").removeClass("game-over");
            },1000);
            setTitle("Game over at level " + currentLevel + " Press Enter to Start")
            
            if ((currentLevel-1) > currentHighScore)
            {        
                currentHighScore = currentLevel-1;        
                $("#highscore-title").text("Current Highscore " + currentHighScore);
            }
            started = false;
        }
        else
        {
            sequenceNumberPlayer++;
            if(gameSequence.length == playerSequence.length)
                {
                    sequenceNumberPlayer = 0;
                    currentLevel ++;
                    isPlayersTurn = false;
                    setTimeout(function () {
                        console.log("Start Level " + currentLevel);
                        console.log("-------------------------------");
                        document.dispatchEvent(nextLevelEvent);
                    }, 2000);
                }
        }
}

function setTitle(title)
{
    $("#level-title").text(title);
}