import type {PluginBuild} from "esbuild"

export const consumeDependenciesFromWindowPlugin = (
    options: Record<string, string[]>
) => ({
  name: "esbuild-resolve",
  setup: (build: PluginBuild) => {
    for (let moduleName of Object.keys(options)) {
      let moduleExports = options[moduleName]

      let filter = new RegExp("^" + moduleName + "$")

      build.onResolve({filter}, async args => {
        if (args.resolveDir === "") {
          return
        }

        return {
          path: args.path,
          namespace: "esbuild-resolve",
          pluginData: {
            resolveDir: args.resolveDir,
            moduleName,
            moduleExports
          }
        }
      })

      build.onLoad({filter, namespace: "esbuild-resolve"}, async args => {
        let moduleName: string = args.pluginData.moduleName
        let moduleExports: string[] = args.pluginData.moduleExports

        let importerCode = `
const moduleFromWindow = window.__remixDependencies["${moduleName}"];
export default moduleFromWindow;
${moduleExports
            .filter(exportName => exportName !== "default")
            .map(
                exportName => `export const ${exportName} = moduleFromWindow.${exportName}`
            )
            .join("\n")}
    `
        return {
          contents: importerCode,
          resolveDir: args.pluginData.resolveDir
        }
      })
    }
  }
})
