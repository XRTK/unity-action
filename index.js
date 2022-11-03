const core = require('@actions/core');
const exec = require('@actions/exec');
const io = require('@actions/io');
const path = require('path');

const main = async () => {
    try {
        var args = "";

        console.log(`start env: ${process.env}`);

        console.log(`editor-path: ${process.env.EDITOR_PATH}`);
        var editorPath = process.env.EDITOR_PATH;

        if (!editorPath) {
            throw Error("Missing editor-path input");
        }

        args += `-editorPath "${editorPath}" `;

        console.log(`project-path: ${process.env.PROJECT_PATH}`);
        var projectPath = process.env.PROJECT_PATH;

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