if (!localStorage.getItem("code-editor-site-theme")) {
    localStorage.setItem("code-editor-site-theme", "light");
}

document.body.setAttribute("theme", localStorage.getItem("code-editor-site-theme"));