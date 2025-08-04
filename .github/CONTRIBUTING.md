## Requirements

[Node.js](https://nodejs.org/) version used is the one related to Electron version used, according to [Elecron releases](https://releases.electronjs.org/).

Install [Volta](https://volta.sh/) or use Node.js version listed in `volta` attribute in the [package.json](../package.json).

## Start app locally

With [npm](https://www.npmjs.com/) install dependencies

```shell
npm install
```

Then start the app with

```shell
npm start
```

Optionally, set `DEVTOOLS` environment variable before starting the app.
It will open Chrome DevTools.

```shell
DEVTOOLS=true npm start
```

