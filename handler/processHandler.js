const process = require('process');
const chalk = require('chalk');

process.on('unhandledRejection', (reason,promise) => {
    console.log(chalk.red(console.log("Possibly Unhandled Rejection at: Promise ", promise, " reason: ", reason)));
});

process.on('uncaughtException', (error) => {
    console.log(chalk.red(`Caught exception: ${error}`));
});
  