document.querySelector(".authButton").addEventListener("click", function() {
    window.location.href = window.location.pathname + "/oauth2/callback";
});
