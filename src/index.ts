/// <reference path="./host.d.ts" />
import { hello } from "./extra_functions.js";
import { HostContext } from "./host.js";
import type { PluginSettings } from "./settings.js";

export class TestPlugin {
  constructor(private host: HostContext, private settings: PluginSettings) {}

  truncate(text: string, maxLength: number) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }

  sendToLogServer(payload: any) {
    var responseString = this.host.network.fetch("https://httpbin.org/post", {
      method: "POST",
      body: JSON.stringify({ log: payload }),
    });
    
    return JSON.parse(responseString);
  }

  helloExport() {
    return hello();
  }

}
(globalThis as any).TestPlugin = TestPlugin;
