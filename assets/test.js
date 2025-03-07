// Fetch test data from JSON
const urlParams = new URLSearchParams(window.location.search);
const testID = urlParams.get('id');

fetch("data/tests.json") // ✅ JSON path fixed
    .then(response => response.json())
    .then(data => {
        let tests = data.test_series;
        let selectedTest = tests.find(test => test.id === testID);

        if (!selectedTest) {
            document.body.innerHTML = "<h1>Error: Test Not Found!</h1>";
            return;
        }

        let timeLimit = selectedTest.time ? parseInt(selectedTest.time) * 60 : 900;
        let questions = selectedTest.questions;
        let currentQuestionIndex = 0;
        let userAnswers = Array(questions.length).fill(null);
        let timer = timeLimit;

        document.getElementById("countdown").innerText = new Date(timer * 1000).toISOString().substr(14, 5);

        function loadQuestion() {
            let questionData = questions[currentQuestionIndex];
            document.getElementById("question-box").innerText = (currentQuestionIndex + 1) + ". " + questionData.question;

            let optionsHTML = "";
            questionData.options.forEach((option, index) => {
                optionsHTML += `<div class="option" onclick="selectOption(${index})">${option}</div>`;
            });

            document.getElementById("options-box").innerHTML = optionsHTML;
            highlightSelectedOption();
            updateNavButtons();
        }

        function highlightSelectedOption() {
            let options = document.querySelectorAll(".option");
            options.forEach((option, i) => {
                option.classList.remove("selected");
                if (userAnswers[currentQuestionIndex] === i) {
                    option.classList.add("selected");
                }
            });
        }

        window.selectOption = function (index) {
            userAnswers[currentQuestionIndex] = index;
            highlightSelectedOption();
        };

        function nextQuestion() {
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                loadQuestion();
            } else {
                submitTest();
            }
        }

        function prevQuestion() {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                loadQuestion();
            }
        }

        function updateNavButtons() {
            document.getElementById("prev-btn").style.display = currentQuestionIndex === 0 ? "none" : "inline-block";
            document.getElementById("next-btn").innerText = currentQuestionIndex === questions.length - 1 ? "Submit" : "Next";
        }

        function submitTest() {
            let correct = 0;
            let incorrect = 0;
            let userResponse = [];

            questions.forEach((question, i) => {
                let selectedIndex = userAnswers[i] ?? -1;
                let isCorrect = selectedIndex !== -1 && question.options[selectedIndex] === question.answer;

                if (isCorrect) {
                    correct++;
                    userResponse.push("t"); // ✅ Correct Answer
                } else if (selectedIndex !== -1) {
                    incorrect++;
                    userResponse.push("f"); // ❌ Incorrect Answer
                } else {
                    userResponse.push("n"); // ❌ Not Attempted
                }
            });

            let penalty = incorrect * (1 / 3); // ❌ 1/3rd negative marking
            let finalScore = Math.max(0, correct - penalty); // ✅ Score can't be negative

            let queryString = `id=${testID}&score=${finalScore.toFixed(2)}&total=${questions.length}&time=${timer}`;
            userResponse.forEach((res, index) => {
                queryString += `&q${index + 1}=${res}`;
            });

            window.location.href = `result.html?${queryString}`;
        }

        function startTimer() {
            let countdownElement = document.getElementById("countdown");
            let timerInterval = setInterval(() => {
                if (timer > 0) {
                    timer--;
                    countdownElement.innerText = new Date(timer * 1000).toISOString().substr(14, 5);
                } else {
                    clearInterval(timerInterval);
                    submitTest();
                }
            }, 1000);
        }

        document.getElementById("next-btn").addEventListener("click", nextQuestion);
        document.getElementById("prev-btn").addEventListener("click", prevQuestion);

        loadQuestion();
        startTimer();
    })
    .catch(error => {
        console.error("Error loading test data:", error);
    });
