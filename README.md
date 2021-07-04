
# ⏰ ScheduleClout
ScheduleClout is a chrome extension that adds the scheduling functionality to BitClout.

## Repository Archive Notice (effective July 4th, 2021)
Thank you for helping us on this journey. As we have outgrown the Chrome Extension, we will archive this repository in favor of our new platform.

You can read more on <a href="https://bitclout.com/posts/8c4cd633f8f0a93ecbf938924e7c417d8eccb819e002ccbd2e430aa6dd6fc3e5">this BitClout status</a> or visit our new web app at <a href="https://app.scheduleclout.com">app.scheduleclout.com</a>.

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
1. Copy `.env.example` to `.env` and change the values if required.
    ```dotenv
   NODE_HOSTNAME=bitclout.com # Your Node's hostname (without protocol)
   NODE_API_HOSTNAME=api.bitclout.com # Your Node's API url (without protocol)
    ```
1. Build the project by running either of the following commands:
    ```shell script
   npm run build
    ```
   or
   ```shell script
    npx webpack --config webpack.config.js --mode production
    ```
## Manual Installation
We assumed you are running on Google Chrome. Depending on your browser, this process might be slightly different.

1. Head over to `chrome://extensions`
1. Enable `Developer Mode` by clicking on the toggle button on the top right corner of the screen.
1. Three new buttons will appear under the header. Click on `Load Unpacked` to trigger the folder selection modal.
1. Locate the `/dist` folder inside the appropriate folder, and click on `Select` or `Open`.

## Known Issues and Possible Improvements
1. The extension uses chrome's alarm API to handle its task; therefore, if for any reason the alarm API doesn't fire, the scheduler will not work. 
