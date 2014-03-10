function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)",
        regex = new RegExp(regexS),
        results = regex.exec(window.location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(function() {
    var pixels = $(".x"),
        length = pixels.length,
        path = getParameterByName("aspxerrorpath");

    console.log(path);

    if (path !== "")
        $("#destination").text(path).addClass("marked");

    setTimeout(function() {
        setInterval(function() {
            var pixel = pixels.eq(Math.floor(Math.random() * length));
            pixel.addClass("hidden");

            setTimeout(function() {
                pixel.removeClass("hidden");
            }, 700);
        }, 100);
    }, 2000);
})
