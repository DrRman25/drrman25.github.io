const defaultCodes = {
    "html-css-js": `<!DOCTYPE html>
<html>

<head>
    <title>My Web Site</title>
</head>

<body>
    <h1>My First HTML Page</h1>
    <p>Hello, world!</p>

    <!--
    This below script adds a badge, to show that you are using the DrRcraft Code Editor.
    You can modify the "data-drrcraft-theme" attribute of the script to change the color theme to dark, light, red, orange, yellow, lime, green, teal, blue, blurple, purple, magenta, or pink!
    -->
    <script src="${location.origin}/code-editor/3/scripts/editor-badge.js" defer="true" data-drrcraft-theme="blue"></script>
</body>

</html>
`,
    "javascript": `console.log("Hello, world!");

// This below script adds a badge, to show that you are using the DrRcraft Code Editor.
// You can modify the "data-drrcraft-theme" attribute of the script to change the color theme to dark, light, red, orange, yellow, lime, green, teal, blue, blurple, purple, magenta, or pink!
const badgeScript = document.createElement("script");
badgeScript.src = "${location.origin}/code-editor/3/scripts/editor-badge.js";
badgeScript.defer = true;
badgeScript.setAttribute("data-drrcraft-theme", "blue");
document.body.appendChild(badgeScript);
`,
    "python": `print("Hello, world!")
`,
    "markdown": `# Hello!
This *is* **markdown**!
`
};

export default defaultCodes;
