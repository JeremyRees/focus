
$(document).ready(function() {
    var blockMessages = [
        'You know better.',
        'You made the rules, I\'m just enforcing them.',
        'Not so fast.',
        'The cat videos can probably wait, no?',
        'Just think of all the willpower you\'re building.',
        'Is your to-do list clear yet?'
    ];
    $('#blocked h4').html(blockMessages[Math.floor(Math.random()*blockMessages.length)]);

    $('#backToWork').click(function() {
        window.history.go(-2);
    });
});
