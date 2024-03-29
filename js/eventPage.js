chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason == 'install') {
        blockPages = ['reddit.com'];
        warnPages = ['youtube.com'];
        timePages = ['facebook.com'];
        focusing = false;
        confirmedThisSession = [];

        chrome.storage.sync.set({
            'focusBlock': blockPages,
            'focusWarn': warnPages,
            'focusTime': timePages,
            'focusStatus': focusing
        });
    }

    if (details.reason == 'update') {
        setBackgroundPageVariables();
    }
});

chrome.runtime.onStartup.addListener(function() {
    setBackgroundPageVariables();
});

function setBackgroundPageVariables() {
    chrome.storage.sync.get(['focusBlock', 'focusWarn', 'focusTime', 'focusStatus'], function(data) {
        blockPages = data.focusBlock;
        warnPages = data.focusWarn;
        timePages = data.focusTime;
        focusing = data.focusStatus;
    });
    confirmedThisSession = [];
}


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status == "complete" && focusing) {
        blockPages.forEach(function(i) {
            if (tab.url.toLowerCase().includes(i.toLowerCase())) {
                chrome.tabs.update(tabId, {url: '../html/blocked.html'});
            }
        });
        warnPages.forEach(function(i) {
            if (tab.url.toLowerCase().includes(i.toLowerCase()) && !tab.url.includes('chrome-extension')) {
                var confirmed = false;
                confirmedThisSession.forEach(function(j) {
                    if (j.listEntry == i) {
                        confirmed = true;
                        return false;
                    }
                });
                if (!confirmed) {
                    chrome.tabs.update(tabId, {url: '../html/confirm.html?q='+i+'&id='+tabId});
                }
            }
        });
        timePages.forEach(function(i) {
            if (tab.url.toLowerCase().includes(i.toLowerCase())) {
                setTimeout(function() {
                    chrome.tabs.get(tabId, function(currentTab) {
                        // Check that the user hasn't left the page or disabled focus mode
                        if (focusing && currentTab.url.toLowerCase().includes(i.toLowerCase())) {
                            chrome.tabs.update(tabId, {url: '../html/timeout.html'});
                        }
                    });
                }, 600000);
            }
        });
    }
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    for (var i = 0; i < confirmedThisSession.length; i++) {
        if (confirmedThisSession[i].tabId == tabId) {
            confirmedThisSession.splice(i, 1);
            break;
        }
    }
});


/////////////////////////
// User control functions
function addSite(siteBaseUrl, level) {
    var arr = null;
    var title = '';
    switch(level) {
        case 'block':
            arr = blockPages;
            title = 'focusBlock';
            break;
        case 'warn':
            arr = warnPages;
            title = 'focusWarn';
            break;
        case 'time':
            arr = timePages;
            title = 'focusTime';
            break;
        default:
            break;
    }
    if (arr.indexOf(siteBaseUrl) > -1) {
        return 0;
    }
    arr.push(siteBaseUrl);

    var submitObj = {};
    submitObj[title] = arr;
    chrome.storage.sync.set(submitObj);
    return 1;
}

function removeSite(siteBaseUrl, level) {
    var arr = null;
    var title = '';
    switch(level) {
        case 'block':
            arr = blockPages;
            title = 'focusBlock';
            break;
        case 'warn':
            arr = warnPages;
            title = 'focusWarn';
            break;
        case 'time':
            arr = timePages;
            title = 'focusTime';
            break;
        default:
            break;
    }
    if (arr.indexOf(siteBaseUrl) == -1) {
        return 0;
    }
    arr.splice(arr.indexOf(siteBaseUrl), 1);

    var submitObj = {};
    submitObj[title] = arr;
    chrome.storage.sync.set(submitObj);
    return 1;
}

function toggleFocusMode() {
    focusing = !focusing;
    chrome.storage.sync.set({'focusStatus':focusing});
    if (focusing) {
        chrome.browserAction.setIcon({path: {
            '128': '../img/focusInverted128.png'
        }});
    } else {
        chrome.browserAction.setIcon({path: {
            '128': '../img/focus128.png'
        }});
    }
}

function confirmSite(confirmedObject) {
    confirmedThisSession.push(confirmedObject);
}

// For keyboard-shortcut toggling
chrome.commands.onCommand.addListener(function(command) {
    switch(command) {
        case 'toggle-focus-mode':
            toggleFocusMode();
            break;
        default:
            break;
    }
});
