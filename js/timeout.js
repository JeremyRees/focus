$(document).ready(function() {
    $('#back-to-work').click(function() {
        window.close();
    });

    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function() {
        window.history.pushState(null, "", window.location.href);
    };
});
