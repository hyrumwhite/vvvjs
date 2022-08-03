const esbuild = require("esbuild");
const fs = require("fs/promises");
const path = require("path");

const cdnBuild = async () => {
  const buildConfig = {
    entryPoints: ["builds/cdn.js"],
    outfile: "dist/cdn.js",
    bundle: true,
    platform: "browser",
    define: { CDN: true },
  };
  const { cdnBundle } = await esbuild.build(buildConfig);
  buildConfig.minify = true;
  buildConfig.outfile = "dist/cdn.min.js";
  const { minifiedCdnBundle } = await esbuild.build(buildConfig);
};

const moduleBuild = async () => {
  const buildConfig = {
    entryPoints: ["src/index.js"],
    outfile: "dist/module.js",
    bundle: true,
    platform: "neutral",
    mainFields: ["module", "main"],
  };
  const { moduleBundle } = await esbuild.build(buildConfig);
  buildConfig.minify = true;
  buildConfig.outfile = "dist/module.min.js";
  const { minifiedModuleBundle } = await esbuild.build(buildConfig);
};

const nativeBrowserBuild = async () => {
  //get list of files in src directory
  const files = await fs.readdir("src");
  /**
   * @type {esbuild.BuildOptions}
   */
  const buildConfig = {
    entryPoints: files.map((filename) => `src/${filename}`),
    outdir: "dist/vvv-native-minified",
    outExtension: { ".js": ".min.js" },
    minify: true,
    bundle: true,
    platform: "neutral",
    mainFields: ["module", "main"],
  };
  await esbuild.build(buildConfig);
  await fs.mkdir("dist/vvv-native");
  //copy files to dist/vvv-native directory
  for (const file of files) {
    const srcPath = `src/${file}`;
    const distPath = `dist/vvv-native/${file}`;
    fs.copyFile(srcPath, distPath);
  }
};

const build = () => {
  cdnBuild();
  moduleBuild();
  nativeBrowserBuild();
};

build();
