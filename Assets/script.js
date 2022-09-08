//The entire website revolves around this singular root.
//Should be possible to change things via button commands and whatnot
var rootEl = document.getElementById('root');
var topbarEl = document.getElementById('topbar');

//Initialize some universal values, like the score and the timer
var score = 0;
var timeLeft = 0;
var scores = [];


//Pulls high scores from local storage if any are present.
    
var savedata = JSON.parse(localStorage.getItem("scores"))
if(savedata){
    scores = savedata;
}

//Initializes the title screen
var landing = document.createElement("section");
var titleEl = document.createElement("h1");
var welcomeEl = document.createElement("p");
var startEl = document.createElement("button");
var highScoreButtonEl = document.getElementById("highscore")
highScoreButtonEl.addEventListener("click", function(){
    displayHighScores();
})

startEl.addEventListener("click", function(){
    startQuiz()
})
titleEl.textContent = "Coding Quiz";   
welcomeEl.textContent = "This little website will test your knowledge of Javascript!";
startEl.textContent = "Start Quiz";

//Initializes the quiz itself
var timerEl = document.getElementById('timer');
var scoreEl = document.getElementById('score');
var judgeEl = document.createElement("p");
var askedQuestion = document.createElement("h2");
var choiceOne = document.createElement("button");
var choiceTwo = document.createElement("button");
var choiceThree = document.createElement("button");
var choiceFour = document.createElement("button");

//Initializes the Evaluation screen
var evaluation = document.createElement("section");
var totalScoreEl = document.createElement("p");

var namePromptEl = document.createElement("div");
var nameMessageEl = document.createElement("h3");
var nameInput = document.createElement("input", "type: text")
nameMessageEl.textContent = "Enter your name: "
var submitEl = document.createElement("button");

var menuReturnEl = document.createElement("button");
menuReturnEl.textContent = "Return to Main Menu";
menuReturnEl.addEventListener("click", function(){
    titleScreen()
})

//Initializes the High Score scoreboard
var highScores = document.createElement("section");
var savedScores = document.createElement("div");
var clearScores = document.createElement("button");
clearScores.textContent = "Clear all Saved Scores";
clearScores.addEventListener("click", function(){
    localStorage.clear("scores");
    scores = [];
    if(savedScores.firstChild){
        while(savedScores.firstChild){
            savedScores.removeChild(savedScores.firstChild);
        }
    }
})
highScores.classList.add("allScores")

//Removes anything already in the root and summons the title screen
function titleScreen(){
    if(rootEl.firstChild){
        rootEl.removeChild(rootEl.firstChild);
    }
    highScoreButtonEl.setAttribute("style", "display: block")
    timerEl.setAttribute("style", "display: none")
    
    landing.appendChild(titleEl);
    landing.appendChild(welcomeEl);
    landing.appendChild(startEl);
    rootEl.appendChild(landing);
}


//Removes anything in the root and starts the quiz
function startQuiz(){
    
    var quiz = document.createElement("section");
    quiz.classList.add("quiz");
    quiz.appendChild(askedQuestion);
    quiz.appendChild(choiceOne);
    quiz.appendChild(choiceTwo);
    quiz.appendChild(choiceThree);
    quiz.appendChild(choiceFour);
    quiz.appendChild(judgeEl);
    if(rootEl.firstChild){
        rootEl.removeChild(rootEl.firstChild);
    }
    highScoreButtonEl.setAttribute("style", "display: none")
    timerEl.setAttribute("style", "display: block")
    judgeEl.textContent = " " 
    rootEl.appendChild(quiz);
    score = 0;
    timeLeft = 60;
    //starts the timer
    timerEl.textContent = timeLeft + " seconds left.";
    var timeInterval = setInterval(function () {
      timeLeft--;
      timerEl.textContent = timeLeft + " seconds left.";
    if (timeLeft === 0){
        clearInterval(timeInterval);
        displayResults();
    }
    }, 1000);
    
    //Makes a new question.
    var question = askQuestion(score);
    
    //Tests if the selected answer matches the correct answer.
    quiz.addEventListener("click", function(event){
        //If the answer is correct, score goes up by 1 and the next question is generated.
        //If there are no questions left, stops the timer and move to the results screen.
        if(event.target&&event.target.innerHTML == question.rightAnswer){  
            judgeEl.textContent = "Correct! +1 Score!"         
            score++;
            question = askQuestion(score)
            if(question === "Finished"){
                clearInterval(timeInterval);
                displayResults();
            }
        }

        //If the answer is incorrect, then time is subtracted from the clock, and the tiemr is updated to reflect.
        //If the resulting time is 0 or below, set the clock to 0 and move to results screen.
        else if(event.target){
            judgeEl.textContent = "BZZZZT, Wrong! 10 seconds deducted!"
            timeLeft = timeLeft - 10;
            if (timeLeft <= 0){
                timeLeft = 0;
                clearInterval(timeInterval);
                displayResults();
            }
            timerEl.textContent = timeLeft + " seconds left.";
            
        }
    })
}

//Generates a question.
function askQuestion(number){
    var selection = accessQuestionArchive(number);
    if (selection === "Finished"){
        return "Finished";
    }
    
    askedQuestion.textContent = selection.question;

    /*Scrambles the answers so the correct button is randomized.
    After all, it wouldn't do if a quiz has all option As as the correct ones!
    */
    var scrambledAnswers = selection.answers;
    scrambledAnswers.sort(() => Math.random() - 0.5);
    choiceOne.textContent = scrambledAnswers[0];
    choiceTwo.textContent = scrambledAnswers[1];
    choiceThree.textContent = scrambledAnswers[2];
    choiceFour.textContent = scrambledAnswers[3];

    return selection;
}

//A convenient place to add and remove questions as needed.
//Also lets the calling function know if there's no questions left.
function accessQuestionArchive(number){
    
    /*More questions can be added here on the fly.
    A question, a set of four answers, and a right answer.
    Whoever's looking at this... don't judge me too harshly for the placeholders.
    I'm not exactly a 'quizzing' sort of person... >.>
    */
    var questionSet=[
        {
        question: "Sample Question",
        rightAnswer: "Correct",
        answers: ["Correct", "Incorrect 1", "Incorrect 2", "Incorrect 3"]
    },
    {
        question: "Another Sample Question",
        rightAnswer: "Also Correct",
        answers: ["Also Correct", "Incorrect 1", "Incorrect 2", "Incorrect 3"]
    },
    {
        question: "Third Sample Question",
        rightAnswer: "Correct again",
        answers: ["Correct again", "Incorrect 1", "Incorrect 2", "Incorrect 3"]
    }
    ]

    //Returns the question set... unless there are none left, in which case a signal that it's finished is sent back up.
    if(questionSet[number]==undefined){
        return "Finished"
    }
    else{
        var selection = questionSet[number];
        return selection;
    }
}

//Removes anything already in the root and summons the evaluation screen
function displayResults(){
    if(rootEl.firstChild){
        rootEl.removeChild(rootEl.firstChild);
    }
    highScoreButtonEl.setAttribute("style", "display: block")
    timerEl.setAttribute("style", "display: none")
    timerEl.textContent = " ";
    submitEl.textContent = "Submit Score"
    
    evaluation.appendChild(totalScoreEl);
    namePromptEl.appendChild(nameMessageEl);
    namePromptEl.appendChild(nameInput);
    namePromptEl.appendChild(submitEl);
    evaluation.appendChild(namePromptEl);
    evaluation.appendChild(menuReturnEl);
    rootEl.appendChild(evaluation);
    totalScoreEl.textContent = "Your total score is: " + score + "! You also had " + timeLeft + " seconds left on the clock!";
    submitEl.addEventListener("click", submitScore)
}

//Submits the score gained.
function submitScore(){
    //Turns off the button once score is submitted.
    submitEl.removeEventListener("click", submitScore)
    if (scores == "There is nothing here yet"){
        scores = [];
    }
    submitEl.textContent = "Score Submitted!"

    //Adds the new high score to the local storage
    scores.push({
        user: nameInput.value,
        result: score 
    })
    localStorage.setItem("scores", JSON.stringify(scores));
}


//Removes anything in the root and opens the high score scoreboard
function displayHighScores(){
    if(rootEl.firstChild){
        rootEl.removeChild(rootEl.firstChild);
    }

    //Menu return button already exists so just reuse that
    
    if(savedScores.firstChild){
        while(savedScores.firstChild){
            savedScores.removeChild(savedScores.firstChild);
        }
    }

    highScores.appendChild(savedScores);
    highScores.appendChild(clearScores)
    highScores.appendChild(menuReturnEl);
    rootEl.appendChild(highScores);

    //If there are saved scores, output results.
    if (scores!== null){
        var singleResult;
        for (var i = 0; i < scores.length; i++){
            singleResult = document.createElement("div")
            singleResult.className = "score";
            singleResult.textContent = scores[i].user + " - " + scores[i].result;
            savedScores.appendChild(singleResult);
        }
    }
}

//After all that, this function starts it all.
titleScreen();