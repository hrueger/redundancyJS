const findUp = require("find-up");
const fs = require('fs');
const readline = require('readline');

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
        try {
            const content = JSON.parse(fs.readFileSync(configJsonPath));
            for (const file of content.files) {
                const readFile = readline.createInterface({
                    input: fs.createReadStream(file.src),
                    output: fs.createWriteStream(file.dest),
                    terminal: false
                });

                await new Promise((resolve, reject) => {
                    readFile.on('line', transform).on('close', () => {
                        resolve();
                    });
                });

            }
        } catch (e) {
            console.log(e);
            process.exit(1);
        }
    } else {
        console.log("Error: no \"redundancy.json\" file was found.");
        process.exit(1);
    }
}

function transform(line) {
    if (!this.first) {
        this.first = true;
        this.output.write(`
/*    +-----------------------------------------------------------------------+    */
/*    |    Do not edit this file directly.                                    |    */
/*    |    It was copied by redundancyJS.                                     |    */
/*    |    To modify it, first edit the source file (see redundancy.json).    |    */
/*    |    Then, run "npx redundancyjs" in the terminal.                      |    */
/*    +-----------------------------------------------------------------------+    */

`)
    }
    this.output.write(`/* do not edit */${line ? ` ${line}` : ""}\n`);
}