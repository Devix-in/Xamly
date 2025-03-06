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
});
document.addEventListener("DOMContentLoaded", function () {
    AOS.init(); // Initialize AOS Animations

    // Load Leaderboard Data
    fetch("../data/leaderboard.json")
        .then(response => response.json())
        .then(data => {
            let leaderboardList = document.querySelector(".leaderboard-list");
            leaderboardList.innerHTML = ""; // Clear previous data
            data.top_scorers.forEach((player, index) => {
                let listItem = `
                    <li class="leaderboard-item">
                        <span class="rank">#${index + 1}</span>
                        <span class="name">${player.name}</span>
                        <span class="score">${player.score} pts</span>
                    </li>`;
                leaderboardList.innerHTML += listItem;
            });
        });
});
