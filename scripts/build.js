const esbuild = require("esbuild");
const fs = require("fs/promises");
const path = require("path");

const cdnBuild = async () => {
  const buildConfig = {
    entryPoints: ["src/index.js"],
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
    define: { MODULE: true },
  };
  const { moduleBundle } = await esbuild.build(buildConfig);
  buildConfig.minify = true;
  buildConfig.outfile = "dist/module.min.js";
  const { minifiedModuleBundle } = await esbuild.build(buildConfig);
};

const build = () => {
  cdnBuild();
  moduleBuild();
};

build();
