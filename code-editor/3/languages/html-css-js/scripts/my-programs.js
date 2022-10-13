if (!localStorage.getItem("code-editor-my-programs")) {
    localStorage.setItem("code-editor-my-programs", "{}");
}

const myPrograms = JSON.parse(localStorage.getItem("code-editor-my-programs"));

export default myPrograms;
