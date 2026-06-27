const fs = require("fs");
const path = require("path");

const TAGS = {
  "Psychological Horror": 1721,
  "Horror": 1667,
  "Survival Horror": 3978,
  "Gore": 4345,
  "Violent": 4667,
  "Dark": 4342,
  "Lovecraftian": 7432,
  "Zombies": 1659,
  "VR": 21978,
  "Co-op": 1685
};

const OUTPUT = path.join(__dirname, "data", "horror-games.json");

async function fetchSteamTag(tagName, tagId) {
  const url =
    `https://store.steampowered.com/search/results/` +
    `?query&start=0&count=100&dynamic_data=&sort_by=_ASC` +
    `&tags=${tagId}&snr=1_7_7_230_7&infinite=1`;

  console.log(`Fetching ${tagName}...`);

  const response = await fetch(url);
  const data = await response.json();

  const matches = [...data.results_html.matchAll(/<a href="https:\/\/store\.steampowered\.com\/app\/(\d+)\/([^"]+)"/g)];

  return matches.map(match => ({
    appid: match[1],
    title: decodeURIComponent(match[2])
      .replace(/_/g, " ")
      .replace(/\//g, "")
      .trim(),
    steamUrl: `https://store.steampowered.com/app/${match[1]}/`,
    tags: [tagName],
    status: "unplayed",
    owned: false,
    streamed: false,
    completed: false,
    scareRating: "",
    notes: ""
  }));
}

async function main() {
  const allGames = new Map();

  for (const [tagName, tagId] of Object.entries(TAGS)) {
    const games = await fetchSteamTag(tagName, tagId);

    for (const game of games) {
      if (allGames.has(game.appid)) {
        const existing = allGames.get(game.appid);
        existing.tags = [...new Set([...existing.tags, ...game.tags])];
      } else {
        allGames.set(game.appid, game);
      }
    }
  }

  const finalGames = [...allGames.values()]
    .sort((a, b) => a.title.localeCompare(b.title));

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });

  fs.writeFileSync(
    OUTPUT,
    JSON.stringify({ games: finalGames }, null, 2)
  );

  console.log(`\nDONE.`);
  console.log(`Saved ${finalGames.length} games to data/horror-games.json`);
}

main().catch(error => {
  console.error("Archive update failed:", error);
});
