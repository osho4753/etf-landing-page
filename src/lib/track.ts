type EventData = Record<string, string | number | boolean>;

type Umami = { track: (name: string, data?: EventData) => void };

declare global {
  interface Window {
    umami?: Umami;
    __trustoneQueue?: Array<[string, EventData | undefined]>;
  }
}

let context: EventData = {};

export function setTrackContext(data: EventData) {
  context = { ...context, ...data };
}

export function track(name: string, data?: EventData) {
  if (typeof window === "undefined") return;
  const payload = { ...context, ...data };
  if (window.umami) {
    window.umami.track(name, payload);
  } else {
    (window.__trustoneQueue ??= []).push([name, payload]);
  }
  if (process.env.NODE_ENV !== "production") {
    console.debug("[track]", name, payload);
  }
}

export function flushQueue() {
  if (typeof window === "undefined" || !window.umami) return;
  const queue = window.__trustoneQueue ?? [];
  window.__trustoneQueue = [];
  for (const [name, data] of queue) window.umami.track(name, data);
}

const once = new Set<string>();

export function trackOnce(name: string, data?: EventData) {
  if (once.has(name)) return;
  once.add(name);
  track(name, data);
}
