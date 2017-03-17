var bookmarklet;
var bookmarkletPage = 'https://getpocket.com/add';
var loginPage = 'https://getpocket.com/login?url=/add';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (sender.tab) {
    return;
  }

  if (request.action == 'addToPocket') {
    addToPocket();
  }
});

function addToPocket () {
  if (bookmarklet) {
    runBookmarklet();
  } else {
    getBookmarklet(runBookmarklet);
  }
}

function runBookmarklet () {
  eval(bookmarklet);
}

function getBookmarklet (callback) {
  chrome.runtime.sendMessage({
    action: 'getBookmarklet'
  }, function (response) {
    if (response.result) {
      bookmarklet = response.result;
      return callback();
    }

    obtainBookmarklet();
  });
}

function obtainBookmarklet () {
  chrome.runtime.sendMessage({
    action: 'obtainingBookmarklet',
    from: document.location.href
  }, function () {
    document.location.href = bookmarkletPage;
  });
}

if (document.location.href === bookmarkletPage) {
  chrome.runtime.sendMessage({
    action: 'isObtainingBookmarklet'
  }, function (response) {
    if (!response.result) {
      return;
    }

    var bm = document.getElementsByClassName('bookmarklet-dragbtn')[0].children[0].href;

    if (bm === bookmarkletPage + '#') {
      document.location.href = loginPage;

      return;
    }

    chrome.runtime.sendMessage({
      action: 'saveBookmarklet',
      bookmarklet: bm.replace('javascript:', '')
    }, function () {
      chrome.runtime.sendMessage({
        action: 'notObtainingBookmarklet'
      }, function (response) {
        document.location.href = response.result;
      });
    });
  });
} else {
  chrome.runtime.sendMessage({
    action: 'isScheduledForAdd',
    page: document.location.href
  }, function (response) {
    if (response.result) {
      addToPocket();
    }
  });
}
