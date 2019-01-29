$(document).ready(function() {
    var focusState;
    var toggleFocus;
    chrome.runtime.getBackgroundPage(function(bkg) {
        focusState = bkg.focusing;
        toggleFocus = bkg.toggleFocusMode;

        if (focusState) {
            $('.toggle-button').removeClass('inactive');
        }
    });

    $('.toggle-button').click(function() {
        $(this).toggleClass('inactive');
        toggleFocus();
    });
});
