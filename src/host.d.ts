export interface HostNetwork {
  fetch(url: string, options?: any): any;
}
export interface HostContext {
  network: HostNetwork;
}

// I'll make a pdk or something later
// This gets ignored by the monaco typegen and the user-side scripting environment
declare global {
  const host: HostContext;
}

export {};
