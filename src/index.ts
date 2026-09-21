/// <reference path="./host.d.ts" />

import { hello } from "./extra_functions.js";
import { HostContext } from "./host.js";
import type { PluginSettings } from "./settings.js";

export default class TestPlugin {
  constructor(private host: HostContext, private settings: PluginSettings) {}

  public truncate(text: string): string {
    if (text.length <= this.settings.truncateAmount) return text;
    return text.substring(0, this.settings.truncateAmount) + "...";
  }

  public sendToLogServer(payload: any): any {
    var responseString = this.host.network.fetch("https://httpbin.org/post", {
      method: "POST",
      body: JSON.stringify({ log: payload }),
    });
    
    return JSON.parse(responseString);
  }

  public helloExport(): string {
    return hello();
  }
}
