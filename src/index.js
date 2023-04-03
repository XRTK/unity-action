const core = require('@actions/core');
const exec = require('@actions/exec');
const io = require('@actions/io');
const path = require('path');
const fs = require('fs');

const IsPost = !!core.getState('isPost');

const main = async () => {
    core.saveState('isPost', true);

    if (!IsPost) {
        await UnityAction();
    } else {
        await Cleanup();
    }
}

// Call the main function to run the action
main();

async function UnityAction() {
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

        args += `-logName ${logName}`;

        var pwsh = await io.which("pwsh", true);
        var unity_action = path.resolve(__dirname, 'unity-action.ps1');
        core.startGroup(`Run ${args}`);
        var exitCode = await exec.exec(`"${pwsh}" -Command`, `${unity_action} ${args}`);
        core.endGroup();

        if (exitCode != 0) {
            throw Error(`unity-action failed! exitCode: ${exitCode}`)
        }
    } catch (error) {
        core.setFailed(`unity-action failed! ${error.message}`);
    }
}

async function Cleanup() {
    const workspace = process.env.GITHUB_WORKSPACE;
    const unityProcessIdFile = path.join(workspace, 'unity-process-id.txt');
    const buildsDirectory = path.join(workspace, 'Builds');
    const logDirectory = path.join(workspace, 'Logs');

    await Promise.all([
        deletePath(unityProcessIdFile),
        deletePath(buildsDirectory),
        deletePath(logDirectory)
    ]);
}

async function deletePath(path) {
    try {
        if (fs.existsSync(path)) {
            core.debug(`Deleted ${path}`)
            await io.rmRF(path);
        } else {
            core.debug(`${path} does not exist`)
        }
    } catch (error) {
        core.error(`Failed to remove ${path}! ${error}`);
    }
}
