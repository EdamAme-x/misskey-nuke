// misskey.io => true
// https://misskey.jp => misskey.jp => true
// misskey.co.jp/a => misskey.co.jp => true
// misskey => false

function includesPrefix(host: string) {
  return host.startsWith("https://") || host.startsWith("http://");
}

export function isHost(host: string | undefined) {
  if (!host) return false;
  if (!host.includes(".")) return false;

  if (includesPrefix(host)) {
    return host.split("/")[2].includes(".");
  } else {
    return host.includes(".");
  }
}
