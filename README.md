# AnimeBuff Auto Friend Request Script (Fast Mode)

## Overview

This Tampermonkey user script automates the process of sending friend requests on **AnimeBuff.ru**. It navigates through user profiles randomly and sends requests to users who have the "Add Friend" button available. The script operates in fast mode, minimizing delays for enhanced performance.

## Features

- **Random User Navigation:** Automatically moves to random user profiles within a specified ID range.
- **Friend Request Automation:** Detects and clicks the "Add Friend" button.
- **Adaptive Button State Monitoring:** Ensures the request status updates successfully before proceeding.
- **Customizable Timing:** Configurable delays between requests for safe and efficient operation.

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) for your browser.
2. Create a new script in Tampermonkey.
3. Copy and paste the script code into the editor.
4. Save and activate the script.

## Usage

1. Visit **AnimeBuff.ru** and navigate to user pages.
2. The script will automatically detect eligible users and send friend requests.
3. It will log its actions in the console for transparency and debugging.

## Configuration

You can adjust the following parameters directly in the script:

- `MIN_USER_ID` and `MAX_USER_ID`: Define the range of user IDs to navigate.
- `DELAY_MIN` and `DELAY_MAX`: Set minimum and maximum delays (in milliseconds) between actions.
- `BUTTON_SELECTOR`: Customize the CSS selector for the "Add Friend" button if needed.

## How It Works

1. **User Detection:** The script identifies the current user ID from the URL.
2. **Button Monitoring:** Observes the "Add Friend" button for status changes using `MutationObserver`.
3. **Random Navigation:** Moves to the next user profile based on a randomly generated ID.
4. **Logs and Feedback:** Provides real-time logs in the browser console for all operations.

## Limitations

- **Target Platform:** This script works only on **AnimeBuff.ru**.
- **Manual Operation Check:** Ensure you monitor the script's behavior to avoid unintended issues.
