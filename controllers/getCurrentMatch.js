const vscode = require('vscode');
const path = require('path');
const axios = require('axios');
const {getLoadingMessage}=require('../global/loadingMessage');

let currentCricketMatchesData; // Variable to store current cricket matches data
let cricketMatchPanel; // Declare panel variable for current cricket matches data

async function fetchCurrentCricketMatches() {
    const options = {
        method: 'GET',
        url: 'https://api.cricapi.com/v1/currentMatches?apikey=87c81701-93f7-4362-8681-b6544d1d767c&offset=0'
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
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Current Cricket Matches</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #000;
                        color: #fff;
                        padding: 20px;
                        animation: fadein 2s;
                    }
                    @keyframes fadein {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    h2 {
                        color: #fff;
                        text-align: center;
                        margin-bottom: 20px;
                        animation: slidein 2s;
                    }
                    @keyframes slidein {
                        from { transform: translateY(-50px); }
                        to { transform: translateY(0); }
                    }
                    .match-item {
                        background-color: #222;
                        border-radius: 5px;
                        box-shadow: 0 2px 5px rgba(255, 255, 255, 0.1);
                        padding: 15px;
                        margin-bottom: 20px;
                        transition: transform 0.3s ease-in-out;
                    }
                    .match-item:hover {
                        transform: translateY(-5px);
                    }
                    .match-item h3 {
                        margin-bottom: 5px;
                        font-size: 20px;
                    }
                    .match-item p {
                        margin: 5px 0;
                    }
                </style>
            </head>
            <body>
                <h2>Current Cricket Matches</h2>
                <div id="matches-container">
                    ${cricketMatchesHTML}
                </div>
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

        cricketMatchPanel.onDidDispose(() => {
            clearInterval(refreshInterval);
            cricketMatchPanel = null;
        }, null, context.subscriptions);
    }

    const refreshData = () => {
        cricketMatchPanel.webview.html = getLoadingMessage(true);
        fetchCurrentCricketMatches().then(data => {
            if (data) {
                currentCricketMatchesData = data;
                displayCurrentCricketMatches(true);
            } else {
                cricketMatchPanel.webview.html = '<p>No current cricket matches available</p>';
            }
        }).catch(error => {
            console.error('Error fetching current cricket matches data:', error);
            vscode.window.showErrorMessage('Error fetching current cricket matches data');
        });
    };

    // Initial data fetch
    refreshData();
    

    // Refresh data every 5 minutes
    const refreshInterval = setInterval(refreshData, 3* 60 * 1000); // 5 minutes in milliseconds
}

module.exports = {
    fetchCurrentCricketMatches,
    showCurrentCricketMatchesPanel
};
