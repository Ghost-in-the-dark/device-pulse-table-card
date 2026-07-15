import esbuild from "esbuild";
import "dotenv/config";
import fs from "fs";
import path from "path";

const watch = process.argv.includes("--watch");
const dev = process.argv.includes("--dev");

const srcDir = "src";
const outDir = dev ? process.env.BUILD_DEV_PATH : "dist";
const file = "device-pulse-table-card";

function ensureOutDir() {
    if (!outDir) {
        throw new Error("BUILD_DEV_PATH is required in .env when building with --dev");
    }

    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }
}

function copyCSS() {
    const srcPath = path.join(srcDir, `${file}-style.js`);
    const destPath = path.join(outDir, `${file}-style.js`);
    fs.copyFileSync(srcPath, destPath);
    console.log(`CSS copied in ${destPath}`);
}

async function build() {
    ensureOutDir();

    console.log("Building from:", process.cwd());
    console.log("Src File", path.join(srcDir, `${file}.js`));
    console.log("Output Dir:", outDir);

    const context = await esbuild.context({
        entryPoints: [path.join(srcDir, `${file}.js`)],
        bundle: false,
        minify: ! dev,
        sourcemap: dev,
        outfile: path.join(outDir, `${file}.js`),
    });

    await context.rebuild();

    copyCSS();

    if (watch) {
        await context.watch();
    }
    else {
        await context.dispose();
    }

    console.log(watch ? "Watch Mode Active" : "Build Completed");
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
