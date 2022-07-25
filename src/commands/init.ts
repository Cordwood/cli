import { Command } from "commander";
import { access, writeFile, mkdir } from "fs/promises";
import { dirname } from "path";
import inquirer from "inquirer";

import * as data from "../lib/data.js";

const prompts: inquirer.QuestionCollection = [
    {
        type: "input",
        name: "pluginName",
        message: "What is your plugin's name?",
    },
    {
        type: "input",
        name: "pluginDescription",
        message: "What is your plugin's description?",
    },
    {
        type: "input",
        name: "pluginLicense",
        message: "What license is your plugin under?",
        default: "Unlicensed",
    },
    {
        type: "input",
        name: "pluginEntry",
        message: "Which file serves as he entrypoint to your plugin?",
        default: "index.js",
    },
];

export default function () {
    return new Command("init")
        .description("Initialize a new plugin.")
        .option(
            "--typescript",
            "If the written plugin template should be in TypeScript."
        )
        .action(async (options: InitOpts) => {
            // Check if a manifest, therefore probably a plugin, already exist in the provided directory
            await access("./manifest.json").then((m) => {
                throw new Error("A plugin already exists in this directory!");
            }).catch(() => {});

            // Get answers from inquirer prompts
            const answers = await inquirer.prompt(prompts);

            // Create the manifest
            let manifest = {
                name: answers.pluginName,
                description: answers.pluginDescription,
                license: answers.pluginLicense,
                main: answers.pluginEntry,
            };

            // Write the manifest to the filesystem
            await writeFile("./manifest.json", JSON.stringify(manifest, null, 4));

            // Create the package.json file from template
            await writeFile("./package.json", JSON.stringify(data.packageJson(options), null, 4));

            // Create the rollup config from template
            await writeFile("./rollup.config.ts", data.rollupConfig(options, answers.pluginName));

            // Create the .gitignore file from template
            await writeFile("./.gitignore", data.gitIgnore);

            // Create the plugin's code directory if needed
            if (dirname(answers.pluginEntry)) {
                await access(dirname(answers.pluginEntry)).catch(() => {
                    return mkdir(dirname(answers.pluginEntry), { recursive: true });
                })
            }

            // Create the plugin's main file from template, making directories as it goes
            await writeFile(answers.pluginEntry, data.pluginScaffold(options));
        });
}
