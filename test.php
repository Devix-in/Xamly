<?php
// Fetch test data from JSON
$testData = file_get_contents("data/tests.json");
$tests = json_decode($testData, true);

// Get test ID from URL
$testID = isset($_GET['id']) ? $_GET['id'] : '';
$selectedTest = null;

foreach ($tests['test_series'] as $test) {
    if ($test['id'] === $testID) {
        $selectedTest = $test;
        break;
    }
}

if (!$selectedTest) {
    echo "<h1>Error: Test Not Found!</h1>";
    exit;
}

// Fetch time limit from JSON
$timeLimit = isset($selectedTest['time']) ? intval($selectedTest['time']) * 60 : 900; // Default 15 min
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xamly - Test</title>
    <style>
        /* General Styles */
        body {
            font-family: 'Poppins', sans-serif;
            background: #f9f9fb;
            text-align: center;
            margin: 0;
            padding: 20px;
        }

        /* Test Container */
        .test-container {
            max-width: 600px;
            margin: auto;
            background: #fff;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0px 0px 20px rgba(106, 17, 203, 0.2);
        }

        /* Question Box */
        .question {
            font-size: 1.3rem;
            font-weight: bold;
            color: #6a11cb;
            margin-bottom: 15px;
            text-align: left;
        }

        /* Option Boxes */
        .option {
            display: block;
            padding: 12px;
            margin: 10px 0;
            border-radius: 8px;
            background: white;
            border: 2px solid #ccc;
            cursor: pointer;
            font-size: 1rem;
            transition: 0.3s;
        }

        .option:hover {
            border-color: #6a11cb;
        }

        .option.selected {
            border-color: #6a11cb;
            box-shadow: 0px 0px 15px rgba(106, 17, 203, 0.6);
        }

        /* Navigation Buttons */
        .nav-btn {
            padding: 12px 20px;
            background: linear-gradient(45deg, #6a11cb, #ff00ff);
            color: white;
            font-weight: bold;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            margin: 10px;
            cursor: pointer;
            transition: 0.3s;
        }

        .nav-btn:hover {
            background: linear-gradient(45deg, #ff00ff, #6a11cb);
            transform: scale(1.1);
        }

        /* Timer */
        .timer {
            font-size: 1.2rem;
            font-weight: bold;
            color: #ff0000;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>

    <div class="test-container">
        <p class="timer">Time Left: <span id="countdown"><?php echo gmdate("i:s", $timeLimit); ?></span></p>

        <div id="question-box" class="question"></div>
        <div id="options-box"></div>

        <button id="prev-btn" class="nav-btn">Previous</button>
        <button id="next-btn" class="nav-btn">Next</button>
    </div>

    <script>
        // Fetch Questions
        let questions = <?php echo json_encode($selectedTest['questions']); ?>;
        let currentQuestionIndex = 0;
        let userAnswers = Array(questions.length).fill(null);
        let timer = <?php echo $timeLimit; ?>;

        function loadQuestion() {
            let questionData = questions[currentQuestionIndex];
            document.getElementById("question-box").innerText = (currentQuestionIndex + 1) + ". " + questionData.question;

            let optionsHTML = "";
            questionData.options.forEach((option, index) => {
                optionsHTML += `<div class="option" onclick="selectOption(${index})">${option}</div>`;
            });

            document.getElementById("options-box").innerHTML = optionsHTML;
            updateNavButtons();
        }

        function selectOption(index) {
            userAnswers[currentQuestionIndex] = index;
            let options = document.querySelectorAll(".option");
            options.forEach((option, i) => {
                option.classList.remove("selected");
                if (i === index) option.classList.add("selected");
            });
        }

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
            let score = 0;
            let userResponse = [];

            questions.forEach((question, i) => {
                let selectedIndex = userAnswers[i] ?? -1; // -1 means Not Attempted
                let isCorrect = selectedIndex !== -1 && question.options[selectedIndex] === question.answer;

                userResponse.push(isCorrect ? "t" : selectedIndex === -1 ? "n" : "f"); // t=true, f=false, n=not attempted
                if (isCorrect) score++;
            });

            let queryString = `id=<?php echo $testID; ?>&score=${score}&total=${questions.length}&time=${timer}`;
            userResponse.forEach((res, index) => {
                queryString += `&q${index + 1}=${res}`;
            });

            window.location.href = `result.php?${queryString}`;
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
    </script>
</body>
</html>
