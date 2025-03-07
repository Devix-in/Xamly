document.addEventListener("DOMContentLoaded", function () {
    // ✅ GSAP Animations
    gsap.from(".test-card", {
        duration: 1.5,
        opacity: 0,
        y: 30,
        stagger: 0.2,
        ease: "power2.out",
    });

    gsap.from(".glowing-title", {
        duration: 1.5,
        scale: 0.8,
        opacity: 0,
        ease: "elastic.out(1, 0.4)",
    });

    // ✅ Load Test Series Data Securely
    fetch("data/tests.json")
        .then(response => response.json())
        .then(data => {
            let testContainer = document.getElementById("test-list");
            testContainer.innerHTML = ""; // Clear previous data

            data.test_series.forEach(test => {
                let testCard = `
                    <div class="test-card">
                        <h2>${test.title}</h2>
                        <p>${test.description}</p>
                        <div class="test-info">
                            ⏳ Timer: ${test.time_limit} mins | 📋 Questions: ${test.questions.length}
                        </div>
                        <button class="attempt-btn" onclick="startTest('${test.id}')">Attempt</button>
                    </div>
                `;
                testContainer.innerHTML += testCard;
            });
        });

    // ✅ Load Leaderboard Data
    fetch("data/leaderboard.json")
        .then(response => response.json())
        .then(data => {
            let leaderboardList = document.querySelector(".leaderboard-list");
            leaderboardList.innerHTML = ""; // Clear previous data

            data.top_scorers.forEach((player, index) => {
                let rankClass = index === 0 ? "rank-1" : index === 1 ? "rank-2" : index === 2 ? "rank-3" : "rank-other";

                let listItem = `
                    <li class="leaderboard-item ${rankClass}">
                        <span class="rank">#${index + 1}</span>
                        <span class="name">${player.name}</span>
                        <span class="score">${player.score} pts</span>
                    </li>`;
                leaderboardList.innerHTML += listItem;
            });
        });
});

// ✅ Secure Start Test Function (No URL Parameters)
function startTest(testID) {
    sessionStorage.setItem("selectedTestID", testID);
    window.location.href = "test.html"; // ✅ No ID in URL
}
