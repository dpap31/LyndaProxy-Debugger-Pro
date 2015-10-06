// This background script listens for a visit to the Admin Portal Page
function checkForValidUrl(tabId, changeInfo, tab) {
  if (tab.url.indexOf('https://admin.lynda.com/admin/portalsetup.aspx') == 0) {
    chrome.pageAction.show(tabId);
  }
};
chrome.tabs.onUpdated.addListener(checkForValidUrl);
