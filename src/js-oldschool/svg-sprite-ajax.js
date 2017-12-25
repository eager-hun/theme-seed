/**
 * @file
 * Pulling in an SVG sprite with AJAX.
 *
 * See https://css-tricks.com/ajaxing-svg-sprite/
 */

(function(window, document, undefined) {
    "use strict";

    var housing = document.getElementById("svg-sprite-housing");

    if (! housing || ! housing.hasAttribute("data-svg-via-ajax")) {
        console.log("SVG AJAX retires peacefully.");
        return false;
    }

    if (! ("themeUrl" in window.apSettings) || ! ("svgSprites" in window.apSettings)) {
        console.error("SVG AJAX drama: config missing.");
        return false;
    }

    var themeUrl = window.apSettings.themeUrl;
    var svgSpriteRefs = window.apSettings.svgSprites;

    var svgSpriteRef;
    var requestUrl;
    var xhr;

    for (var ref in svgSpriteRefs) {
        if (svgSpriteRefs.hasOwnProperty(ref)) {

            svgSpriteRef = svgSpriteRefs[ref];
            requestUrl = themeUrl + "/" + svgSpriteRef;

            xhr = new XMLHttpRequest();
            xhr.open("GET", requestUrl, true);
            xhr.send();
            xhr.onloadend = function (event) {
                if (xhr.status === 200) {
                    housing.innerHTML = xhr.responseText;
                }
                else {
                    console.error("SVG AJAX drama: Icon sprite not found.");
                }
            };
        }
    }

})(this, this.document);
