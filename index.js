const core = require('@actions/core');
const exec = require('@actions/exec');
const io = require('@actions/io');
const path = require('path');

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

        var unity_action = path.resolve(__dirname, 'unity-action.ps1');
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