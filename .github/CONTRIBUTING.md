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

## Which files are packaged

Files included in the app package are determined by `packagerConfig.ignore` in [forge.config.cjs](../forge.config.cjs).

### How to extract app.asar

To check which files are actually included, you need [Electron asar](https://www.npmjs.com/package/@electron/asar). You can install it globally with

```shell
npm install -g @electron/asar
```


```shell
./node_modules/.bin/electron-forge package
```

Then go to the folder where the _app.asar_ is located, extract it and check its content. For example

```shell
cd out/Caesar-darwin-arm64/Caesar.app/Contents/Resources/
asar extract app.asar app
cd app
ls -lrta
```

### How to inspect .dmg file

You can also mount the .dmg file to inspect its content. For example,

```shell
hdiutil attach out/make/Caesar-1.0.0-arm64.dmg
cd /Volumes/Caesar
```

Once you are done, you can unmount it with

```shell
hdiutil detach /Volumes/Caesar
```

