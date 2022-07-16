#!/usr/bin/env node
import {Command} from "commander";
import init from "./commands/init.js";

let program = new Command();

program
    .name("cordwood")
    .description("A CLI tool for Cordwood plugin devs.")
    .version("0.0.1");

program.addCommand(init());

program.parse(process.argv);
