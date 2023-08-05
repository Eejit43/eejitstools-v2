import { build } from 'esbuild';
import postcss from 'esbuild-postcss';
import { glob } from 'glob';

const banner = { js: '// This file was automatically compiled from TypeScript. View the original file for a more human-readable version.\n', css: '/* This file was automatically compiled from modern CSS. View the original file for a more human-readable version. */\n' };

/**
 * Compiles all TypeScript files into JavaScript.
 */
export async function compileTypescript() {
    return Promise.all([
        build({ entryPoints: await glob('data/*.ts'), outdir: 'data', platform: 'node', format: 'esm', target: 'node20', sourcemap: true, banner }), //
        build({ entryPoints: await glob('scripts/*.ts'), outdir: 'scripts', platform: 'browser', format: 'esm', target: 'es2017', sourcemap: true, banner }),
        ...(await glob('scripts/pages/**/*.ts')).map((path) => build({ entryPoints: [path], outfile: path.replace('.ts', '.js'), platform: 'browser', format: 'esm', target: 'es2017', supported: { 'top-level-await': true }, sourcemap: true, banner })),
        ...['app', 'development', 'apod-fetcher'].map((name) => build({ entryPoints: [`${name}.ts`], outfile: `${name}.js`, platform: 'node', format: 'esm', target: 'node20', sourcemap: true, banner })),

        build({ entryPoints: await glob('styles/*.css'), outdir: 'public/styles', plugins: [postcss()], sourcemap: true, banner }),
        ...(await glob('styles/pages/**/*.css')).map((path) => build({ entryPoints: [path], outfile: path.replace('styles/pages', 'public/styles/pages'), plugins: [postcss()], sourcemap: true, banner }))
    ]);
}

await compileTypescript();
