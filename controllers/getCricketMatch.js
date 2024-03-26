const vscode = require('vscode');
const path = require('path');
const axios = require('axios');
const { getLoadingMessage } = require('../global/loadingMessage');

let apiPanel; // Declare panel variable for API data
let cricketMatchData; // Variable to store cricket match data

async function fetchCricketMatchData() {
    const options = {
        method: 'GET',
        url: 'https://api.cricapi.com/v1/cricScore?apikey=87c81701-93f7-4362-8681-b6544d1d767c'
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
            <div class="match-item" ${animate ? 'style="animation: fadein 2s;"' : ''}>
                <h3>${match.t1} vs ${match.t2}</h3>
                <h4> ${match.dateTimeGMT}</h4>
                <p><strong>Match Type:</strong> ${match.matchType}</p>
                <p><strong>Score (${match.t1}):</strong> ${match.t1s}</p>
                <p><strong>Score (${match.t2}):</strong> ${match.t2s}</p>
                <p><strong>Status:</strong> ${match.status}</p>
                <div class="team-logos">
                    <img src="${match.t1img}" alt="${match.t1}">
                    <img src="${match.t2img}" alt="${match.t2}">
                </div>
            </div>
        `).join('');

        apiPanel.webview.html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Cricket Match Data</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #000;
                        color: #fff;
                        padding: 20px;
                    }
                    .match-item  h4{
                        color: #ffcc00; /* Yellow */
                        margin-top: 10px;
                    }
                    .match-item {
                        background-color: #333;
                        border-radius: 8px;
                        box-shadow: 0 2px 10px rgba(255, 255, 255, 0.1);
                        padding: 20px;
                        margin-bottom: 20px;
                        overflow: hidden;
                    }
                    .match-item h3 {
                        margin-bottom: 10px;
                        font-size: 24px;
                        color: #fff;
                    }
                    .match-item p {
                        margin: 5px 0;
                    }
                    .team-logos {
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        margin-top: 15px;
                    }
                    .team-logos img {
                        width: 50px;
                        height: 50px;
                    }
                    @keyframes fadein {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                </style>
            </head>
            <body>
                <h2 style="text-align: center;">Cricket Match Data</h2>
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

        apiPanel.onDidDispose(() => {
            clearInterval(refreshInterval);
            apiPanel = null;
        }, null, context.subscriptions);
    }

    const refreshData = () => {
        apiPanel.webview.html = getLoadingMessage(true);
        fetchCricketMatchData().then(data => {
            if (data) {
                cricketMatchData = data;
                displayCricketMatchData(true);
            } else {
                apiPanel.webview.html = '<p>No cricket match data available</p>';
            }
        }).catch(error => {
            console.error('Error fetching cricket match data:', error);
            vscode.window.showErrorMessage('Error fetching cricket match data');
        });
    };

    // Initial data fetch
    refreshData();

    // Refresh data every 5 minutes
    const refreshInterval = setInterval(refreshData, 3 * 60 * 1000); // 5 minutes in milliseconds
}

module.exports = {
    fetchCricketMatchData,
    showCricketMatchPanel
};
