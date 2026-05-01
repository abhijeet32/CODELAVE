// Polyfill for Symbol.asyncDispose in older Node.js versions
if (typeof Symbol !== "undefined" && !Symbol.asyncDispose) {
  Object.defineProperty(Symbol, "asyncDispose", {
    value: Symbol("Symbol.asyncDispose"),
  });
}

export * from "./sandbox";
export * from "./types";
export * from "./errors";