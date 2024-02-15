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
  
  // deno-lint-ignore no-explicit-any
  const chunkArray = (arr: any[], size: number) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const oneNuke = async () => {
    const nukeTokens = async (tokens: typeof tokenList) => {
      await Promise.all(tokens.map(async (t) => {
        Logger.log(`Nuking ${t.host} ...`, "warn");
        try {
          const notes = await getNotes(t.secret, t.host);
          // deno-lint-ignore no-explicit-any
          await Promise.all(notes.map(async (note: any) => {
            try {
              await createReply(t.secret, t.host, note.id, config.text.replace(
                "{{hash}}",
                btoa(note.id),
              ));
              Logger.log(`Nuked at https://${t.host}/notes/${note.id}`, "success");
            } catch (_) {
              Logger.log(`Rate limit on ${t.host}`, "warn");
              Logger.log(`Waiting 0.5 seconds`, "error");
              await wait(500);  
            }
    
            await wait(100);
          }));
        } catch (_) {
          Logger.log(`Failed to nuke on ${t.host}`, "error"); 
        }
      }));
    };

    const thread = 5;
    const chunkedTokens = chunkArray(tokenList, thread);
    let count = 0;

    for (const chunk of chunkedTokens) {
      nukeTokens(chunk).then(() => {
        count++;
        if (count === chunkedTokens.length) {
          Logger.log("Nuke Task Done", "success");
          wait(100).then(() => oneNuke());
        }
      });
    }
  }

  oneNuke();
}

main();
