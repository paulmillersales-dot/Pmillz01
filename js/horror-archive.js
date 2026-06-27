let allGames = [];

const list = document.getElementById("horror-list");
const buttons = document.querySelectorAll(".horror-filters button");

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
    const card = document.createElement("div");
    card.className = "card horror-file";

    card.innerHTML = `
      <h3>🎮 ${game.title}</h3>
      <p><strong>Platform:</strong> ${game.platform}</p>
      <p><strong>Status:</strong> ${game.status}</p>
      <p><strong>Streamed:</strong> ${game.streamed ? "Yes" : "No"}</p>
      <p><strong>Scare Rating:</strong> ${game.scareRating}</p>
      <p><strong>Tags:</strong> ${game.tags.join(", ")}</p>
      <p>${game.notes}</p>
    `;

    list.appendChild(card);
  });
}

function filterGames(filter) {
  if (filter === "all") {
    displayGames(allGames);
  } else if (filter === "streamed") {
    displayGames(allGames.filter(game => game.streamed === true));
  } else {
    displayGames(allGames.filter(game => game.status.toLowerCase() === filter));
  }
}
