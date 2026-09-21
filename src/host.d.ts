/**
 * The standard response returned by YouTube messaging operations.
 */
export interface YoutubeReplyResponse {
  /**
   * The final operational status.
   */
  status: "success" | "error";
  /**
   * A descriptive status message or error detail.
   */
  message: string;
}

/**
 * Interface for interacting with the host's YouTube API context.
 *
 * **Plugin Permission:** `youtube`
 */
export interface YoutubeContext {
  /**
   * Sends a message directly to a YouTube Live Chat stream.
   */
  sendMessage(liveChatID: string, message: string): void;

  /**
   * Sends a reply to a user within a YouTube Live Chat stream.
   */
  replyToMessage(
    liveChatID: string,
    authorID: string,
    text: string,
  ): YoutubeReplyResponse;
}

/**
 * Interface for interacting with the host's network layer.
 *
 * **Plugin Permission:** `network`
 */
export interface HostNetwork {
  /**
   * Executes a network request using the host environment's networking stack.
   * 
   * @returns The raw string response payload from the endpoint.
   */
  fetch(url: string, options?: {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    headers?: Record<string, string>;
    body?: string;
  }): string;
}

/**
 * Scoped Key-Value Cache storage provider.
 */
export interface HostCache {
  /**
   * Retrieves a string or object value from the cache.
   * @returns The parsed value if found, or null if missing/expired.
   */
  get(key: string): any | null;

  /**
   * Saves an item to the cache database.
   */
  set(key: string, value: any): void;

  /**
   * Explicitly removes a targeted item from the cache.
   */
  delete(key: string): void;

  /**
   * Wipes all keys belonging to this specific plugin sandbox.
   */
  clear(): void;
}

/**
 * The unified runtime context proxy injected by the C# application layer.
 */
export interface HostContext {
  /**
   * Writes a categorized entry into the application's central logs.
   */
  log(level: "debug" | "info" | "warn" | "error", msg: string): void;

  /**
   * Dedicated proxy for outbound HTTP networking requests.
   */
  readonly network: HostNetwork;

  /**
   * Dedicated context for YouTube Live streaming interactions.
   */
  readonly youtube: YoutubeContext;

  /**
   * Dedicated persistent key-value caching space.
   */
  readonly cache: HostCache;
}
