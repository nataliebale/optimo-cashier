// const fs = require('fs');
// const path = require('path');
// const exec = require('child_process').exec;

// const args = process.argv.slice(2);
// const branchName = args[0].split('=')[1].split('/')[1];
// let submoduleBranchName = 'develop';

// switch (branchName) {
//   case 'master':
//     submoduleBranchName = 'master';
//     break;
//   case 'staging':
//     submoduleBranchName = 'staging';
//     break;
// }

// fs.writeFileSync(
//   __dirname + '/../../.gitmodules',
//   fs.readFileSync(__dirname + '/submodules.' + submoduleBranchName).toString()
// );
// exec(
//   `git submodule sync`,
//   {
//     cwd: path.resolve(__dirname, '..', '..'),
//   },
//   (err, stdout, stderr) => {
//     if (err) {
//       console.log({ err, stdout, stderr });
//       process.exit(1);
//     }
//     exec(
//       `git checkout ${branchName}`,
//       {
//         cwd: path.resolve(__dirname, '..', '..', 'git_modules', 'hardware-integration'),
//       },
//       (err, stdout, stderr) => {
//         if (err) {
//           console.log({ err, stdout, stderr });
//           process.exit(1);
//         }
//         exec(
//           `git checkout .`,
//           {
//             cwd: path.resolve(__dirname, '..', '..', 'git_modules', 'hardware-integration'),
//           },
//           (err, stdout, stderr) => {
//             if (err) {
//               console.log({ err, stdout, stderr });
//               process.exit(1);
//             }
//             exec(
//               `git pull`,
//               {
//                 cwd: path.resolve(__dirname, '..', '..', 'git_modules', 'hardware-integration'),
//               },
//               (err, stdout, stderr) => {
//                 if (err) {
//                   console.log({ err, stdout, stderr });
//                   process.exit(1);
//                 }
//                 console.log(`Switcehd submodule to ${branchName}`);
//               }
//             );
//           }
//         );
//       }
//     );
//   }
// );
