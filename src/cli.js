const findUp = require("find-up");

function getVersion() {
    return JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"))).version;
}

export async function cli(args) {
    if (args[2] == "help" || args[2] == "--help") {
        console.log(chalk.green("Help:\nPlease see https://github.com/hrueger/redundancyjs/blob/master/README.md"));
        process.exit();
    }
    if (args[2] == "version" || args[2] == "--version") {
        console.log(chalk.green(`v${getVersion()}`));
        process.exit();
    }

    const configJsonPath = await findUp("redundancy.json");
    if (configJsonPath) {

    } else {
        console.log("Error: no \"redundancy.json\" file was found.");
        process.exit(1);
    }
}