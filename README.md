# ⏰ ScheduleClout
ScheduleClout is a chrome extension that adds the scheduling functionality to BitClout.

## Installation
Currently, you can install the extension manually by following the **Build Guide** below; however, we are planning to publish the extension on Google Chrome Web Store.

## System Requirements
- Properly configured GIT
- An active internet connection
- NodeJS (v10+), NPM, and NPX
- A chromium-based browser

## Build Guide
1. Clone the repository by running the following command:
    ```shell script
    git clone https://github.com/ScheduleClout/Extension.git 
    ```
1. Install the project dependencies
    ```shell script
    npm install
    ```
1. Build the project by running either of the following commands:
    ```shell script
   npm run build
    ```
   or
   ```shell script
    npx webpack --config webpack.config.js --mode production
    ```
## Manual installation
We assumed you are running on Google Chrome. Depending on your browser, this process might be slightly different.

1. Head over to `chrome://extensions`
1. Enable `Developer Mode` by clicking on the toggle button on the top right corner of the screen.
1. Three new buttons will appear under the header. Click on `Load Unpacked` to trigger the folder selection modal.
1. Locate the `/dist` folder inside the appropriate folder, and click on `Select` or `Open`.