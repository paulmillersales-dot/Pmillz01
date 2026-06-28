const params = new URLSearchParams(window.location.search);
const appid = params.get("appid");

const hero = document.getElementById("game-file");
const main = document.getElementById("game-main");

if (!appid) {
  hero.innerHTML = `
    <p class="eyebrow">ACCESS DENIED</p>
    <h1>No Case File Selected</h1>
    <p class="tagline">No appid was provided.</p>
  `;
} else {
  loadGame();
}

async function loadGame() {
  try {
    const response = await fetch("data/horror-games.json?cache=" + Date.now());
    const data = await response.json();

    const game = data.games.find(g => String(g.appid) === String(appid));

    if (!game) {
      hero.innerHTML = `
        <p class="eyebrow">FILE NOT FOUND</p>
        <h1>Unknown Case File</h1>
        <p class="tagline">No archive record exists for AppID ${appid}.</p>
      `;
      return;
    }

    renderGame(game);
  } catch (error) {
    hero.innerHTML = `
      <p class="eyebrow">ARCHIVE ERROR</p>
      <h1>Unable To Access File</h1>
      <p class="tagline">The Phantom Archive refused the connection.</p>
    `;
  }
}

function renderGame(game) {
  const steam = game.steam || {};
  const phantom = game.phantom || {};

  document.title = `${game.title} | Phantom Archive`;

  hero.innerHTML = `
    <p class="eyebrow">CASE FILE #${game.appid}</p>
    <h1>${game.title}</h1>
    <p class="tagline">${(game.steamTags || []).join(" • ") || "Unclassified Horror Media"}</p>

    <div class="buttons">
      <a class="btn primary" href="${game.steamUrl}" target="_blank">View on Steam</a>
      <a class="btn" href="horror-archive.html">Back to Archive</a>
    </div>
  `;

  main.innerHTML = `
    <section class="section dark-box game-dossier">

      ${steam.headerImage ? `
        <img class="game-header-image" src="${steam.headerImage}" alt="${game.title}">
      ` : ""}

      <h2>Steam Record</h2>

      <p><strong>Release Date:</strong> ${steam.releaseDate || "Unknown"}</p>
      <p><strong>Developer:</strong> ${(steam.developers || []).join(", ") || "Unknown"}</p>
      <p><strong>Publisher:</strong> ${(steam.publishers || []).join(", ") || "Unknown"}</p>
      <p><strong>Price:</strong> ${steam.price || "Unknown"}</p>
      <p><strong>Recommendations:</strong> ${steam.recommendations || 0}</p>
      <p><strong>Genres:</strong> ${(steam.genres || []).join(", ") || "Unknown"}</p>
      <p><strong>Categories:</strong> ${(steam.categories || []).join(", ") || "Unknown"}</p>

      <p class="small">${steam.shortDescription || "No Steam description available."}</p>
    </section>

    <section class="section dark-box">
      <h2>Phantom Assessment</h2>

      <p><strong>Owned:</strong> ${phantom.owned ? "✅ Yes" : "❌ No"}</p>
      <p><strong>Status:</strong> ${(phantom.status || "unplayed").toUpperCase()}</p>
      <p><strong>Streamed:</strong> ${phantom.streamed ? "✅ Yes" : "❌ No"}</p>
      <p><strong>Completed:</strong> ${phantom.completed ? "✅ Yes" : "❌ No"}</p>
      <p><strong>Times Streamed:</strong> ${phantom.timesStreamed || 0}</p>
      <p><strong>Scare Rating:</strong> ${phantom.scareRating || "Unrated"}</p>
      <p><strong>Personal Rating:</strong> ${phantom.rating10 || "Unrated"}</p>
      <p><strong>Recommended:</strong> ${phantom.recommended ? "✅ Yes" : "❌ Not yet"}</p>
    </section>

    <section class="section">
      <h2>Field Notes</h2>
      <p>${phantom.notes || "No field notes recorded."}</p>

      <div class="buttons">
        ${phantom.bestClip ? `<a class="btn" href="${phantom.bestClip}" target="_blank">Best Clip</a>` : ""}
        ${phantom.vod ? `<a class="btn" href="${phantom.vod}" target="_blank">Twitch VOD</a>` : ""}
        ${phantom.youtube ? `<a class="btn" href="${phantom.youtube}" target="_blank">YouTube Video</a>` : ""}
      </div>
    </section>
  `;
}
