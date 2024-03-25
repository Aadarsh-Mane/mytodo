// Function to show cricket series panel
let apiPanel; // Declare panel variable for API data
const vscode = require('vscode');
const path = require('path');
const axios = require('axios');
const { getLoadingMessage } = require('../global/loadingMessage');

let cricketSeriesData; // Variable to store cricket series data

async function fetchCricketSeriesData() {
    const options = {
        method: 'GET',
        url: 'https://api.cricapi.com/v1/series?apikey=87c81701-93f7-4362-8681-b6544d1d767c&offset=0'
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
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        color: #333;
                        margin: 40px auto;
                        max-width: 800px;
                        padding: 20px;
                    }
                    h2 {
                        color: #0a84ff;
                        font-size: 24px;
                    }
                    .series-item {
                        background-color: #fff;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        border-radius: 8px;
                        padding: 15px;
                        margin-bottom: 20px;
                        transition: transform 0.3s ease;
                        animation: fadeInUp 0.5s ease-out;
                    }
                    .series-item:hover {
                        transform: translateY(-5px);
                    }
                    .series-item h3 {
                        color: #0060df;
                        font-size: 20px;
                    }
                    .series-item p {
                        margin: 5px 0;
                        line-height: 1.6;
                    }
                    @keyframes fadeInUp {
                        from {
                            opacity: 0;
                            transform: translate3d(0, 20px, 0);
                        }
                        to {
                            opacity: 1;
                            transform: none;
                        }
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

        apiPanel.onDidDispose(() => {
            // Clear interval when the panel is closed to prevent memory leaks
            clearInterval(refreshInterval);
            apiPanel = null; // Set apiPanel to null to allow garbage collection
        }, null, context.subscriptions);
    }

    const refreshData = () => {
        apiPanel.webview.html = getLoadingMessage(true);
        fetchCricketSeriesData().then(data => {
            if (data) {
                cricketSeriesData = data;
                displayCricketSeriesData(true);
            } else {
                apiPanel.webview.html = '<p>No cricket series data available</p>';
            }
        }).catch(error => {
            console.error('Error fetching cricket series data:', error);
            vscode.window.showErrorMessage('Error fetching cricket series data');
        });
    };

    // Initial data fetch
    refreshData();

    // Refresh data every 5 minutes
    const refreshInterval = setInterval(refreshData, 1550000);
}

module.exports = {
    fetchCricketSeriesData,
    showCricketSeriesPanel
};
