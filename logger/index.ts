export class Logger {
  static log(message: string, type: "success" | "warn" | "error" = "success") {
    let prefix = "";

    switch (type) {
      case "success":
        prefix = this.success();
        break;
      case "warn":
        prefix = this.warn();
        break;
      case "error":
        prefix = this.error();
        break;
    }

    console.log(`${this.crateTimestamp()} ${prefix} ${message}`);
  }

  static error() {
    return `\x1b[31m[X]\x1b[0m`;
  }

  static warn() {
    return `\x1b[33m[!]\x1b[0m`;
  }

  static success() {
    return `\x1b[32m[@]\x1b[0m`;
  }

  static crateTimestamp() {
    return `\x1b[90m[${new Date().toLocaleTimeString()}]\x1b[0m`;
  }
}
