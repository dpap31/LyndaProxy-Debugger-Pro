// This background script listens for a visit to the LL Proxy Page
function checkForValidUrl(tabId, changeInfo, tab) {
 if (tab.url.indexOf('http://172.18.123.223/test.html') == 0) {
    chrome.pageAction.show(tabId);
  }
};
chrome.tabs.onUpdated.addListener(checkForValidUrl);

