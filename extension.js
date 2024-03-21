const vscode = require('vscode');
const path = require('path');
const axios = require('axios');

let apiPanel; // Declare panel variable for API data
let newsPanel; // Declare panel variable for news data
let transferNewsData; // Variable to store transfer news data

// Function to show transfer news panel
// Define matchResultsData variable
let matchResultsData;
// Function to fetch cricket match data
// Function to fetch current cricket match data
 // Declare panel variable for API data
let currentCricketMatchesData; // Variable to store current cricket matches data
let cricketMatchPanel; // Declare panel variable for current cricket matches data


// Function to fetch current cricket matches data
async function fetchCricketSeriesData() {
    const options = {
        method: 'GET',
        url: 'https://api.cricapi.com/v1/series?apikey=2a2166f8-ac23-4098-90b3-45c315c3d2b3&offset=0'
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Function to display cricket series data in webview
function displayCricketSeriesData(animate = false) {
    if (apiPanel && cricketSeriesData) {
        const cricketSeriesHTML = cricketSeriesData.data.map(series => `
            <div class="series-item">
                <h3>${series.name}</h3>
                <p><strong>Start Date:</strong> ${series.startDate}</p>
                <p><strong>End Date:</strong> ${series.endDate}</p>
                <p><strong>ODI Matches:</strong> ${series.odi}</p>
                <p><strong>T20 Matches:</strong> ${series.t20}</p>
                <p><strong>Test Matches:</strong> ${series.test}</p>
                <p><strong>Total Matches:</strong> ${series.matches}</p>
            </div>
        `).join('');

        apiPanel.webview.html = `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
                    .series-item { margin-bottom: 20px; }
                    .series-item h3 { margin-bottom: 5px; }
                    .series-item p { margin: 5px 0; }
                    ${animate ? '.series-item { animation: fadein 2s; }' : ''}
                    @keyframes fadein {
                        from { opacity: 0; }
                        to   { opacity: 1; }
                    }
                </style>
            </head>
            <body>
                <h2>Cricket Series Data</h2>
                ${cricketSeriesHTML}
            </body>
            </html>
        `;
    }
}

// Function to show cricket series panel
function showCricketSeriesPanel(context) {
    if (!apiPanel) {
        apiPanel = vscode.window.createWebviewPanel(
            'cricketSeriesData',
            'Cricket Series Data',
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
    apiPanel.webview.html = getLoadingMessage(true);

    // Fetch data from API and display it with animation
    fetchCricketSeriesData().then(data => {
        if (data) {
            // If data is received, display it in the webview with animation
            cricketSeriesData = data;
            displayCricketSeriesData(true);
        } else {
            // If no data is received, display a message
            apiPanel.webview.html = '<p>No cricket series data available</p>';
        }
    }).catch(error => {
        console.error('Error fetching cricket series data:', error);
        vscode.window.showErrorMessage('Error fetching cricket series data');
    });
}

async function fetchCurrentCricketMatches() {
    const options = {
        method: 'GET',
        url: 'https://api.cricapi.com/v1/currentMatches?apikey=2a2166f8-ac23-4098-90b3-45c315c3d2b3&offset=0'
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Function to display current cricket matches data in webview
function displayCurrentCricketMatches(animate = false) {
    if (cricketMatchPanel && currentCricketMatchesData) {
        const cricketMatchesHTML = currentCricketMatchesData.data.map(match => `
            <div class="match-item">
                <h3>${match.name}</h3>
                <p><strong>Match Type:</strong> ${match.matchType}</p>
                <p><strong>Status:</strong> ${match.status}</p>
                <p><strong>Venue:</strong> ${match.venue}</p>
                <p><strong>Date:</strong> ${match.date}</p>
            </div>
        `).join('');

        cricketMatchPanel.webview.html = `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
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
                <h2>Current Cricket Matches</h2>
                ${cricketMatchesHTML}
            </body>
            </html>
        `;
    }
}

// Function to show current cricket matches panel
function showCurrentCricketMatchesPanel(context) {
    if (!cricketMatchPanel) {
        cricketMatchPanel = vscode.window.createWebviewPanel(
            'currentCricketMatches',
            'Current Cricket Matches',
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
    cricketMatchPanel.webview.html = getLoadingMessage(true);

    // Fetch data from API and display it with animation
    fetchCurrentCricketMatches().then(data => {
        if (data) {
            // If data is received, display it in the webview with animation
            currentCricketMatchesData = data;
            displayCurrentCricketMatches(true);
        } else {
            // If no data is received, display a message
            cricketMatchPanel.webview.html = '<p>No current cricket matches available</p>';
        }
    }).catch(error => {
        console.error('Error fetching current cricket matches data:', error);
        vscode.window.showErrorMessage('Error fetching current cricket matches data');
    });
}


// Function to show current cricket match data panel


async function fetchCricketMatchData() {
    const options = {
        method: 'GET',
        url: 'https://api.cricapi.com/v1/cricScore?apikey=2a2166f8-ac23-4098-90b3-45c315c3d2b3'
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

// Function to display cricket match data in webview
function displayCricketMatchData(animate = false) {
    if (apiPanel && cricketMatchData) {
        const cricketMatchHTML = cricketMatchData.data.map(match => `
            <div class="match-item">
                <h3>${match.t1} vs ${match.t2}</h3>
                <p><strong>Match Type:</strong> ${match.matchType}</p>
                <p><strong>Score:</strong> ${match.t1s}</p>
                <p><strong>Score:</strong> ${match.t2s}</p>
                <p><strong>Status:</strong> ${match.status}</p>
                <img src="${match.t1img}" alt="${match.t1}">
                <img src="${match.t2img}" alt="${match.t2}">
            </div>
        `).join('');

        apiPanel.webview.html = `
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; }
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
                <h2>Cricket Match Data</h2>
                ${cricketMatchHTML}
            </body>
            </html>
        `;
    }
}

// Function to show cricket match data panel
function showCricketMatchPanel(context) {
    if (!apiPanel) {
        apiPanel = vscode.window.createWebviewPanel(
            'cricketMatchData',
            'Cricket Match Data',
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
    apiPanel.webview.html = getLoadingMessage(true);

    // Fetch data from API and display it with animation
    fetchCricketMatchData().then(data => {
        if (data) {
            // If data is received, display it in the webview with animation
            cricketMatchData = data;
            displayCricketMatchData(true);
        } else {
            // If no data is received, display a message
            apiPanel.webview.html = '<p>No cricket match data available</p>';
        }
    }).catch(error => {
        console.error('Error fetching cricket match data:', error);
        vscode.window.showErrorMessage('Error fetching cricket match data');
    });
}

// Function to fetch match results data
// Update the fetchMatchResultsData function to fetch data from the new URL
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
                    body { font-family: Arial, sans-serif; }
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
            'API Data',
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
            <p><strong>Time:</strong> ${fixture.time}</p>
            <p><strong>Source:</strong> ${fixture.source}</p>
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
            <h2>API Data</h2>
            <h3>Fixtures</h3>
            ${fixturesHTML}
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

    // Register commands and their handlers
    let disposable = vscode.commands.registerCommand('mytodo.helloWorld', function () {
        vscode.window.showInformationMessage('Hello World from mytodo!');
    });

    
    context.subscriptions.push(vscode.commands.registerCommand('mytodo.openTodoList', () => {
        // Open todo list
        showTodoList(context);
    }));
    
    context.subscriptions.push(vscode.commands.registerCommand('mytodo.openAPIPanel', () => {
        // Open API data panel
        showAPIPanel(context);
    }));
    
    context.subscriptions.push(vscode.commands.registerCommand('mytodo.openNewsPanel', () => {
        // Open news data panel
        showNewsPanel(context);
    }));
    
    context.subscriptions.push(vscode.commands.registerCommand('mytodo.addTodoItem', () => {
        // Prompt user to add a new todo item
        vscode.window.showInputBox({ prompt: 'Enter todo item title' }).then(title => {
            if (title) {
                vscode.window.showInputBox({ prompt: 'Enter todo item description' }).then(description => {
                    if (description) {
                        addTodoItem(title, description);
                    }
                });
            }
        });
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
