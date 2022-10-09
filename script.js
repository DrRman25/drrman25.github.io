function createRipple(e) {
    const button = e.currentTarget;
    const rippleBackgroundColor = button.getAttribute('data-accent-color');
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - (button.offsetLeft + radius)}px`;
    circle.style.top = `${e.clientY - (button.offsetTop + radius)}px`;
    circle.style.backgroundColor = `${rippleBackgroundColor}40`;
    circle.classList.add('ripple');
    const ripples = button.getElementsByClassName('ripple');
    for (const ripple of ripples) {
        ripple.remove();
    }
    button.appendChild(circle);
    setTimeout(() => {
        circle.style.animationPlayState = 'paused';
    }, 500);
}

function removeRipple(e) {
    const button = e.currentTarget;
    const ripples = button.getElementsByClassName('ripple');
    for (const ripple of ripples) {
        ripple.style.opacity = 0;
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

const buttons = document.querySelectorAll('button.btn-ripple, a.btn-ripple');
for (const button of buttons) {
    button.addEventListener('mousedown', createRipple);
    // For additional testing: button.addEventListener('click', e => e.preventDefault());
    button.addEventListener('mouseup', removeRipple);
    button.addEventListener('mouseleave', removeRipple);
    button.style.color = button.getAttribute('data-accent-color');
}
