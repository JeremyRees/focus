var focusState, toggleFocus, blockPages, warnPages, timePages, addSite, removeSite;

$(document).ready(function() {
    chrome.runtime.getBackgroundPage(function(bkg) {
        focusState = bkg.focusing;
        toggleFocus = bkg.toggleFocusMode;
        blockPages = bkg.blockPages;
        warnPages = bkg.warnPages;
        timePages = bkg.timePages;
        addSite = bkg.addSite;
        removeSite = bkg.removeSite;

        documentReady();
    });
});

function documentReady() {
    if (focusState) {
        $('.toggle-button').removeClass('inactive');
    }

    var quotes = [
        ['Lack of direction, not lack of time, is the problem. We all have twenty-four hour days.', 'Zig Ziglar'],
        ['Lack of direction, not lack of time, is the problem. We all have twenty-four hour days.', 'Zig Ziglar'],
        ['Lack of direction, not lack of time, is the problem. We all have twenty-four hour days.', 'Zig Ziglar'],
        ['What you stay focused on will grow.', 'Roy T. Bennett'],
        ['Focusing is about saying No.', 'Steve Jobs'],
        ['Focusing is about saying No.', 'Steve Jobs'],
        ['Simplicity is ultimately a matter of focus.', 'Ann Voskamp'],
        ['The time that leads to mastery is dependent on the intensity of our focus.', 'Robert Greene'],
        ['Be on guard. The road widens, and many of the detours are seductive.', 'David Foster Wallace'],
        ['Be on guard. The road widens, and many of the detours are seductive.', 'David Foster Wallace'],
        ['Be on guard. The road widens, and many of the detours are seductive.', 'David Foster Wallace'],
        ['Be on guard. The road widens, and many of the detours are seductive.', 'David Foster Wallace'],
        ['Deciding what not to do is as important as deciding what to do.', 'Steve Jobs'],
        ['Deciding what not to do is as important as deciding what to do.', 'Steve Jobs'],
        ['The bad news is time flies. The good news is you\'re the pilot.', 'Michael Altshuler'],
        ['The bad news is time flies. The good news is you\'re the pilot.', 'Michael Altshuler'],
        ['Time is the most valuable coin in your life. Be careful that you do not let other people spend it for you.', 'Carl Sandburg'],
        ['Procrastination is the foundation of all disasters.', 'Pandora Poikilos'],
        ['One always has time enough, if one will apply it well.', 'Johann Wolfgang von Goethe'],
        ['One always has time enough, if one will apply it well.', 'Johann Wolfgang von Goethe'],
        ['The secret of all greatness is knowing what to do with time.', 'Sunday Adelaja'],
        ['Time is what we want most, but what we use worst.', 'William Penn']
    ];
    var quote = quotes[Math.floor(Math.random()*quotes.length)];
    var quoteHtml = '<div class="row pt-3"><div class="col-3"></div><div class="col-6 text-center"><h4>'+quote[0]+'</h4></div></div>'+
                    '<div class="row pb-5"><div class="col-6"></div><div class="col-3 text-center">&mdash;'+quote[1]+'</div></div>';
    $('.toggle-button').parent().after(quoteHtml);

    ['block', 'warn', 'time'].forEach(function(lev) {
        window[lev+'Pages'].forEach(function(page) {
            let html = '<tr><td>'+page+'<button class="remove-button btn btn-danger ml-3" site="'+page+'" level="'+lev+'">X</button></td></tr>';
            $('#column-'+lev).find('.columnTail').before(html);
        });
    });

    var urlQueryParams = getUrlVars();
    if ('b' in urlQueryParams && parseInt(urlQueryParams['b']) == 1) {
        var blockMessages = [
            'You know better.',
            'You made the rules, I\'m just enforcing them.',
            'Not so fast.',
            'The cat videos can probably wait, no?',
            'Just think of all the willpower you\'re building.',
            'Is your to-do list clear yet?'
        ];
        var blockMessage = blockMessages[Math.floor(Math.random()*blockMessages.length)];

        blockHtml = '<div class="row pt-5"><div class="col col-3"></div><div id="blocked" class="col col-6"><h4>'+blockMessage+'</h4></div></div>';
        $('.toggle-button').parent().before(blockHtml);
    }

    $('.toggle-button').click(function() {
        $(this).toggleClass('inactive');
        toggleFocus();
    });

    $('.add-button').click(function() {
        addSiteHelper($(this).attr('level'));
    });

    $('#sitesGrid').on('click', '.remove-button', function() {
        var success = removeSite($(this).attr('site'), $(this).attr('level'));
        if (success) {
            $(this).parent().parent().remove();
        }
    });
}

function addSiteHelper(level) {
    var success = addSite($('#'+level+'Input').val(), level);
    if (success) {
        var siteListHtml = '<tr><td>'+$('#'+level+'Input').val()+'<button class="remove-button btn btn-danger ml-3" site="'+$('#'+level+'Input').val()+'" level="'+level+'">X</button></td></tr>';
        $('#column-'+level).find('.columnTail').before(siteListHtml);
        $('#'+level+'Input').val('');
    }
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
