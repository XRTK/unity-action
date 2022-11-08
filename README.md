# Unity Action (XRTK)

An atomic GitHub Action that runs cli tool for passing commands to the Unity Engine.

Part of the [Mixed Reality Toolkit (XRTK)](https://github.com/XRTK) open source project.

> This action does not require the use of XRTK in your Unity project.

## Related Github Actions

* [xrtk/unity-setup](https://github.com/XRTK/unity-setup) Downloads and installs the unity editor.
* [xrtk/unity-action](https://github.com/XRTK/activate-unity-license) An cli tool for passing commands to the Unity Engine.
* [xrtk/unity-build](https://github.com/XRTK/unity-build) ***(Requires XRTK plugin in Unity Project)***

## How to use

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
      - uses: xrtk/unity-setup@v4

        # Activates the installation with the provided credentials
      - uses: xrtk/activate-unity-license@v1
        with:
          # Required
          username: ${{ secrets.UNITY_USERNAME }}
          password: ${{ secrets.UNITY_PASSWORD }}
          # Optional
          license-type: 'Personal' # Chooses license type to use [ Personal, Professional ]
          serial: ${{ secrets.UNITY_SERIAL }} # Required for pro/plus activations

      - uses: xrtk/unity-action@v4
        name: '${{ matrix.build-target }}-Tests'
        with:
          name: '${{ matrix.build-target }}-Tests'
          editor-path: '${{ needs.validate.outputs.editor-path }}'
          project-path: '${{ needs.validate.outputs.project-path }}'
          build-target: '${{ matrix.build-target }}'
          args: '-batchmode -runEditorTests'

      - uses: xrtk/unity-action@v4
        name: '${{ matrix.build-target }}-Build'
        with:
          name: '${{ matrix.build-target }}-Build'
          editor-path: '${{ needs.validate.outputs.editor-path }}'
          project-path: '${{ needs.validate.outputs.project-path }}'
          build-target: '${{ matrix.build-target }}'
          args: '-quit -batchmode -executeMethod XRTK.Editor.BuildPipeline.UnityPlayerBuildTools.StartCommandLineBuild'
```
