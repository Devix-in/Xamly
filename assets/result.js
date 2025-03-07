// Get URL Parameters
const urlParams = new URLSearchParams(window.location.search);
const score = parseInt(urlParams.get("score")) || 0;
const total = parseInt(urlParams.get("total")) || 1;
const responses = [];

// ✅ Extract Responses
urlParams.forEach((value, key) => {
    if (key.startsWith("q")) responses.push(value);
});

// ✅ Correct Score Calculation
const correct = responses.filter(res => res === "t").length;
const incorrect = responses.filter(res => res === "f").length;
const unattempted = responses.filter(res => res === "n").length;

const attempted = correct + incorrect;
const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
const percentage = (score / total) * 100;
const percentile = Math.round(50 + (score / total) * 50);

// ✅ Update HTML Elements
document.querySelector(".score-box").innerText = `Your Score: ${score} / ${total}`;
document.querySelector(".stats").innerHTML = `
    <p><b>Percentage:</b> ${percentage.toFixed(2)}%</p>
    <p><b>Estimated Percentile:</b> ${percentile}%</p>
    <p><b>Accuracy:</b> ${accuracy.toFixed(2)}%</p>
`;

// ✅ Fix Question Analysis Display
const questionAnalysis = document.querySelector(".question-analysis");
questionAnalysis.innerHTML = "";
responses.forEach((res, index) => {
    let className = res === "t" ? "correct" : res === "f" ? "incorrect" : "unattempted";
    questionAnalysis.innerHTML += `<div class="question-item ${className}">Q${index + 1}</div>`;
});

// ✅ Generate Chart
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
