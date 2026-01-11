import { type BuildOptions, build } from 'esbuild';
import postcss from 'esbuild-postcss';
import { cpSync } from 'node:fs';
import { replaceTscAliasPaths } from 'tsc-alias';

const banner = {
    js: '// This file was automatically compiled from TypeScript. View the original file for a more human-readable version.\n',
    css: '/* This file was automatically compiled from modern CSS. View the original file for a more human-readable version. */\n',
};

const buildParameters: Record<string, BuildOptions> = {
    node: { platform: 'node', format: 'esm', sourcemap: true, banner },
    browser: { platform: 'browser', format: 'esm', sourcemap: true, banner },
    css: { plugins: [postcss()], sourcemap: true, banner },
};

/**
 * Compiles all TypeScript files into JavaScript.
 */
export async function compileTypescript() {
    // Compile TypeScript
    await Promise.all([
        // Main files
        build({ entryPoints: ['development.ts'], outfile: 'development.js', ...buildParameters.node }),
        build({ entryPoints: ['src/app.ts'], outfile: 'dist/app.js', ...buildParameters.node }),
        build({ entryPoints: ['src/route-handlers/*.ts'], outdir: 'dist/route-handlers', ...buildParameters.node }),

        // Data and scripts
        build({ entryPoints: ['src/public/data/*.ts'], outdir: 'dist/public/data', ...buildParameters.browser }),
        build({ entryPoints: ['src/public/scripts/*.ts'], outdir: 'dist/public/scripts', ...buildParameters.browser }),
        build({ entryPoints: ['src/public/scripts/pages/**/*.ts'], outdir: 'dist/public/scripts/pages', ...buildParameters.browser }),

        // CSS
        build({ entryPoints: ['src/public/styles/*.css'], outdir: 'dist/public/styles', ...buildParameters.css }),
        build({ entryPoints: ['src/public/styles/pages/**/*.css'], outdir: 'dist/public/styles/pages', ...buildParameters.css }),
    ]);

    // Resolve aliased imports
    await Promise.all([
        replaceTscAliasPaths({ configFile: 'tsconfig.json', outDir: './' }),
        replaceTscAliasPaths({ configFile: './src/public/tsconfig.json', outDir: 'dist' }),
    ]);

    // Copy views folder
    cpSync('src/views', 'dist/views', { recursive: true });

    // Copy external scripts/styles
    cpSync('src/public/scripts/external', 'dist/public/scripts/external', { recursive: true });
    cpSync('src/public/styles/external', 'dist/public/styles/external', { recursive: true });

    // Copy files folder
    cpSync('src/public/files', 'dist/public/files', { recursive: true });

    // Copy favicons folder
    cpSync('src/public/favicons', 'dist/public/favicons', { recursive: true });
    cpSync('src/public/apple-touch-icon.png', 'dist/public/apple-touch-icon.png');
    cpSync('src/public/favicon.ico', 'dist/public/favicon.ico');
}

await compileTypescript();
