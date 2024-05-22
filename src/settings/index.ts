import settingsJson from "../../settings.json" with { type: "json" };
import { envSchema, type EnvSchema } from "./env.js";
import { consola as log } from "consola";
export { onError } from "./error.js";

import "./global.js";
import chalk from "chalk";
import { brBuilder } from "@magicyan/discord";

export { log, settingsJson as settings };

const parseResult = envSchema.safeParse(process.env);
if (!parseResult.success){
    for(const { message, path } of parseResult.error.errors){
        log.error({
            type: "ENV VAR",
            message: chalk.red(`${chalk.bold(path)} ${message}`)
        });
    }
    log.fatal(chalk.red(brBuilder(
        "Environment variables are undefined or the env file was not loaded.",
        "Make sure to run the bot using package.json scripts"
    )));
    process.exit(1);
}
log.success(chalk.hex(settingsJson.color.theme.darkpurple)("Env vars loaded successfully!"));

declare global {
    namespace NodeJS {
        interface ProcessEnv extends Readonly<EnvSchema> {}
    }
}

const developmentEnvPath = rootTo(".env.development");

import { ServiceAccount } from "firebase-admin";
import { basename } from "node:path";
import ck from "chalk";
import { existsSync, readFileSync } from "node:fs";

const firebaseAccountPath = existsSync(developmentEnvPath)
? rootTo("firebase.development.json") 
: rootTo("firebase.json");

if (!existsSync(firebaseAccountPath)){
    const filename = ck.yellow(`"${basename(firebaseAccountPath)}"`);
    const text = ck.red(`The ${filename} file was not found in ${__rootname}`);
    log.error(text);
    process.exit(0);
}

const firebaseAccount: ServiceAccount = JSON.parse(
    readFileSync(firebaseAccountPath, {encoding: "utf-8"})
);

export { firebaseAccount };