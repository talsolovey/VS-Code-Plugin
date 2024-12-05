// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// Track the start time of the session
let sessionStart = null;
let intervalId = null;
let reminderIntervalId = null;

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

	// Set up the reminder notifications
    setReminderNotifications(context);

	// Clean up the interval when the extension is deactivated
    context.subscriptions.push({
        dispose: () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
            if (reminderIntervalId) {
                clearInterval(reminderIntervalId);
            }
        }
    });
}

/**
 * Sets reminder notifications for stretch breaks based on user settings.
 * @param {vscode.ExtensionContext} context
 */
function setReminderNotifications(context) {
    // Function to display the reminder notification
    const showReminder = () => {
        vscode.window.showInformationMessage('Time to take a 5-minute stretch break!');
    };

    // Set up the reminder notifications initially
    startReminderNotifications(context, showReminder);

    // Listen for configuration changes to update the interval dynamically
    vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration('vs-code-time-extension.notificationInterval')) {
            console.log('Notification interval configuration changed');
            // Clear the current reminder interval
            if (reminderIntervalId) {
                clearInterval(reminderIntervalId);
            }
            // Restart reminders with updated settings
            startReminderNotifications(context, showReminder);
        }
    });
}

/**
 * Starts reminder notifications based on user settings.
 * @param {vscode.ExtensionContext} context
 * @param {(args: void) => void} showReminder
 */
function startReminderNotifications(context, showReminder) {
    // Get the notification interval from configuration settings
    const configuration = vscode.workspace.getConfiguration('vs-code-time-extension');
    const notificationInterval = configuration.get('notificationInterval', 60); // Default is 60 minutes

    // Set the reminder notification interval in milliseconds
    const intervalInMilliseconds = notificationInterval * 60 * 1000;

    // Start the reminder notifications at the specified interval
    reminderIntervalId = setInterval(showReminder, intervalInMilliseconds);
    console.log(`Reminder notifications set for every ${notificationInterval} minute(s)`);

    // Clean up when the extension is deactivated
    context.subscriptions.push({
        dispose: () => {
            if (reminderIntervalId) {
                clearInterval(reminderIntervalId);
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
    if (reminderIntervalId) {
        clearInterval(reminderIntervalId);
    }
}
module.exports = {
	activate,
	deactivate
};
