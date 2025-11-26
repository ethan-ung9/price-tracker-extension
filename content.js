// content.js
// naive price extractor (improve for different sites as needed)
function extractPrice() {
    // look for currency patterns in page text
    const priceRegex = /(?:\$|£|€)\s?[\d,]+(?:\.\d{2})?/g;
    const matches = Array.from(document.body.innerText.matchAll(priceRegex)).map(m => m[0]);
    if (matches.length === 0) return null;
    // choose shortest match (often most precise)
    matches.sort((a,b) => a.length - b.length);
    return matches[0];
  }
  
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg && msg.action === "getPrice") {
      const price = extractPrice();
      sendResponse({ price });
    }
  });