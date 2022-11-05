/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 27:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 118:
/***/ ((module) => {

module.exports = eval("require")("@actions/exec");


/***/ }),

/***/ 889:
/***/ ((module) => {

module.exports = eval("require")("@actions/io");


/***/ }),

/***/ 17:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(27);
const exec = __nccwpck_require__(118);
const io = __nccwpck_require__(889);
const path = __nccwpck_require__(17);

const main = async () => {
    try {
        var args = "";
        var editorPath = process.env.UNITY_EDITOR_PATH;

        if (!editorPath) {
            throw Error("Missing UNITY_EDITOR_PATH ");
        }

        args += `-editorPath "${editorPath}" `;

        var projectPath = process.env.UNITY_PROJECT_PATH;

        if (!projectPath) {
            throw Error("Missing UNITY_PROJECT_PATH");
        }

        args += `-projectPath "${projectPath}" `;

        var buildTarget = core.getInput('build-target');

        if (buildTarget) {
            args += `-buildTarget ${buildTarget} `;
        }

        var additionalArgs = core.getInput('args');

        if (args) {
            args += `-additionalArgs "${additionalArgs}" `;
        }

        var logName = core.getInput('log-name');

        if (!logName) {
            throw Error("Missing log-name input");
        }

        args += `-logName ${logName}`

        var pwsh = await io.which("pwsh", true);

        var unity_action = __nccwpck_require__.ab + "unity-action.ps1";
        var exitCode = await exec.exec(`"${pwsh}" -Command`, `${unity_action} ${args}`);

        if (exitCode != 0) {
            throw Error(`Unity Action Failed! exitCode: ${exitCode}`)
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

// Call the main function to run the action
main();
})();

module.exports = __webpack_exports__;
/******/ })()
;