import * as React from "react"
import * as ReactDom from "react-dom"
import * as RemixReact from "@remix-run/react"

declare global {
  var __remixDependencies: {
    react: typeof React,
    "react-dom": typeof ReactDom,
    "@remix-run/react": typeof RemixReact
  }
}

window.__remixDependencies = {
  react: React,
  "react-dom": ReactDom,
  "@remix-run/react": RemixReact,
}

// Expose React global same as `react.ts` shim that we won't include
export { React };
