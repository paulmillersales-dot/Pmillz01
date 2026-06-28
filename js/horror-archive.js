let allGames = [];
let currentFilter = "all";


const list = document.getElementById("horror-list");
const buttons = document.querySelectorAll("[data-filter]");
const searchInput = document.getElementById("horror-search");
const statsBox = document.getElementById("archive-stats");

fetch("data/horror-games.json?cache=" + Date.now())
  .then(response => response.json())
  .then(data => {
    allGames = data.games || [];
    updateStats();
    applyFilters();
  })
  .catch(error => {
    console.error("Horror archive failed:", error);
    list.innerHTML = "<p>Unable to access horror archive.</p>";
  });

buttons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    buttons.forEach(btn => btn.classList.remove("primary"));
    button.classList.add("primary");

    applyFilters();
  });
});

searchInput.addEventListener("input", applyFilters);

function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase();

  let filtered = allGames.filter(game => {
    const phantom = game.phantom || {};
    const tags = game.steamTags || [];

    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm) ||
      tags.join(" ").toLowerCase().includes(searchTerm);

    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "streamed" && phantom.streamed) ||
      phantom.status === currentFilter;

    return matchesSearch && matchesFilter;
  });

  displayGames(filtered);
}

function updateStats() {
  const owned = allGames.filter(g => g.phantom?.owned).length;
  const streamed = allGames.filter(g => g.phantom?.streamed).length;
  const completed = allGames.filter(g => g.phantom?.completed).length;

  statsBox.innerHTML = `
    <strong>${allGames.length}</strong> files recovered •
    <strong>${owned}</strong> owned •
    <strong>${streamed}</strong> streamed •
    <strong>${completed}</strong> completed
  `;
}

function displayGames(games) {
  if (!games.length) {
    list.innerHTML = "<p>No matching records found.</p>";
    return;
  }

  list.innerHTML = "";

  games.forEach(game => {
    const phantom = game.phantom || {};
    const tags = game.steamTags || [];

    const card = document.createElement("div");
    card.className = "card horror-file";

    card.innerHTML = `
      <p class="eyebrow">CASE FILE #${game.appid}</p>
      <h3>🎮 ${game.title}</h3>

      <p><strong>Status:</strong> ${(phantom.status || "unplayed").toUpperCase()}</p>
      <p><strong>Owned:</strong> ${phantom.owned ? "✅ Yes" : "❌ No"}</p>
      <p><strong>Streamed:</strong> ${phantom.streamed ? "✅ Yes" : "❌ No"}</p>
      <p><strong>Completed:</strong> ${phantom.completed ? "✅ Yes" : "❌ No"}</p>
      <p><strong>Scare Rating:</strong> ${phantom.scareRating || "Unrated"}</p>

      <p><strong>Classification:</strong> ${tags.join(", ") || "Unknown"}</p>
      <p>${phantom.notes || "No field notes recorded."}</p>

      <a class="btn primary" href="game.html?appid=${game.appid}">Open Case File</a>
      <a class="btn" href="${game.steamUrl}" target="_blank">Steam</a>
    `;

    list.appendChild(card);
  });
}
