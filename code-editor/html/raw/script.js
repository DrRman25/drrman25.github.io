var textareaCode = document.getElementById("textareaCode");
var submitButton = document.getElementById("submitCode");
var iframeContainer = document.getElementsByClassName("result")[0];
submitButton.onclick = submitTryit;

if (location.search == "?dark=1") {
    var darkModeCSS = document.createElement("link");
    darkModeCSS.setAttribute("rel", "stylesheet");
    darkModeCSS.setAttribute("href", "dark-style.css");
    document.getElementsByTagName("head")[0].appendChild(darkModeCSS);
}

textareaCode.value =
    "<!DOCTYPE html>\n" +
    "<html>\n" +
    "<head>\n" +
    "<title>Page Title</title>\n" +
    "</head>\n" +
    "<body>\n\n" +
    "<h1>This is a Heading</h1>\n" +
    "<p>This is a paragraph.</p>\n\n" +
    "</body>\n" +
    "</html>\n";
submitTryit();

function submitTryit() {
    var text = textareaCode.value;
    var ifr = document.createElement("iframe");
    iframeContainer.innerHTML = "Result:<br/>";
    iframeContainer.appendChild(ifr);
    var ifrw = ifr.contentWindow || ifr.contentDocument;
    ifrw.document.open();
    ifrw.document.write(text + "\n\n<!-- Code injected by editor -->\n<script>\nconsole.error('Uncaught ReferenceError: adngin is not defined\\n\\tat uic_r_p (uic.js?v=1.0.5:1:57456)\\n\\tat HTMLButtonElement.onclick (index.html:443)');\n</script>");
    ifrw.document.close();
}