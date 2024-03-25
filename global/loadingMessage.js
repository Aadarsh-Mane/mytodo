function getLoadingMessage(animate = false) {
    const animationClass = animate ? 'loading-animation' : '';
    return `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; }
                .loading { text-align: center; margin-top: 50px; font-size: 20px; }
                .${animationClass} { animation: rotate 2s linear infinite; }
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            </style>
        </head>
        <body>
            <div class="loading ${animationClass}">
                <img src="https://i.ibb.co/hc2gHsJ/Pi7-Tool-football-removebg-preview.png" alt="Football Icon" width="100px" height="100px">
            </div>
        </body>
        </html>
    `;
}

module.exports ={
    getLoadingMessage
}