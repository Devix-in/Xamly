<?php
// Load test series from JSON
$tests_json = file_get_contents("data/tests.json");
$tests = json_decode($tests_json, true);

// Load leaderboard data
$leaderboard_json = file_get_contents("data/leaderboard.json");
$leaderboard = json_decode($leaderboard_json, true);
$top_scorers = isset($leaderboard['top_scorers']) ? $leaderboard['top_scorers'] : [];
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XAMLY - The Ultimate Test Platform</title>
    <link rel="stylesheet" href="assets/styles.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
</head>
<body>

    <!-- HEADER -->
    <header>
        <h1 class="glowing-title">XAMLY 🚀</h1>
        <p class="tagline">The Ultimate Test Experience Awaits You!</p>
    </header>

    <!-- TEST SERIES SECTION -->
    <section class="test-container">
        <?php foreach ($tests['test_series'] as $test) : ?>
            <div class="test-card">
                <h2><?php echo $test['title']; ?></h2>
                <p><?php echo $test['description']; ?></p>
                <div class="test-info">
                    ⏳ Timer: <?php echo $test['time_limit']; ?> mins | 📋 Questions: <?php echo count($test['questions']); ?>
                </div>
                <a href="test.php?id=<?php echo $test['id']; ?>" class="attempt-btn">Attempt</a>
            </div>
        <?php endforeach; ?>
    </section>

    <!-- LEADERBOARD SECTION -->
    <section class="leaderboard">
        <h2>🏆 Top Scorers</h2>
        <?php if (!empty($top_scorers)) { ?>
            <div class="leaderboard-container">
                <ul class="leaderboard-list">
                    <?php foreach ($top_scorers as $index => $scorer) { ?>
                        <li class="leaderboard-item">
                            <span class="rank">#<?php echo $index + 1; ?></span>
                            <span class="name"><?php echo htmlspecialchars($scorer['name']); ?></span>
                            <span class="score"><?php echo htmlspecialchars($scorer['score']); ?> pts</span>
                        </li>
                    <?php } ?>
                </ul>
            </div>
        <?php } else { ?>
            <p class="no-data">No leaderboard data available.</p>
        <?php } ?>
    </section>

    <script src="../assets/scripts.js"></script>
</body>
</html>
