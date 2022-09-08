//The entire website revolves around this singular root.
//Should be possible to change things via button commands and whatnot
var rootEl = document.getElementById('root');
var topbarEl = document.getElementById('topbar');

//Initialize some universal values, like the score and the timer
var score = 0;
var timeLeft = 0;
var scores = [];

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
var quiz = document.createElement("section");
quiz.classList.add("quiz");
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
submitEl.textContent = "Submit Score"

var menuReturnEl = document.createElement("button");
menuReturnEl.textContent = "Return to Main Menu";
menuReturnEl.addEventListener("click", function(){
    titleScreen()
})

//Initializes the High Score scoreboard
var highScores = document.createElement("section");
var savedScores = document.createElement("div");

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
    if(rootEl.firstChild){
        rootEl.removeChild(rootEl.firstChild);
    }
    highScoreButtonEl.setAttribute("style", "display: none")
    timerEl.setAttribute("style", "display: block")
    rootEl.appendChild(quiz);
    score = 0;
    timeLeft = 300;

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
    
    var question = askQuestion(score);
    
    quiz.addEventListener("click", function(event){
        if(event.target&&event.target.innerHTML == question.rightAnswer){           
            score++;
            question = askQuestion(score)
            if(question === "Finished"){
                clearInterval(timeInterval);
                displayResults();
            }
        }
        else if(event.target){
            console.log("Wrong answer!");
            timeLeft = timeLeft - 10
            if (timeLeft <= 0){
                timeLeft = 0;
                clearInterval(timeInterval);
                displayResults();
            }
            timerEl.textContent = timeLeft + " seconds left.";
            
        }
    })
}

//Generates a question and listens for right or wrong answers.
function askQuestion(number){
    var selection = accessQuestionArchive(number);
    if (selection === "Finished"){
        return "Finished";
    }

    askedQuestion.textContent = selection.question;
    quiz.appendChild(askedQuestion);

    var scrambledAnswers = selection.answers;
    scrambledAnswers.sort(() => Math.random() - 0.5);
    choiceOne.textContent = scrambledAnswers[0];
    choiceTwo.textContent = scrambledAnswers[1];
    choiceThree.textContent = scrambledAnswers[2];
    choiceFour.textContent = scrambledAnswers[3];

    quiz.appendChild(choiceOne);
    quiz.appendChild(choiceTwo);
    quiz.appendChild(choiceThree);
    quiz.appendChild(choiceFour);

    return selection;
}

//A convenient place to add and remove questions as needed.
//Also lets the calling function know if there's no questions left.
function accessQuestionArchive(number){
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

//
function submitScore(){
    submitEl.removeEventListener("click", submitScore)
    scores.push({
        user: nameInput.value,
        result: score 
    })
    console.log(scores);
}


//Removes anything in the root and opens the high score scoreboard
function displayHighScores(){
    if(rootEl.firstChild){
        rootEl.removeChild(rootEl.firstChild);
    }

    //Menu return button already exists so just reuse that
    highScores.appendChild(menuReturnEl);
    highScores.appendChild(savedScores);
    rootEl.appendChild(highScores);

    scores = localStorage.getItem("scores")
}

titleScreen();
//A huge-ass to-do list for later:
/*Initialization
Probably will make the whole thing in Javascript, partially for practice. Might make it easier to loop, who knows.
A Title, A descriptor, and a start button.
Has a 'High Scores' button to indicate past attempts
    Sorted in order of score, perhaps
*/

/*The Quiz - Begins when start button pressed
Create question, make the timer appear and tick down, and also a bunch of possible answers
    Make a function for the timer and its functions
    Perhaps add a spot in the code to pull question and answer sets from
        Answers oughta be 3 wrong answers and 1 right answer... how do I randomize the options?
        Questions shouldn't repeat, but they need to be randomized too... hmm.
    If correct answer pressed, add a point. If wrong answer pressed, deduct time from the timer.
        Perhaps add fancy 'point added' and 'time deducted' labels that fade away?
Once timer hits 0, quiz ends, terminate operation
*/

/*The Evaluation - Begins when Quiz finishes
Change website page to note the score obtained
    Perhaps also add a 'questions answered correctly' value?
Allows input of high score and saves it in the local directory so it persists after refresh
    Only able to save the high score once, no need for leaderboard spam
Whether saved high score or not, have a button to loop back to initialization stage
 */