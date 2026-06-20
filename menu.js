function loadMenu() {
  const isInEntitiesFolder = window.location.pathname.includes('/entities/');
  const prefix = isInEntitiesFolder ? '../' : '';

 document.getElementById('site-menu').innerHTML = `
  <label for="menu-check" class="close-menu">×</label>

  <div class="menu-heading">MAIN</div>
  <a href="${prefix}index.html">🏠 Home</a>
  <a href="${prefix}about.html">👤 About</a>
  <a href="${prefix}watch.html">📺 Live</a>
  <a href="${prefix}community.html">👻 Community</a>
  <a href="${prefix}content.html">🎥 Content</a>
  <a href="${prefix}contact.html">📞 Contact</a>
  <a href="${prefix}phantom-forge.html">🛠️ Forge</a>

  <div class="menu-heading">PHANTOM REALM</div>
  <a href="${prefix}entity-database.html">📁 Database</a>
  <a href="${prefix}entity-archive.html">📜 Archive</a>
  <a href="${prefix}incident-timeline.html">📰 Timeline</a>
  <a href="${prefix}research-division.html">🧪 Research</a>
  <a href="${prefix}containment-command.html">🛡️ Containment</a>
  <a href="${prefix}redacted-documents.html">📁 Documents</a>
  <a href="${prefix}entity-hunt.html">🔦 Hunt</a>
  <a href="${prefix}hall-of-fame.html">🏆 Records</a>

  <div class="menu-heading">MEDU</div>
  <a href="${prefix}department-of-anomalous-quacktivity.html">🦆 Quacktivity</a>
  <a href="${prefix}authority-structure.html">🏛️ Authority</a>
  <a href="${prefix}personnel-directory.html">📁 Personnel</a>
  <a href="${prefix}annual-report.html">📊 Report</a>
  <a href="${prefix}incident-reports.html">📄 Incidents</a>
  <a href="${prefix}employee-recognition.html">🏅 Awards</a>

  <div class="menu-heading">EXTERNAL</div>
  <a href="https://www.twitch.tv/pmillz01">🎮 Twitch</a>
`;
}

loadMenu();

highlightCurrentPage();

function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop();

    document.querySelectorAll('#site-menu a').forEach(link => {
        const href = link.getAttribute('href');

        if (href && href.endsWith(currentPage)) {
            link.classList.add('active');
        }
    });

    if (window.location.pathname.includes('/entities/')) {
        document
            .querySelector('a[href*="entity-database"]')
            ?.classList.add('active');
    }
}
