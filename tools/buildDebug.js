const spawn = require('child_process').spawn,
  whereis = require('./whereis'),
  fs = require('fs'),
  ncp = require('ncp');
if (process.platform === 'win32') {
  spawn(
    __dirname + '/../node_modules/nuget/bin/nuget.exe',
    ['restore', __dirname + '/../src/hardware-integration/OdinHardwareNetFramework.sln'],
    { stdio: 'inherit' }
  ).on('close', () => {
    spawn(
      'C:/Program Files (x86)/Microsoft Visual Studio/2019/BuildTools/MSBuild/Current/Bin/MSBuild.exe',
      [
        'src/hardware-integration/OdinHardwareNetFramework.sln',
        '/restore',
        '/t:Rebuild',
        '/p:Configuration=Debug',
      ],
      { stdio: 'inherit' }
    ).on('close', () => {
      ncp('src/hardware-integration/src/DeviceService/bin/Debug', 'bin');
    });
  });
}

if (process.platform === 'darwin' || process.platform === 'linux') {
  const runtime = process.platform === 'darwin' ? 'osx-x64' : 'linux-x64';
  spawn('dotnet', ['restore', 'src/hardware-integration/OdinHardwareNetCore.sln'], {
    stdio: 'inherit',
  }).on('close', () => {
    spawn(
      'dotnet',
      [
        'publish',
        'src/hardware-integration/src/DeviceService/DeviceServiceNetCore.csproj',
        '-c',
        'Release',
        '--runtime',
        runtime,
      ],
      { stdio: 'inherit' }
    ).on('close', () => {
      ncp(
        `src/hardware-integration/src/DeviceService/bin/Release/netcoreapp2.2/${runtime}/publish`,
        'bin'
      );
      if (process.platform === 'darwin') {
        fs.copyFile(`bin/MacOS/apphost`, 'bin/apphost', (err) => {
          if (err) throw err;
          console.log('apphost copied');
        });
      } else {
        // fs.copyFile(
        //   `src/hardware-integration/src/DeviceService/bin/Release/netcoreapp2.2/${runtime}/apphost`,
        //   'bin/apphost',
        //   (err) => {
        //     if (err) throw err;
        //     console.log('apphost copied');
        //   }
        // );
      }
    });
  });
}
