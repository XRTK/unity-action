# Unity Action (XRTK)

> [!IMPORTANT]
> The action is no longer be maintained and has been moved to [buildalon/unity-action](https://github.com/buildalon/unity-action)

An atomic GitHub Action that runs cli tool for passing commands to the Unity Engine.

Part of the [Mixed Reality Toolkit (XRTK)](https://github.com/XRTK) open source project.

> This action does not require the use of XRTK in your Unity project.

## Related Github Actions

* [xrtk/unity-setup](https://github.com/XRTK/unity-setup) Downloads and installs the unity editor.
* [xrtk/unity-action](https://github.com/XRTK/activate-unity-license) An cli tool for passing commands to the Unity Engine.
* [xrtk/unity-build](https://github.com/XRTK/unity-build) ***(Requires XRTK plugin in Unity Project)***

## How to use

### Inputs

| Input | Description | Required | Default |
|-------|-------------|----------|---------|
| `build-target` | Platform build target. | `false` | `''` |
| `args` | Unity command line arguments. | `false` | `'-quit -batchmode -nographics'` |
| `log-name` | Name of the Unity Log. | `false` | `'Unity'` |

### Outputs

A `unity-process-id.txt` file containing the ID of the Unity process running during the Unity Action execution is created in the workspace directory. This output is useful if you need to kill the Unity process after the action execution. You can retrieve the process ID by reading the contents of the `unity-process-id.txt` file.

## Example

```yaml
jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      #max-parallel: 2 # Use this if you're activating pro license with matrix
      matrix:
        include:
          - os: ubuntu-latest
            build-target: StandaloneLinux64
          - os: windows-latest
            build-target: StandaloneWindows64
          - os: macos-latest
            build-target: StandaloneOSX

    steps:
      - name: checkout self
        uses: actions/checkout@v3

        # Installs the Unity Editor based on your project version text file
        # sets -> env.UNITY_EDITOR_PATH
        # sets -> env.UNITY_PROJECT_PATH
        # https://github.com/XRTK/unity-setup
      - uses: xrtk/unity-setup@v7.4
        with:
          build-targets: ${{ matrix.build-target }}

        # Activates the installation with the provided credentials
      - uses: xrtk/activate-unity-license@v5.1
        with:
          # Required
          username: ${{ secrets.UNITY_USERNAME }}
          password: ${{ secrets.UNITY_PASSWORD }}
          # Optional
          license-type: 'Personal' # Chooses license type to use [ Personal, Professional ]
          serial: ${{ secrets.UNITY_SERIAL }} # Required for pro/plus activations

      - uses: xrtk/unity-action@v6.1
        name: '${{ matrix.build-target }}-Tests'
        with:
          build-target: '${{ matrix.build-target }}'
          args: '-batchmode -runEditorTests'
          log-name: '${{ matrix.build-target }}-Tests'

      - uses: xrtk/unity-action@v6.1
        name: '${{ matrix.build-target }}-Build'
        with:
          build-target: '${{ matrix.build-target }}'
          args: '-quit -batchmode -executeMethod XRTK.Editor.BuildPipeline.UnityPlayerBuildTools.StartCommandLineBuild'
          log-name: '${{ matrix.build-target }}-Build'
```
