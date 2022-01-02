# typescript-aniskip-extension

<a href="https://chrome.google.com/webstore/detail/aniskip/npfcdmjgaocepmpdnmliimijgfjbgcdd" target="_blank"><img src="https://imgur.com/3C4iKO0.png" width="64" height="64"></a>
<a href="https://addons.mozilla.org/en-US/firefox/addon/aniskip/" target="_blank"><img src="https://imgur.com/ihXsdDO.png" width="64" height="64"></a>
<a href="https://chrome.google.com/webstore/detail/aniskip/npfcdmjgaocepmpdnmliimijgfjbgcdd" target="_blank"><img src="https://imgur.com/nSJ9htU.png" width="64" height="64"></a>
<a href="https://chrome.google.com/webstore/detail/aniskip/npfcdmjgaocepmpdnmliimijgfjbgcdd" target="_blank"><img src="https://imgur.com/EuDp4vP.png" width="64" height="64"></a>
<a href="https://chrome.google.com/webstore/detail/aniskip/npfcdmjgaocepmpdnmliimijgfjbgcdd" target="_blank"><img src="https://imgur.com/z8yjLZ2.png" width="64" height="64"></a>

<img src="https://i.imgur.com/rUP9ebG.gif">

Web browser extension to skip anime openings and endings

## Discord

We are now on Discord! Want to contribute, need help or just want to ask questions? 

Join the Aniskip [Discord](https://discord.gg/UqT55CbrbE).

## Getting started

### Building and running the extension

#### Prerequisites

You will need to have installed:

1. [Node.js](https://nodejs.org/en/) v16.0.0 or greater
1. [Yarn](https://classic.yarnpkg.com/en/) v2.4.1 or greater

#### Running for development

1. Clone the repo

   ```
   git clone https://github.com/lexesjan/typescript-aniskip-extension
   ```

1. Navigate into the cloned GitHub repository

   ```
   cd typescript-aniskip-extension
   ```

1. Run the install and start script

   ```
   yarn install
   yarn start:dev:chrome
   ```

This will start a chromium browser with the built extension loaded. This script will reload the extension on file change. You can replace `chrome` with `firefox` to build for firefox.

#### Building for production

1. Clone the repo

   ```
   git clone https://github.com/lexesjan/typescript-aniskip-extension
   ```

1. Navigate into the cloned GitHub repository

   ```
   cd typescript-aniskip-extension
   ```

1. Run the install and start script

   ```
   yarn install
   yarn build:prod:chrome
   ```

This will build a zipped extension in the `web-ext-artifacts` folder. You can replace `chrome` with `firefox` to build for firefox.
