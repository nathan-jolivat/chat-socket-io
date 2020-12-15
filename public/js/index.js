let selectedUsername = "";

$(document).ready(function() {
    $('#sendMessageButton').hide();
});

$(function () {
    let socket = io();

    $('#submitName').click(function() {
        selectedUsername = $('#usernameInput').val();
        $('#sendMessageButton').show();
    });

    $('form').submit(function(){

        if (selectedUsername === "") {
            $('#u').val("Invité");
        } else {
            $('#u').val(selectedUsername);
        }


        socket.emit('chat message',  $('#u').val(), $('#m').val(), $('#pic').val());

        $('#u').val('');
        $('#m').val('');
        $('#pic').val('');
        $('#m').focus();
        return false;
    });
    socket.on('chat message', function(username, msg, pic) {

        $('<div class="message"> \
                <div class="icon"><img src=https://eu.ui-avatars.com/api/?name='+ username +'></div> \
                <div class="body"><div class="username">' + username + '</div> \
                <div class="content">' + msg + '</div></div> \
                </div>'
        ) .appendTo('#messages');

        window.scrollTo(0, document.body.scrollHeight);
    });
});