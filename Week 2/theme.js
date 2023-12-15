// theme-toggle.js

document.getElementById('toggleTheme').addEventListener('click', function() {
    const themeStylesheet = document.getElementById('themeStylesheet');
    
    // Check the current theme and toggle to the opposite theme
    if (themeStylesheet.getAttribute('href') === 'style_light.css') {
        themeStylesheet.setAttribute('href', 'style_dark.css');
    } else {
        themeStylesheet.setAttribute('href', 'style_light.css');
    }
});
