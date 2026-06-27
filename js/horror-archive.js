alert("Horror archive JS is loading");

let allGames = [];

const list = document.getElementById("horror-list");
const buttons = document.querySelectorAll("[data-filter]");


fetch("data/horror-games.json?cache=" + Date.now())
  .then(response => response.json())
  .then(data => {
    allGames = data.games || [];
    displayGames(allGames);
  })
  .catch(error => {
    console.error("Horror archive failed:", error);
    list.innerHTML = "<p>Unable to access horror archive.</p>";
  });

buttons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    console.log("Clicked filter:", filter);

    buttons.forEach(btn => btn.classList.remove("primary"));
    button.classList.add("primary");

    filterGames(filter);
  });
});

function displayGames(games) {
  if (!games.length) {
    list.innerHTML = "<p>No records found.</p>";
    return;
  }

  list.innerHTML = "";

  games.forEach(game => {
    const phantom = game.phantom || {};

    const card = document.createElement("div");
    card.className = "card horror-file";

    card.innerHTML = `
      <h3>🎮 ${game.title}</h3>
      <p><strong>Steam Tags:</strong> ${(game.steamTags || []).join(", ")}</p>
      <p><strong>Owned:</strong> ${phantom.owned ? "✅ Yes" : "❌ No"}</p>
      <p><strong>Status:</strong> ${phantom.status || "unplayed"}</p>
      <p><strong>Streamed:</strong> ${phantom.streamed ? "✅ Yes" : "❌ No"}</p>
      <p><strong>Completed:</strong> ${phantom.completed ? "✅ Yes" : "❌ No"}</p>
      <p><strong>Scare Rating:</strong> ${phantom.scareRating || "Unrated"}</p>
      <p>${phantom.notes || "No field notes recorded."}</p>
      <a class="btn" href="${game.steamUrl}" target="_blank">View on Steam</a>
    `;

    list.appendChild(card);
  });
}

function filterGames(filter) {
  if (filter === "all") {
    displayGames(allGames);
    return;
  }

  if (filter === "streamed") {
    displayGames(allGames.filter(game => game.phantom?.streamed));
    return;
  }

  displayGames(allGames.filter(game => game.phantom?.status === filter));
}
