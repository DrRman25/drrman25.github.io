/**
Automatically resize all the inputs after typing.
*/
document.querySelectorAll("input").forEach(input => {
    input.style.width = `${0.35 + (0.603125 * input.value.length)}em`;
    if (input.value === "") {
        input.style.width = `${0.35 + (0.603125 * input.placeholder.length)}em`;
    }
    input.addEventListener("input", () => {
        input.style.width = `${0.35 + (0.603125 * input.value.length)}em`;
        if (input.value === "") {
            input.style.width = `${0.35 + (0.603125 * input.placeholder.length)}em`;
        }
    })
});

/**
When the 'Copy' button next to the clone command is clicked, copy the command.
*/
document.getElementById("clone-copy").addEventListener("click", () => {
    const array = `CLONE "${document.getElementById("clone-command-1").value || "old program"}" "${document.getElementById("clone-command-2").value || "new program"}"`;
    alert(array);
});
