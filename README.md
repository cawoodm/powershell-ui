# A PowerShell GUI

A work in progress.

Getting to grips with powershell can be daunting. This UI is to be a starting
point for people learning powershell as well as toolbox for experts to build and save
their favorite scripts.

Ultimately I'd like it to be a graphical IDE for connecting scriptlets together into workflows.

## Platforms

* Electron version in `powershell-ui-electron`
* HTA version in `powershell-ui-hta`
* NWJS version in `powershell-ui-nw`

The .hta version is a single file which can be run on Windows without any extras.

The HTML5 applications requires nodeJS, NPM and either Electron or NW.js.

### Electron
```
npm install -g electron
git clone https://github.com/cawoodm/powershell-ui.git
cd powershell-ui
cd powershell-ui-electron
npm install
npm start

```

### NWJS
```
npm install -g nw
git clone https://github.com/cawoodm/powershell-ui.git
cd powershell-ui
cd powershell-ui-nw
npm install
npm start

```

#### License [MIT]
