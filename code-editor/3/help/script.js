if (!localStorage.getItem("site-theme")) {
    localStorage.setItem("site-theme", "light");
}

document.body.setAttribute("theme", localStorage.getItem("site-theme"));