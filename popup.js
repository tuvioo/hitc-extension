async function loadData() {
  const res = await fetch(chrome.runtime.getURL("data.json"));
  const data = await res.json();
  return data;
}

function render(data) {
  document.getElementById("club-name").textContent = data.clubName;

  // Announcements
  const annEl = document.getElementById("announcements");
  annEl.innerHTML = "";
  data.announcements.forEach(a => {
    const div = document.createElement("div");
    div.className = "announcement";
    div.innerHTML = `
      <div class="title">${escapeHtml(a.title)}</div>
      <div class="meta">${escapeHtml(a.date)}</div>
      <div class="body">${escapeHtml(a.body)}</div>
    `;
    annEl.appendChild(div);
  });

  // Events (Only show if there are events)
  const evEl = document.getElementById("events");
  evEl.innerHTML = "";
  if (data.events && data.events.length > 0) {
    data.events.forEach(e => {
      const li = document.createElement("li");
      li.innerHTML = `${escapeHtml(e.name)} <span class="date">${escapeHtml(e.date)}</span> — ${escapeHtml(e.location)}`;
      evEl.appendChild(li);
    });
  } else {
    // Hide the Upcoming Events title if there are no events
    evEl.parentElement.style.display = "none"; 
  }

  // Links
  const linksEl = document.getElementById("links");
  linksEl.innerHTML = "";
  data.links.forEach(l => {
    const a = document.createElement("a");
    a.href = l.url;
    a.target = "_blank";
    a.textContent = l.label;
    linksEl.appendChild(a);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}

(async () => {
  try {
    const fresh = await loadData();
    render(fresh);
    document.getElementById("last-updated").textContent =
      "Updated " + new Date().toLocaleTimeString();
  } catch (err) {
    document.getElementById("club-name").textContent = "Error loading data";
    console.error(err);
  }
})();
