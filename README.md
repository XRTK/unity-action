# Unity Action (XRTK)

An atomic GitHub Action that runs the Unity engine via cli with the provided parameters.

Part of the [Mixed Reality Toolkit (XRTK)](https://github.com/XRTK) open source project.

> This action does not have any dependency on the use of XRTK in your Unity project.

## How to use

```yaml
jobs:
  activate:
    steps:
      - uses: xrtk/unity-validate@main
  build:
    needs: activate
    runs-on: windows-latest
    strategy:
      matrix:
        build-target: [StandaloneWindows64, WSAPlayer, Android, Lumin]
      max-parallel: 1 #optional

    steps:
      - uses: xrtk/unity-action@main
        name: '${{ matrix.build-target }}-Tests'
        with:
          name: '${{ matrix.build-target }}-Tests'
          editor-path: '${{ needs.validate.outputs.editor-path }}'
          project-path: '${{ needs.validate.outputs.project-path }}'
          build-target: '${{ matrix.build-target }}'
          args: '-batchmode -runEditorTests'

      - uses: xrtk/unity-action@main
        name: '${{ matrix.build-target }}-Build'
        with:
          name: '${{ matrix.build-target }}-Build'
          editor-path: '${{ needs.validate.outputs.editor-path }}'
          project-path: '${{ needs.validate.outputs.project-path }}'
          build-target: '${{ matrix.build-target }}'
          args: '-quit -batchmode -executeMethod XRTK.Editor.BuildPipeline.UnityPlayerBuildTools.StartCommandLineBuild'

```