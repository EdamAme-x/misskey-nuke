import { Logger } from "../logger/index.ts";

export function createPrompt(title: string, defaultValue?: string) {
  return prompt(
    `${Logger.crateTimestamp()} \x1b[32m[?]\x1b[0m ${title}: `,
    defaultValue,
  );
}
