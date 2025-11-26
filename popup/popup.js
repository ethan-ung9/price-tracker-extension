// popup.js
document.addEventListener("DOMContentLoaded", () => {
    const trackBtn = document.getElementById("track-btn");
    const viewBtn = document.getElementById("view-btn");
    const status = document.getElementById("status");
  
    trackBtn.addEventListener("click", async () => {
      status.textContent = "Tracking...";
      // get active tab and send its url + id to background
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab) {
        status.textContent = "No active tab found.";
        return;
      }
  
      // optional: ask user for a friendly name (simplest prompt)
      const name = prompt("Friendly name for this product (optional):", "");
  
      chrome.runtime.sendMessage({ action: "track", url: tab.url, tabId: tab.id, name }, (resp) => {
        if (resp && resp.ok) {
          status.textContent = `Tracked — price: ${resp.price}`;
        } else {
          status.textContent = "Tracking failed.";
        }
      });
    });
  
    viewBtn.addEventListener("click", () => {
      // open local extension page to display tracked items
      chrome.tabs.create({ url: chrome.runtime.getURL("popup/tracked.html") });
    });
  });