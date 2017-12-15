/**
 * @file
 * Pulling in an SVG sprite with AJAX.
 *
 * See https://css-tricks.com/ajaxing-svg-sprite/
 */

(function(window, document, undefined) {
    "use strict";

    var themeUrl = window.apSettings.themeUrl;
    var spritePath = "built/gulp-out/graphics/svg-sprite";
    var spriteFileName = "svg-sprite.symbol-mode.svg";
    var requestUrl = themeUrl + "/" + spritePath + "/" + spriteFileName;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", requestUrl, true);
    xhr.send();
    xhr.onloadend = function(event) {
        if (xhr.status === 200) {
            var div = document.createElement("div");
            div.id = "svg-sprite-housing";
            div.innerHTML = xhr.responseText;
            document.body.insertBefore(div, document.body.childNodes[0]);
        }
        else {
            console.log("Icon sprite not found...");
        }
    };

})(this, this.document);
