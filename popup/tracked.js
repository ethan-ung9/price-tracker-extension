// tracked.js
function renderTracked(tracked) {
    const list = document.getElementById("list");
    list.innerHTML = "";
  
    const urls = Object.keys(tracked).sort();
    if (urls.length === 0) {
      list.innerHTML = "<li>No tracked products yet.</li>";
      return;
    }
  
    urls.forEach(url => {
      const item = tracked[url];
      const li = document.createElement("li");
      li.className = "tracked-item";
  
      const name = item.name || url;
      const price = item.price ?? "—";
      const ts = item.lastChecked ? new Date(item.lastChecked).toLocaleString() : "—";
  
      li.innerHTML = `
        <div class="row">
          <div class="col name"><strong>${name}</strong></div>
          <div class="col price">${price}</div>
        </div>
        <div class="row meta">
          <a href="${url}" target="_blank">${url}</a>
          <span class="checked">Checked: ${ts}</span>
          <button data-url="${url}" class="remove-btn">Remove</button>
        </div>
      `;
      list.appendChild(li);
    });
  
    // wire remove buttons
    list.querySelectorAll(".remove-btn").forEach(btn => {
      btn.addEventListener("click", async (e) => {
        const url = e.target.dataset.url;
        const data = await chrome.storage.local.get({ tracked: {} });
        const trackedMap = data.tracked || {};
        delete trackedMap[url];
        await chrome.storage.local.set({ tracked: trackedMap });
        renderTracked(trackedMap);
      });
    });
  }
  
  async function loadAndRender() {
    const data = await chrome.storage.local.get({ tracked: {} });
    const tracked = data.tracked || {};
    renderTracked(tracked);
  }
  
  document.getElementById("refresh-btn").addEventListener("click", loadAndRender);
  document.getElementById("clear-btn").addEventListener("click", async () => {
    await chrome.storage.local.set({ tracked: {} });
    loadAndRender();
  });
  
  // initial load
  loadAndRender();