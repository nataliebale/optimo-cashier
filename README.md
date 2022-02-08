# Requirements:

Rebuild dependencies ``npm install --global windows-build-tools``  
Git submodules: ``git submodule update --init --recursive``  
Pull with submodules: ``git config --global submodule.recurse true``

# Windows
build:dll Dependencies [MSBuildTool16(2019)](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools&rel=16) 
Check .NET desktop build tools 
Add new record in PATH: ``C:\Program Files (x86)\Microsoft Visual Studio\2019\BuildTools\MSBuild\Current\Bin``

# MacOS 
deps: dotnet2.2, brew=>glib