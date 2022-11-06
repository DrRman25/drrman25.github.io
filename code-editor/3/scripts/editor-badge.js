(() => {
    'use strict';

    /**
    Set a color theme for the badge, depending on the 'data-drrcraft-theme' attribute of the current script, or select a default blue theme if no theme attribute is specified.
    */
    const colorThemes = {
        dark: {foreground: '#f5f9fc', background: '#130f26'},
        light: {foreground: '#130f26', background: '#f5f9fc'},
        red: {foreground: '#f5f9fc', background: '#fa4b4b'},
        orange: {foreground: '#f5f9fc', background: '#d96d00'},
        yellow: {foreground: '#f5f9fc', background: '#a68a00'},
        lime: {foreground: '#f5f9fc', background: '#639400'},
        green: {foreground: '#f5f9fc', background: '#00a11b'},
        teal: {foreground: '#f5f9fc', background: '#0093b0'},
        blue: {foreground: '#f5f9fc', background: '#0f87ff'},
        blurple: {foreground: '#f5f9fc', background: '#8e78ff'},
        purple: {foreground: '#f5f9fc', background: '#b266ff'},
        magenta: {foreground: '#f5f9fc', background: '#eb3beb'},
        pink: {foreground: '#f5f9fc', background: '#f545ba'}
    };
    const theme = colorThemes[(document.currentScript.hasAttribute('data-drrcraft-theme') && colorThemes.hasOwnProperty(document.currentScript.getAttribute('data-drrcraft-theme'))) ? document.currentScript.getAttribute('data-drrcraft-theme') : 'blue'];

    /**
    Create the badge based on the theme attribute, and insert the badge into the document.
    */
    const badge = `
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto+Mono:700" />
<style>
    #drrcraft-code-editor-badge-lg {
        display: none;
    }

    @media screen and (min-width: 576px) {
        #drrcraft-code-editor-badge {
            display: none;
        }

        #drrcraft-code-editor-badge-lg {
            display: inline;
        }
    }

    #drrcraft-code-editor-badge, #drrcraft-code-editor-badge-lg {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        z-index: 2147483647;
        opacity: 0.5;
        transition: opacity 120ms, transform 120ms;
        transition-timing-function: ease-out;
        font-family: 'Roboto Mono', monospace;
        font-weight: 700;
        user-select: none;
        -webkit-user-select: none; /* Safari */
    }

    #drrcraft-code-editor-badge:hover, #drrcraft-code-editor-badge-lg:hover {
        transform: scale(1.05);
        opacity: 1;
    }
</style>
<svg id="drrcraft-code-editor-badge-lg" xmlns="http://www.w3.org/2000/svg" width="360" height="35">
    <g filter="url('#drrcraft-code-editor-badge-lg-filter0')">
        <rect x="1" y="1" width="354" height="30" rx="8" fill="${theme.background}" />
    </g>
    <image href="https://drrman25.github.io/code-editor/3/style/logo-foreground-${(theme.foreground === '#130f26') ? 'light' : 'dark'}.svg" x="4" y="-8" width="50" height="50" />
    <text x="60" y="22" fill="${theme.foreground}">Made with DrRcraft Code Editor</text>
    <defs>
        <filter id="drrcraft-code-editor-badge-lg-filter0" x="0" y="0" width="360" height="35" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dx="2" dy="2" />
            <feGaussianBlur stdDeviation="1.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="drrcraft-code-editor-badge-lg-effect0-dropShadow" />
            <feBlend mode="normal" in="SourceGraphic" in2="drrcraft-code-editor-badge-lg-effect0-dropShadow" result="shape" />
        </filter>
    </defs>
</svg>
<svg id="drrcraft-code-editor-badge" xmlns="http://www.w3.org/2000/svg" width="58" height="35">
    <g filter="url('#drrcraft-code-editor-badge-filter0')">
        <rect x="1" y="1" width="52" height="30" rx="8" fill="${theme.background}" />
    </g>
    <image href="${location.origin}/code-editor/3/style/logo-foreground-${(theme.foreground === '#130f26') ? 'light' : 'dark'}.svg" x="4" y="-8" width="50" height="50" />
    <defs>
        <filter id="drrcraft-code-editor-badge-filter0" x="0" y="0" width="58" height="35" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
            <feOffset dx="2" dy="2" />
            <feGaussianBlur stdDeviation="1.5" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
            <feBlend mode="normal" in2="BackgroundImageFix" result="drrcraft-code-editor-badge-effect0-dropShadow" />
            <feBlend mode="normal" in="SourceGraphic" in2="drrcraft-code-editor-badge-effect0-dropShadow" result="shape" />
        </filter>
    </defs>
</svg>`;
    document.body.insertAdjacentHTML('beforeend', badge);
})();
