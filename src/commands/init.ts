import {Command} from "commander";
import {existsSync, writeFileSync} from "fs";
import inquirer from "inquirer";

const prompts: inquirer.QuestionCollection = [
    {
        type: "input",
        name: "pluginName",
        message: "What is your plugin's name?"
    },
    {
        type: "input",
        name: "pluginDescription",
        message: "What is your plugin's description?"
    },
    {
        type: "input",
        name: "pluginVersion",
        message: "What is your plugin's version number?",
        default: "0.0.1"
    },
    {
        type: "input",
        name: "pluginEntry",
        message: "The entrypoint of your plugin.",
        default: "index.js"
    }
];

type InitOpts = {
    typescript: boolean;
};
export default function () {
    return new Command("init")
        .description("Initialize a new plugin.")
        .option(
            "--typescript",
            "If the written plugin template should be in TypeScript."
        )
        .action(async (options: InitOpts) => {
            if (existsSync("./cordwood.json")) {
                console.log("A plugin already exists in this directory!");
                return;
            }

            const answers = await inquirer.prompt(prompts);

            let manifest = {
                name: answers.pluginName,
                description: answers.pluginDescription,
                version: answers.pluginVersion,
                main: answers.pluginEntry
            };
            writeFileSync("./cordwood.json", JSON.stringify(manifest, null, 4));
        });
}
