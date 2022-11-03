const core = require('@actions/core');
const exec = require('@actions/exec');
const io = require('@actions/io');
const path = require('path');

const main = async () => {
    try {
        var args = "";
        var editorPath = core.getInput('editor-path');

        if (!editorPath) {
            throw Error("Missing editor-path input");
        }

        args += `-editorPath "${editorPath}" `;

        var projectPath = core.getInput('project-path');

        if (!projectPath) {
            throw Error("Missing project-path input");
        }

        args += `-projectPath "${projectPath}" `;

        var buildTarget = core.getInput('build-target');

        if (buildTarget) {
            args += `-buildTarget ${buildTarget} `;
        }

        var additionalArgs = core.getInput('args');

        if (args) {
            args += `-additionalArgs ${additionalArgs} `;
        }

        var name = core.getInput('name');

        if (!name) {
            throw Error("Missing name input");
        }

        args += `-name ${name}`

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