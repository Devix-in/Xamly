document.addEventListener("DOMContentLoaded", function () {
    // Dummy Data (Replace with actual values from backend or form input)
    let score = 8;
    let total = 10;
    let correct = 6;
    let incorrect = 2;
    let unattempted = 2;
    
    let attempted = correct + incorrect;
    let accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
    let percentage = (score / total) * 100;
    let percentile = Math.round(50 + (score / total) * 50); // Dummy percentile logic

    // Set values in HTML
    document.getElementById("score").textContent = `${score} / ${total}`;
    document.getElementById("percentage").textContent = percentage.toFixed(2);
    document.getElementById("percentile").textContent = percentile;
    document.getElementById("accuracy").textContent = accuracy.toFixed(2);

    // Chart Data
    const data = {
        labels: ["Correct", "Incorrect", "Unattempted"],
        datasets: [{
            data: [correct, incorrect, unattempted],
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

    // Generate Question Analysis
    let questionAnalysis = document.getElementById("question-analysis");
    let responses = ["t", "f", "t", "t", "n", "f", "t", "n", "t", "f"]; // Dummy Data

    responses.forEach((response, index) => {
        let div = document.createElement("div");
        div.classList.add("question-item");
        div.textContent = "Q" + (index + 1);
        
        if (response === "t") {
            div.classList.add("correct");
        } else if (response === "f") {
            div.classList.add("incorrect");
        } else {
            div.classList.add("unattempted");
        }

        questionAnalysis.appendChild(div);
    });
});
