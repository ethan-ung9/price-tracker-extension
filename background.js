// background.js
// Maintains a "tracked" object in chrome.storage: { "<url>": { price: "...", name: "...", lastChecked: 12345 } }

function nowTs() { return Date.now(); }

// helper to save tracked map
async function saveTracked(tracked) {
  return chrome.storage.local.set({ tracked });
}

// helper to get current tracked map
async function getTracked() {
  const data = await chrome.storage.local.get({ tracked: {} });
  return data.tracked || {};
}

// send desktop notification
function notify(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon48.png",
    title,
    message
  });
}

// when popup asks to track a URL; popup sends { action: 'track', url, tabId, name? }
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg || msg.action !== "track") return;

  const { url, tabId, name } = msg;

  // ask the content script in the tab to extract price
  if (typeof tabId === "number") {
    chrome.tabs.sendMessage(tabId, { action: "getPrice" }, async (resp) => {
      const price = resp?.price || "Not found";
      const tracked = await getTracked();
      tracked[url] = { price, name: name || "", lastChecked: nowTs() };
      await saveTracked(tracked);
      // optional notification
      notify("Tracking started", `${name || url} → ${price}`);
      sendResponse({ ok: true, price });
    });
    // indicate async response
    return true;
  } else {
    // fallback: no tabId — just save with placeholder
    (async () => {
      const tracked = await getTracked();
      tracked[url] = { price: "Unknown", name: name || "", lastChecked: nowTs() };
      await saveTracked(tracked);
      sendResponse({ ok: true, price: "Unknown" });
    })();
    return true;
  }
});