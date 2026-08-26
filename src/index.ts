/// <reference path="./host.d.ts" />
import { testVariable, hello } from "./extra_functions";

export function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

export function sendToLogServer(payload: any) {
  var response = host.network.fetch("https://httpbin.org/post", {
    method: "POST",
    body: JSON.stringify({ log: payload }),
  });
  return response.json();
}

export const TestVariable = testVariable;
export function Hello() {
  return hello();
}
