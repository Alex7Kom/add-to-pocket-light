var isObtainingBookmarklet = false;
var obtainingFrom;

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: 'addToPocket'
    });
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'obtainingBookmarklet') {
    isObtainingBookmarklet = true;
    obtainingFrom = request.from;
    
    return sendResponse();
  }
  if (request.action === 'notObtainingBookmarklet') {
    isObtainingBookmarklet = false;

    return sendResponse({
      result: obtainingFrom
    });
  }
  if (request.action === 'isObtainingBookmarklet') {
    return sendResponse({
      result: isObtainingBookmarklet
    });
  }
  if (request.action === 'isScheduledForAdd') {
    return sendResponse({
      result: request.page === obtainingFrom
    });
  }
  if (request.action === 'getBookmarklet') {
    chrome.storage.sync.get(function (items) {
      sendResponse({
        result: items.bookmarklet
      });
    });

    return true;
  }
  if (request.action === 'saveBookmarklet') {
    return chrome.storage.sync.set({
      bookmarklet: request.bookmarklet
    }, function () {
      sendResponse();
    });

    return true;
  }
});
