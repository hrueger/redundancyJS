import findUp from "find-up";
import fs from "fs";
import path from "path";
import glob from "glob";
import chokidar from "chokidar";
import packageJson from "../package.json" with { type: "json" };

export async function cli(args) {
    if (args[2] == "help" || args[2] == "--help") {
        console.log(chalk.green("Help:\nPlease see https://github.com/hrueger/redundancyjs/blob/master/README.md"));
        process.exit();
    }
    if (args[2] == "version" || args[2] == "--version") {
        console.log(chalk.green(`v${packageJson.version}`));
        process.exit();
    }

    let watching = false;
    if (args[2] == "watch" || args[2] == "--watch" || args[2] == "-w") {
        watching = true;
    }

    const configJsonPath = await findUp("redundancy.json");
    if (configJsonPath) {
        try {
            const content = JSON.parse(fs.readFileSync(configJsonPath));
            const baseDir = path.dirname(configJsonPath);
            const files = [];
            for (const file of content.files) {
                file.src = path.join(baseDir, file.src);
                file.dest = path.join(baseDir, file.dest);
                if ((file.src.match(/\*/g) || []).length > 1) {
                    throw Error("The source path can't contain more than one *.");
                }
                if ((file.dest.match(/\*/g) || []).length > 0) {
                    throw Error("The dest path can't contain a *.");
                }
                const fls = glob.sync(file.src);
                if (fls.length) {
                    for (let f of fls) {
                        f = path.normalize(f);
                        files.push({
                            src: f,
                            dest: path.join(f.replace(f.split("*"[0]), file.dest), path.basename(f)),
                            removeDecorators: file.removeDecorators,
                            removeMethods: file.removeMethods,
                            removeImports: file.removeImports,
                            changeImports: file.changeImports,
                        });
                    }
                } else {
                    files.push(file);
                }
            }
            await run(files);
            if (watching) {
                console.log("Watching files...");
                chokidar.watch(files.map((f) => f.src)).on("change", async () => {
                    process.stdout.write("File change detected, copying... ");
                    await run(files);
                    console.log("Done");
                });
            }
        } catch (e) {
            console.log(e);
            process.exit(1);
        }
    } else {
        console.log('Error: no "redundancy.json" file was found.');
        process.exit(1);
    }
}

async function run(files) {
    for (let file of files) {
        let content = fs.readFileSync(file.src).toString();

        if (file.removeDecorators || file.removeMethods || file.removeImports || file.changeImports) {
            if (file.removeDecorators) {
                content = content.replace(/@[^(]*\((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*\)/g, "");
            }
            if (file.removeMethods && file.removeMethods.length > 0) {
                for (const name of file.removeMethods) {
                    content = content.replace(new RegExp(`(public )*(private )*${name}\(.*\) {(?:[^}{]+|{(?:[^}{]+|{[^}{]*})*})*}`, "g"), "");
                }
            }
            if (file.removeImports && file.removeImports.length > 0) {
                for (const name of file.removeImports) {
                    content = content.replace(new RegExp(`import\\s+?(?:(?:(?:[\\w*\\s{},]*)\\s+from\\s+?)|)(?:(?:"${name}")|(?:'${name}'))[\\s]*?(?:;|$|)`, "g"), "");
                    content = content.replace(new RegExp(`import {[^}]*}.*"${name}";?`, "g"), "");
                    content = content.replace(new RegExp(`import {[^}]*}.*'${name}';?`, "g"), "");
                }
            }
            if (file.changeImports && file.changeImports.length > 0) {
                for (const name of file.changeImports) {
                    const typeString = new RegExp(`import\\s+?(?:(?:([\\w*\\s{},]*)\\s+from\\s+?)|)(?:(?:"${name}")|(?:'${name}'))[\\s]*?(?:;|$|)`, "g").exec(content);
                    content = content.replace(new RegExp(`import\\s+?(?:(?:(?:[\\w*\\s{},]*)\\s+from\\s+?)|)(?:(?:"${name}")|(?:'${name}'))[\\s]*?(?:;|$|)`, "g"), "");
                    if (typeString && typeString[1] && typeString[1].startsWith("{") && typeString[1].endsWith("}")) {
                        const types = typeString[1]
                            .replace(/{|}/g, "")
                            .trim()
                            .split(",")
                            .map((t) => t.trim());
                        for (const t of types) {
                            content = content.replace(new RegExp(`(?:(${t}<[^>]*?>)|(${t}))([,;\[\)>])`, "g"), "any$3");
                        }
                    }
                }
            }
        }

        const lines = content.split("\n");
        let first = true;
        const newLines = [];
        for (let line of lines) {
            line = transform(line, first);
            if (first) {
                first = false;
            }
            newLines.push(line);
        }
        let data = newLines.join("\n");
        fs.writeFileSync(file.dest, data);
    }
}

function transform(line, first) {
    let output = "";
    if (first) {
        output += `
/*    +-----------------------------------------------------------------------+    */
/*    |    Do not edit this file directly.                                    |    */
/*    |    It was copied by redundancyJS.                                     |    */
/*    |    To modify it, first edit the source file (see redundancy.json).    |    */
/*    |    Then, run "npx redundancyjs" in the terminal.                      |    */
/*    +-----------------------------------------------------------------------+    */

`;
    }
    output += `/* do not edit */${line ? ` ${line}` : ""}`;
    return output;
}
