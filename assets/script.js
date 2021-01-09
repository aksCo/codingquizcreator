function initaliseQuiz() {
    let timeLeft = 0;


    //Clicking 'Start Quiz' starts quiz

    const startButtonEL = document.getElementById("start-button");
    const timeLeftEL = document.getElementById("time-remaining");
    const finalScoreEL = document.getElementById("final-score");
    const noQuestions = questions.length;

    const landingContainerEl = document.getElementById("landing-container");
    const quizContainerEl = document.getElementById("quiz-container");

    const finalContainerEl = document.getElementById("final-container");
    const submitButtonEL = document.getElementById("submit-initials");

    const highscoreButtonEL = document.getElementById("highscore-button");
    const highscoreContainerEL = document.getElementById("highscore-container");

    let highScores = [];

    if (JSON.parse(localStorage.getItem('scores')) !== null) {
        highScores = JSON.parse(localStorage.getItem("scores"));
    }

    function startQuiz() {
        landingContainerEl.setAttribute("class", "container d-none");
        let rowEl = null;
        let colEl = null;
        let headerEl = null;
        let buttonEl = null;
        quizContainerEl.setAttribute("class", "container");
        let currentQuestion = 1;
        let score = 0;

        timeLeft = noQuestions * 10;
        timeLeftEL.setAttribute("value", timeLeft);

        let myInterval = setInterval(function() {
            if (timeLeft < 1) {
                clearInterval(myInterval);
                quizContainerEl.setAttribute("class", "container d-none");
                finalContainerEl.setAttribute("class", "container");
                return;
            }
            timeLeft = timeLeft - 1;
            timeLeftEL.setAttribute("value", timeLeft);

        }, 1000);

        let clickTimeout = false;

        function generateQuestion(questionNum) {
            quizContainerEl.innerHTML = "";
            rowEl = document.createElement("div");
            rowEl.setAttribute("class", "row");
            quizContainerEl.append(rowEl);

            colEl = document.createElement("div");
            colEl.setAttribute("class", "col-0 col-sm-2");
            rowEl.append(colEl);

            colEl = document.createElement("div");
            colEl.setAttribute("class", "col-12 col-sm-8");
            rowEl.append(colEl);

            colEl = document.createElement("div");
            colEl.setAttribute("class", "col-0 col-sm-2");
            rowEl.append(colEl);

            colEl = rowEl.children[1];
            rowEl = document.createElement("div");
            rowEl.setAttribute("class", "row mb-3");
            colEl.append(rowEl);

            colEl = document.createElement("div");
            colEl.setAttribute("class", "col-12");
            rowEl.append(colEl);

            headerEl = document.createElement("h2");
            headerEl.innerHTML = questions[questionNum - 1].title;
            colEl.append(headerEl);

            colEl = quizContainerEl.children[0].children[1];
            for (var i = 0; i < 4; i++) {
                let rowEl = document.createElement("div");
                rowEl.setAttribute("class", "row mb-1");
                colEl.append(rowEl);

                let colEl2 = document.createElement("div");
                colEl2.setAttribute("class", "col-12");
                rowEl.append(colEl2);

                buttonEl = document.createElement("button");
                buttonEl.setAttribute("class", "btn btn-secondary");

                buttonEl.setAttribute("type", "button");
                buttonEl.innerHTML = questions[currentQuestion - 1].choices[i];
                colEl2.append(buttonEl);
                buttonEl.addEventListener("click", function() {
                    if (clickTimeout) {
                        return;
                    }
                    clickTimeout = true;
                    clearInterval(myInterval);
                    let colEl = quizContainerEl.children[0].children[1];
                    let rowEl = document.createElement("div");
                    rowEl.setAttribute("class", "row border-top");
                    colEl.append(rowEl);

                    colEl = document.createElement("div");
                    colEl.setAttribute("class", "col-12");
                    rowEl.append(colEl);

                    let parEl = document.createElement("p");
                    colEl.append(parEl);

                    if (this.innerHTML === questions[currentQuestion - 1].answer) {
                        parEl.innerHTML = "Correct";
                    } else {
                        parEl.innerHTML = "Incorrect";
                        timeLeft = timeLeft - 10;
                        if (timeLeft < 0) {
                            timeLeft = 0;
                        }
                        timeLeftEL.setAttribute("value", timeLeft);
                    }
                    currentQuestion++;
                    if (currentQuestion > questions.length) {
                        score = timeLeft;
                    }

                    setTimeout(function() {
                        if (currentQuestion > questions.length) {
                            quizContainerEl.setAttribute("class", "container d-none");
                            finalContainerEl.setAttribute("class", "container");
                            finalScoreEL.setAttribute("value", score);
                        } else {
                            generateQuestion(currentQuestion);
                            clickTimeout = false;
                            myInterval = setInterval(function() {
                                if (timeLeft < 1) {
                                    clearInterval(myInterval);
                                    quizContainerEl.setAttribute("class", "container d-none");
                                    finalContainerEl.setAttribute("class", "container");
                                    return;
                                }
                                timeLeft = timeLeft - 1;
                                timeLeftEL.setAttribute("value", timeLeft);
                            }, 1000);
                        }
                    }, 2000);
                });
            }
        }

        function saveHighScore() {
            let initialsEl = document.getElementById("initials-entry");
            let newHighScore = {
                initials: initialsEl.nodeValue,
                highScore: score
            };
            console.log(newHighScore);
            highScores.push(newHighScore);
            console.log(highScores);
            localStorage.setItem("scores", JSON.stringify(highScores));
        }
        submitButtonEL.addEventListener("click", saveHighScore);
        generateQuestion(currentQuestion);
    }

    startButtonEL.addEventListener("click", startQuiz);

    highscoreButtonEL.addEventListener("click", function() {
        landingContainerEl.setAttribute("class", "container d-none");
        quizContainerEl.setAttribute("class", "container d-none");
        finalContainerEl.setAttribute("class", "container d-none");
        highscoreContainerEL.setAttribute("class", "container");

        let colEl = document.getElementById("highscore-table");
        for (var i = 0; i < highScores.length; i++) {
            let rowEl = document.createElement("div");
            rowEl.setAttribute("class", "row mb-1");
            colEl.append(rowEl);

            let colEl2 = document.createElement("div");
            colEl2.setAttribute("class", "col-12 text-center");
            rowEl.append(colEl2);

            let parEl = document.createElement("div");
            parEl.innerHTML = "Initials: " + highScores[i].initials + "  Score: " + highScores[i].highScore;
            colEl2.append(parEl);
        }
    });

}
initaliseQuiz();