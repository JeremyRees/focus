var warnPages, confirmSite;

$(document).ready(function() {
    chrome.runtime.getBackgroundPage(function(bkg) {
        confirmSite = bkg.confirmSite;

        documentReady();
    });
});

function documentReady() {
    $('#nevermind').click(function() {
        window.history.go(-2);
    });

    $('#confirm').click(function() {
        var urlQueryParams = getUrlVars();
        confirmSite({tabId:urlQueryParams['id'], listEntry:urlQueryParams['q']});
        window.history.go(-1);
    });
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
