// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// Track the start time of the session
let sessionStart = null;
let intervalId = null;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vs-code-time-extension" is now active!');

	// Set the start time of the session
	sessionStart = new Date();

	// Create a status bar item to display the timer
	const timerStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
	timerStatusBar.command = undefined;
	timerStatusBar.show();
	context.subscriptions.push(timerStatusBar);

	// Function to update the timer in the status bar
	const updateTimer = () => {
		if (sessionStart) {
			const elapsedTime = Math.floor((new Date().getTime() - sessionStart.getTime()) / 1000);
			const hours = Math.floor(elapsedTime / 3600);
			const minutes = Math.floor((elapsedTime % 3600) / 60);
			const seconds = elapsedTime % 60;
			timerStatusBar.text = `🕒 ${hours}h ${minutes}m ${seconds}s`;
		}
	};

	// Start updating the timer every second
	intervalId = setInterval(updateTimer, 1000);

	// Schedule hourly reminders
	const hourlyReminder = () => {
		vscode.window.showInformationMessage('Time to take a 5-minute stretch break!');
	};
	setInterval(hourlyReminder, 60 * 60 * 1000); 

	// Clean up the interval when the extension is deactivated
	context.subscriptions.push({
		dispose: () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		}
	});
}

// This method is called when your extension is deactivated
function deactivate() {
	// Clear any active intervals
	if (intervalId) {
		clearInterval(intervalId);
	}
}

module.exports = {
	activate,
	deactivate
};
