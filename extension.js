
const { showCricketMatchPanel } =require( './controllers/getCricketMatch');

const { showCricketSeriesPanel, } = require('./controllers/getCricketSeries');
const { showCurrentCricketMatchesPanel, } = require('./controllers/getCurrentMatch');
const {getLoadingMessage}=require('./global/loadingMessage')
const vscode = require('vscode');
const path = require('path');
const axios = require('axios');

let apiPanel; // Declare panel variable for API data
let newsPanel; // Declare panel variable for news data
let transferNewsData; // Variable to store transfer news data

// Define matchResultsData variable
let matchResultsData;


let persistentPanel; // Declare panel variable for persistent panel

// Function to create a persistent panel that never gets closed
function createPersistentPanel(context) {
    if (!persistentPanel) {
        persistentPanel = vscode.window.createWebviewPanel(
            'persistentPanel',
            'Football and Cricket Updates',
            vscode.ViewColumn.One, // You can adjust the view column as needed
            {
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))],
                enableCommandUris: true,
                enableFindWidget: true,
                allowScripts: true,
                sandbox: {
                    allowScripts: true,
                    allowForm: true
                }
            }
        );

        // Set the HTML content for the persistent panel
        persistentPanel.webview.html = `
            <html>
            <head>
                <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    background: url('https://a1.espncdn.com/combiner/i?img=%2Fphoto%2F2023%2F0325%2Fr1149798_1296x729_16%2D9.jpg') no-repeat center center fixed;
                    background-size: cover;
                    margin: 0;
                    padding: 20px;
                    color: #fff; /* Set text color to white */
                }
                h2 {
                    color: #fff; /* Set heading color to white */
                    font-size: 24px;
                    margin-bottom: 20px;
                    text-align: center; /* Center align the heading */
                }
                .container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .panel-item {
                    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background for the panel item */
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                    margin-bottom: 20px;
                    width: 300px; /* Adjust width as needed */
                    max-width: 80%; /* Set max width to 80% of the container */
                    text-align: center; /* Center align the panel item content */
                }
                .panel-item p {
                    margin: 10px 0; /* Add some margin to the paragraphs */
                    color: #fff; /* Set paragraph text color to white */
                    font-size: 16px; /* Set paragraph font size */
                    line-height: 1.6; /* Set line height for better readability */
                    text-align: center; /* Align the text to the left */

                }
                .panel-item p:nth-child(even) {
                    color: #00bcd4; /* Dark text color for odd-numbered paragraphs */
                }
        
                .panel-item p:nth-child(even) {
                    color: #FF0000; /* Lighter text color for even-numbered paragraphs */
                }
                .panel-item a {
                    color: #007acc;
                    text-decoration: none;
                }
                .panel-item a:hover {
                    text-decoration: underline;
                }
                .scrolling-text {
                    position: absolute; /* Position the scrolling text absolutely */
                    left: 100%; /* Start off the screen */
                    white-space: nowrap; /* Prevent text from wrapping */
                    animation: scrollRight 10s linear infinite; /* Apply animation */
                }
                @keyframes scrollRight {
                    from {
                        left: 100%; /* Start off the screen */
                    }
                    to {
                        left: -100%; /* Move all the way to the left */
                    }
                
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="panel-item">
                <p class="scrolling-text">Please : In order to keep the extension active, do not close this window; otherwise, a reload will be required.</p>
                
                <h2>Use Ctrl+ and Shift+P</h2>
                <p>Command: Get transfer updates</p>
                <p>Command: Get football news</p>
                <p>Command:Get transfer updates </p>
                <p>Command: Get live cricket</p>
                <p>Command:Get current match </p>
                <p>Command:Get upcoming series</p>
                <h3>Don't forget to give a review Click <a href="https://marketplace.visualstudio.com/items?itemName=addy.mytodo&ssr=false#review-details">here</a> ⭐.</h2>
                        
                    </div>
                    <div class="panel-item">
                        <h2>Football Updates</h2>
                        <p>Click <a href="command:mytodo.openTransferNewsPanel">here</a> for transfer updates.</p>
                        <p>Click <a href="command:mytodo.openLiveScore">here</a> for live score.</p>
                        <p>Click <a href="command:mytodo.openAPIPanel">here</a> for fixtures.</p>
                        <p>Click <a href="command:mytodo.openNewsPanel">here</a> for news.</p>
                        <h3>Don't forget to give a review Click <a href="https://marketplace.visualstudio.com/items?itemName=addy.mytodo&ssr=false#review-details">here</a> ⭐.</h2>
                        </div>
                    <div class="panel-item">
                        <h2>Cricket Updates</h2>
                        <p>Click <a href="command:mytodo.openCricketMatch">here</a> for current matches.</p>
                        <p>Click <a href="command:mytodo.openCricketMatchPanel">here</a> for live scores.</p>
                        <p>Click <a href="command:mytodo.openCricketSeriesPanel">here</a> for upcoming series.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
}


async function fetchMatchResultsData() {
    const options = {
        method: 'GET',
        url: 'https://football-api-20s.onrender.com/players/results'
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


// Function to display match results in webview
function displayMatchResults(animate = false) {
    if (apiPanel && matchResultsData) {
        const matchResultsHTML = matchResultsData.map(match => `
            <div class="match-item">
                <h3>${match.team1} vs ${match.team2}</h3>
                <p><strong>Result:</strong> ${match.result}</p>
                <p><strong>Date:</strong> ${match.date}</p>
            </div>
        `).join('');

        apiPanel.webview.html = `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif;

                    }
                    .match-item { margin-bottom: 20px; }
                    .match-item h3 { margin-bottom: 5px; }
                    .match-item p { margin: 5px 0; }
                    ${animate ? '.match-item { animation: fadein 2s; }' : ''}
                    @keyframes fadein {
                        from { opacity: 0; }
                        to   { opacity: 1; }
                    }
                </style>
            </head>
            <body>
                <h2>Match Results</h2>
                ${matchResultsHTML}
            </body>
            </html>
        `;
    }
}

// Function to show match results panel
function showMatchResultsPanel(context) {
    if (!apiPanel) {
        apiPanel = vscode.window.createWebviewPanel(
            'matchResults',
            'Match Results',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))],
                enableCommandUris: true,
                enableFindWidget: true,
                allowScripts: true,
                sandbox: {
                    allowScripts: true,
                    allowForm: true
                }
            }
        );
        apiPanel.onDidDispose(() => {
            apiPanel = null;
        }, null, context.subscriptions);
    }

    // Display loading message initially with animation
    apiPanel.webview.html = getLoadingMessage(true);

    // Fetch data from API and display it with animation
    fetchMatchResultsData().then(data => {
        if (data) {
            // If data is received, display it in the webview with animation
            matchResultsData = data;
            displayMatchResults(true);
        } else {
            // If no data is received, display a message
            apiPanel.webview.html = '<p>No match results available</p>';
        }
    }).catch(error => {
        console.error('Error fetching match results data:', error);
        vscode.window.showErrorMessage('Error fetching match results data');
    });
}


function showTransferNewsPanel(context) {
    if (!newsPanel) {
        newsPanel = vscode.window.createWebviewPanel(
            'transferNewsData',
            'Transfer News Data',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))],
                enableCommandUris: true,
                enableFindWidget: true,
                allowScripts: true,
                sandbox: {
                    allowScripts: true,
                    allowForm: true
                }
            }
        );
    }

    // Display loading message initially with animation
    newsPanel.webview.html = getLoadingMessage(true);

    // If transfer news data is not fetched yet, fetch it
    if (!transferNewsData) {
        fetchTransferNewsData().then(newsData => {
            transferNewsData = newsData;
            displayTransferNews();
        }).catch(error => {
            console.error('Error fetching transfer news data:', error);
            vscode.window.showErrorMessage('Error fetching transfer news data');
        });
    } else {
        // If transfer news data is already fetched, display it with animation
        displayTransferNews(true);
    }
}

// Function to display loading message
// Function to display loading message with football icon animation



// Function to fetch transfer news data
async function fetchTransferNewsData() {
    const options = {
        method: 'GET',
        url: 'https://football_api12.p.rapidapi.com/players/transfers',
        headers: {
            'X-RapidAPI-Key': '82387cf1damsh116d052c22df5efp141526jsn6bf172d5abe0',
            'X-RapidAPI-Host': 'football_api12.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Function to display transfer news in webview
function displayTransferNews(animate = false) {
    if (newsPanel && transferNewsData) {
        const transferNewsHTML = transferNewsData.map(news => `
            <div class="news-item">
                <h3>${news.title}</h3>
                <p class="source">Source: ${news.source}</p>
                <a href="${news.url}" target="_blank">Read more</a>
            </div>
        `).join('');

        newsPanel.webview.html = `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .news-item { margin-bottom: 20px; }
                    .news-item h3 { margin-bottom: 5px; }
                    .news-item .source { font-size: 12px; color: #666; }
                    .news-item a { color: #007acc; text-decoration: none; }
                    .news-item a:hover { text-decoration: underline; }
                    ${animate ? '.news-item { animation: fadein 2s; }' : ''}
                    @keyframes fadein {
                        from { opacity: 0; }
                        to   { opacity: 1; }
                    }
                </style>
            </head>
            <body>
                <h2>Transfer News</h2>
                ${transferNewsHTML}
            </body>
            </html>
        `;
    }
}

// Function to show API data panel
function showAPIPanel(context) {
    if (!apiPanel) {
        apiPanel = vscode.window.createWebviewPanel(
            'apiData',
            `Today's Fixtures`,
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))],
                enableCommandUris: true,
                enableFindWidget: true,
                allowScripts: true,
                sandbox: {
                    allowScripts: true,
                    allowFor: true
                },
                iconPath: vscode.Uri.file(path.join(context.extensionPath, 'media', 'football.png')) // Provide the path to your icon file

            }
        );
    }

    // Display loading message initially with animation
    apiPanel.webview.html = getLoadingMessage(true);

    // Fetch data from API and display it with animation
    fetchDataFromAPI().then(data => {
        if (data) {
            // If data is received, display it in the webview with animation
            apiPanel.webview.html = getAPIWebviewContent(data, true);
        } else {
            // If no data is received, display a message
            apiPanel.webview.html = '<p>No data available</p>';
        }
    }).catch(error => {
        console.error('Error fetching data from API:', error);
        vscode.window.showErrorMessage('Error fetching data from API');
    });
}

// Function to fetch data from API
async function fetchDataFromAPI() {
    const options = {
        method: 'GET',
        url: 'https://football_api12.p.rapidapi.com/players/fixtures',
        headers: {
            'X-RapidAPI-Key': '82387cf1damsh116d052c22df5efp141526jsn6bf172d5abe0',
            'X-RapidAPI-Host': 'football_api12.p.rapidapi.com'
        }
    };
    
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Function to generate HTML content for API data
function getAPIWebviewContent(data, animate = false) {
    if (!data || data.length === 0) {
        return '<p>No data available</p>';
    }
    const fixturesHTML = data.map(fixture => `
        <div class="fixture">
            <p><strong>Team A:</strong> ${fixture.teamA}</p>
            <p><strong>Team B:</strong> ${fixture.teamB}</p>
            <p><strong>Time:</strong> ${fixture.timing}</p>
            <p><strong>MatchOver:</strong> ${fixture.scoreA}</p>
            <p><strong>Day:</strong> ${fixture.scoreB}</p>
        </div>
    `).join('');

    return `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; }
                .fixture { border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; }
                .fixture p { margin: 5px 0; }
                .fixture strong { font-weight: bold; }
                ${animate ? '.fixture { animation: fadein 2s; }' : ''}
                @keyframes fadein {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
            </style>
        </head>
        <body>
            <h2>Today's Fixtures</h2>
            <h3>Fixture</h3>
            ${fixturesHTML}
        </body>
        </html>
    `;
}
function showLiveScore(context) {
    if (!apiPanel) {
        apiPanel = vscode.window.createWebviewPanel(
            'apiData',
            `Live Score`,
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))],
                enableCommandUris: true,
                enableFindWidget: true,
                allowScripts: true,
                sandbox: {
                    allowScripts: true,
                    allowFor: true
                },
                iconPath: vscode.Uri.file(path.join(context.extensionPath, 'media', 'football.png')) // Provide the path to your icon file

            }
        );
    }

    // Display loading message initially with animation
    apiPanel.webview.html = getLoadingMessage(true);

    // Fetch data from API and display it with animation
    fetchDataForLiveScore().then(data => {
        if (data) {
            // If data is received, display it in the webview with animation
            apiPanel.webview.html = getAPIWebviewContent1(data, true);
        } else {
            // If no data is received, display a message
            apiPanel.webview.html = '<p>No data available</p>';
        }
    }).catch(error => {
        console.error('Error fetching data from API:', error);
        vscode.window.showErrorMessage('Error fetching data from API');
    });
}

async function fetchDataForLiveScore() {
    const options = {
        method: 'GET',
        url: 'https://football_api12.p.rapidapi.com/players/livescore',
        headers: {
            'X-RapidAPI-Key': '82387cf1damsh116d052c22df5efp141526jsn6bf172d5abe0',
            'X-RapidAPI-Host': 'football_api12.p.rapidapi.com'
        }
    };
    
    try {
        const response = await axios.request(options);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
function getAPIWebviewContent1(data, animate = false) {
    if (!data || data.length === 0) {
        return '<p>No data available</p>';
    }
    const liveScoreHTML = data.map(fixture => `
        <div class="fixture">
            <p><strong>Team A:</strong> ${fixture.teamA}</p>
            <p><strong>Team B:</strong> ${fixture.teamB}</p>
            <p><strong>Score for Team A:</strong> ${fixture.scoreA}</p>
            <p><strong>Score for Team A:</strong> ${fixture.scoreB}</p>
            <p><strong>Time in GMT:</strong> ${fixture.timing}</p>
        </div>
    `).join('');

    return `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; }
                .fixture { border: 1px solid #ccc; padding: 10px; margin-bottom: 10px; }
                .fixture p { margin: 5px 0; }
                .fixture strong { font-weight: bold; }
                ${animate ? '.fixture { animation: fadein 2s; }' : ''}
                @keyframes fadein {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
            </style>
        </head>
        <body>
            <h2>lIVE sCORE</h2>
            <h3>Fixture</h3>
            ${liveScoreHTML}
        </body>
        </html>
    `;
}

// Function to show news panel
function showNewsPanel(context) {
    if (!newsPanel) {
        newsPanel = vscode.window.createWebviewPanel(
            'newsData',
            'News Data',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))],
                enableCommandUris: true,
                enableFindWidget: true,
                allowScripts: true,
                sandbox: {
                    allowScripts: true,
                    allowForm: true
                },
                iconPath: vscode.Uri.parse('https://pngbuy.com/wp-content/uploads/2023/01/Cristiano-Ronaldo-PNGBUY-5.jpg') // Specify the link for the icon

            }
        );
    }

    // Display loading message initially with animation
    newsPanel.webview.html = getLoadingMessage(true);

    // Fetch news data and display it with animation
    fetchDataFromNewsAPI().then(newsData => {
        if (newsData) {
            // If data is received, display it in the webview with animation
            newsPanel.webview.html = getNewsWebviewContent(newsData, true);
        } else {
            // If no data is received, display a message
            newsPanel.webview.html = '<p>No news available</p>';
        }
    }).catch(error => {
        console.error('Error fetching news data:', error);
        vscode.window.showErrorMessage('Error fetching news data');
    });
}

// Function to fetch data from news API
async function fetchDataFromNewsAPI() {
    const options = {
        method: 'GET',
        url: 'https://football_api12.p.rapidapi.com/players/news',
        headers: {
            'X-RapidAPI-Key': '82387cf1damsh116d052c22df5efp141526jsn6bf172d5abe0',
            'X-RapidAPI-Host': 'football_api12.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Function to generate HTML content for news data
function getNewsWebviewContent(newsData, animate = false) {
    if (!newsData || newsData.length === 0) {
        return '<p>No news available</p>';
    }
    const newsHTML = newsData.map(news => `
        <div class="news-item">
            <h3>${news.headLine}</h3>
            <p class="source">Source: ${news.source}</p>
            <a href="${news.url}" target="_blank">Read more</a>
        </div>
    `).join('');

    return `
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; }
                .news-item { margin-bottom: 20px; }
                .news-item h3 { margin-bottom: 5px; }
                .news-item .source { font-size: 12px; color: #666; }
                .news-item a { color: #007acc; text-decoration: none; }
                .news-item a:hover { text-decoration: underline; }
                ${animate ? '.news-item { animation: fadein 2s; }' : ''}
                @keyframes fadein {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
            </style>
        </head>
        <body>
            <h2>News Data</h2>
            ${newsHTML}
        </body>
        </html>
    `;
}

// Activate function
// Activate function
function activate(context) {
    console.log('Congratulations, your extension "mytodo" is now active!');
    createPersistentPanel(context);

    // Register commands and their handlers
    let disposable = vscode.commands.registerCommand('mytodo.helloWorld', function () {
        vscode.window.showInformationMessage('Hello World from mytodo!');
    });

 
    
    context.subscriptions.push(vscode.commands.registerCommand('mytodo.openAPIPanel', () => {
        // Open API data panel
        showAPIPanel(context);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('mytodo.openLiveScore', () => {
        // Open API data panel
        showLiveScore(context);
    }));
    
    context.subscriptions.push(vscode.commands.registerCommand('mytodo.openNewsPanel', () => {
        // Open news data panel
        showNewsPanel(context);
    }));
    
  
    
    context.subscriptions.push(vscode.commands.registerCommand('mytodo.openTransferNewsPanel', () => {
        // Open transfer news data panel
        showTransferNewsPanel(context);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('mytodo.openMatchResultsPanel', () => {
        // Open match results panel
        showMatchResultsPanel(context);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('mytodo.openCricketMatchPanel', () => {
        // Open cricket match data panel
        showCricketMatchPanel(context);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('mytodo.openCricketMatch', () => {
        // Open current cricket matches panel
        showCurrentCricketMatchesPanel(context);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('mytodo.openCricketSeriesPanel', () => {
        // Open cricket series panel
        showCricketSeriesPanel(context);
    }));
}

// Deactivate function
function deactivate() {}

module.exports = {
    activate,
    deactivate
};






// Deactivate function
function deactivate() {
}

module.exports = {
    activate,
    deactivate
};
