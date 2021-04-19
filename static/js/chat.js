// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
  };

var base_url = window.location.origin;

// Firebase
firebase.initializeApp(firebaseConfig);

var queryString = window.location.search;
console.log(queryString)
if (queryString != "") {
    var paramsUser = new URLSearchParams(queryString).get("user");
    paramsRoom = "1";
    // Assign value 
    $("#user").val(paramsUser);

    // Config
    $("#messageList").html("");
    $(".chat-input").show();
    
    messageFetch(paramsUser,paramsRoom);
}

//# FILTER
$(document).on("change", "#user", function () {
    var sender = $("#user").val();
    location.href = `?user=${sender}`;
});


//# SEND MESSAGE
$("#message").on("keyup", function () {
    const value = $(this).val();
    console.log(value);
    
    value != "" ?
        $("#buttonSend").prop("disabled", false) :
        $("#buttonSend").prop("disabled", true);
})