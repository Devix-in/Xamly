document.addEventListener("DOMContentLoaded", function () {
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

    // Load Test Series Data
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
                        <a href="test.html?id=${test.id}" class="attempt-btn">Attempt</a>
                    </div>
                `;
                testContainer.innerHTML += testCard;
            });
        });

    // Load Leaderboard Data
    fetch("data/leaderboard.json")
        .then(response => response.json())
        .then(data => {
            let leaderboardList = document.querySelector(".leaderboard-list");
            leaderboardList.innerHTML = ""; // Clear previous data

            data.top_scorers.forEach((player, index) => {
                let rankClass = "";
                if (index === 0) rankClass = "rank-1"; 
                else if (index === 1) rankClass = "rank-2"; 
                else if (index === 2) rankClass = "rank-3"; 
                else rankClass = "rank-other";

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
