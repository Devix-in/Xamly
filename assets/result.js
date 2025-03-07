// ✅ Fetch data from sessionStorage instead of URL
const testID = sessionStorage.getItem("testID");
const score = parseFloat(sessionStorage.getItem("score")) || 0;
const total = parseInt(sessionStorage.getItem("total")) || 1;
const responses = JSON.parse(sessionStorage.getItem("responses")) || [];

// ✅ Correct Score Calculation with 1/3rd Negative Marking
const correct = responses.filter(res => res === "t").length;
const incorrect = responses.filter(res => res === "f").length;
const unattempted = responses.filter(res => res === "n").length;

const attempted = correct + incorrect;
const penalty = incorrect * (1 / 3); // ❌ Apply 1/3rd Negative Marking
const finalScore = Math.max(0, correct - penalty); // ✅ Ensure Score is not Negative

const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
const percentage = (finalScore / total) * 100;
const percentile = Math.round(50 + (finalScore / total) * 50);

// ✅ Update HTML Elements
document.querySelector(".score-box").innerText = `Your Score: ${finalScore.toFixed(2)} / ${total}`;
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

// ✅ Generate Char
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

// ✅ Clear sessionStorage after test completion (optional)
setTimeout(() => sessionStorage.clear(), 5000);
