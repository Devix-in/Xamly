<?php
// Fetch test data from JSON
$testData = file_get_contents("data/tests.json");
$tests = json_decode($testData, true);

// Get test ID & score from URL
$testID = isset($_GET['id']) ? $_GET['id'] : '';
$score = isset($_GET['score']) ? intval($_GET['score']) : 0;
$total = isset($_GET['total']) ? intval($_GET['total']) : 1;

// Extract question responses
$responses = [];
foreach ($_GET as $key => $value) {
    if (strpos($key, 'q') === 0) {
        $responses[$key] = $value;
    }
}

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

// Count correct, incorrect, and unattempted
$correct = count(array_filter($responses, fn($val) => $val === 't'));
$incorrect = count(array_filter($responses, fn($val) => $val === 'f'));
$unattempted = count(array_filter($responses, fn($val) => $val === 'n'));

$attempted = $correct + $incorrect;
$accuracy = $attempted > 0 ? ($correct / $attempted) * 100 : 0;
$percentage = ($score / $total) * 100;
$percentile = round(50 + ($score / $total) * 50); // Dummy percentile logic

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Result | Xamly</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background: #f4f4f9;
            text-align: center;
            margin: 0;
            padding: 20px;
        }

        .result-container {
            max-width: 600px;
            margin: auto;
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0px 0px 20px rgba(106, 17, 203, 0.3);
            text-align: center;
        }

        h2 {
            color: #6a11cb;
            font-size: 1.8rem;
            margin-bottom: 10px;
        }

        .score-box {
            font-size: 2rem;
            font-weight: bold;
            color: white;
            background: linear-gradient(45deg, #6a11cb, #ff00ff);
            padding: 15px;
            border-radius: 12px;
            margin-bottom: 20px;
            box-shadow: 0px 0px 15px rgba(106, 17, 203, 0.6);
        }

        .stats {
            font-size: 1.2rem;
            color: #333;
        }

        .chart-container {
            width: 100%;
            max-width: 300px;
            margin: auto;
        }

        .home-btn, .solution-btn {
            display: inline-block;
            padding: 12px 20px;
            background: linear-gradient(45deg, #6a11cb, #ff00ff);
            color: white;
            font-weight: bold;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            margin-top: 20px;
            cursor: pointer;
            transition: 0.3s;
            margin: 10px;
        }

        .home-btn:hover, .solution-btn:hover {
            background: linear-gradient(45deg, #ff00ff, #6a11cb);
            transform: scale(1.1);
        }

        .question-analysis {
            margin-top: 20px;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 8px;
        }

        .question-item {
            width: 40px;
            height: 40px;
            line-height: 40px;
            border-radius: 50%;
            font-size: 14px;
            font-weight: bold;
            color: white;
            text-align: center;
            transition: 0.3s;
        }

        .correct { background: #28a745; }
        .incorrect { background: #dc3545; }
        .unattempted { background: #6c757d; }

        @media (max-width: 600px) {
            .result-container {
                width: 90%;
                padding: 20px;
            }
        }
    </style>
</head>
<body>

    <div class="result-container">
        <h2>Test Completed! 🎉</h2>
        <div class="score-box">Your Score: <?php echo $score . " / " . $total; ?></div>

        <div class="stats">
            <p><b>Percentage:</b> <?php echo round($percentage, 2); ?>%</p>
            <p><b>Estimated Percentile:</b> <?php echo $percentile; ?>%</p>
            <p><b>Accuracy:</b> <?php echo round($accuracy, 2); ?>%</p>
        </div>

        <div class="chart-container">
            <canvas id="scoreChart"></canvas>
        </div>

        <h3>📊 Question Analysis</h3>
        <div class="question-analysis">
            <?php
            $qNumber = 1;
            foreach ($responses as $response) {
                $class = $response === 't' ? 'correct' : ($response === 'f' ? 'incorrect' : 'unattempted');
                echo "<div class='question-item $class'>Q$qNumber</div>";
                $qNumber++;
            }
            ?>
        </div>

        <button class="home-btn" onclick="window.location.href='../src/index.php'">🏠 Home</button>
        <button class="solution-btn" onclick="window.location.href='../src/solution.php?id=<?php echo $testID; ?>'">📖 View Solutions</button>
    </div>

    <script>
        const data = {
            labels: ["Correct", "Incorrect", "Unattempted"],
            datasets: [{
                data: [<?php echo $correct; ?>, <?php echo $incorrect; ?>, <?php echo $unattempted; ?>],
                backgroundColor: ["#28a745", "#dc3545", "#6c757d"],
                hoverBackgroundColor: ["#218838", "#c82333", "#5a6268"]
            }]
        };

        const config = {
            type: "doughnut",
            data: data,
            options: {
                responsive: true,
                animation: {
                    animateScale: true,
                    animateRotate: true
                },
                plugins: {
                    legend: { display: true, position: "bottom" }
                }
            }
        };

        new Chart(document.getElementById("scoreChart"), config);
    </script>

</body>
</html>
