function animateMessageFetch () {
    $('.chat-list').animate({scrollTop: $('#messageList')[0].scrollHeight}, 0)
}

function removeAvatar (type) {
    $(`.${type} + .${type}`).css(`padding-${type === 'in' ? 'left' : 'right'}`, '40px').find('.chat-list__item__avatar').remove();
}

function loading (value) {
    value ? $("#messageList").append("<div class='loading'>loading</div>") : $("#messageList").find(".loading").remove();
}

function emptyMessage () {
    $("#messageList").append("<div class='empty'>Belum adan pesan.</div>");
}

function clearMessage () {
    $("#messageList").find(".empty").remove();
}

function sendMessage() {
    var roomId = "1";
    var sender = $("#user").val();
    var message = $("#message").val();

    // Save in Database
    $.ajax({
        type: "POST",
        url: `/send_message`,
        data: {
          "room_id": roomId,
          "sender": sender,
          "message": message
        },
        dataType: "JSON",
        success: function (response) {
            $("#message").val("");
            $("#buttonSend").prop("disabled", true);
        },
        error: function (response) {
          alert("Terjadi kesalahan")
        },
    });
    return false;
}


// Fetch data message for first load
function messageFetch(sender, room) {
    loading(true);
    firebase.database().ref(`messages/room-${room}`).once("value", function (snapshot) {
        var exists = snapshot.exists();
        if(exists) {
            var index = 1;
            var dataLength = snapshot.numChildren();
            snapshot.forEach((snap) => {
                var html = "";
                var data = snap.val();
                var avatar = data.sender === "User 1" ? 1 : 2;
                if (data.room_id === room && index < dataLength) {
                    html += `<div class='chat-list__item ${data.sender == sender ? 'self' : 'in'}'><div class='chat-list__item__avatar'><img src="https://i.pravatar.cc/100?img=${avatar}"/></div> <div class='chat-list__item__message'>${data.message} <span class='chat-list__item__time'>${data.sended_time.slice(0,5)}</span></div></div>`;
                    document.getElementById("messageList").innerHTML += html;

                    index++;
                }
            });
                
            removeAvatar('in');
            removeAvatar('self');
            loading(false);
            animateMessageFetch();
            messageListen(paramsUser, paramsRoom);
        } else {
            loading(false);
            emptyMessage()
            messageListen(paramsUser, paramsRoom);
        }
    });
}

// Listen Inconming Message
function messageListen(sender, room) {
    firebase.database().ref(`messages/room-${room}`).limitToLast(1).on("child_added", function (snapshot) {
        var html = "";
        var data = snapshot.val();
        var avatar = data.sender === "User 1" ? 1 : data.sender === "User 2" ? 2 : 3;
        if (data.room_id === room) {
            html += `<div class='chat-list__item is-last ${data.sender == sender ? 'self' : 'in'}'><div class='chat-list__item__avatar'><img src="https://i.pravatar.cc/100?img=${avatar}"/></div> <div class='chat-list__item__message'>${data.message} <span class='chat-list__item__time'>${data.sended_time.slice(0,5)}</span></div></div>`;
            document.getElementById("messageList").innerHTML += html;
        }

        clearMessage();
        removeAvatar('in');
        removeAvatar('self');
        animateMessageFetch();
    });
}