import { build } from 'esbuild';
import { glob } from 'glob';

const banner = { js: '// This file was automatically compiled from TypeScript. View the original file for a more human-readable version.\n', css: '/* This file was automatically compiled from SCSS. View the original file for a more human-readable version. */\n' };

export async function compileTypescript() {
    return Promise.all([
        build({ entryPoints: await glob('data/*.ts'), outdir: 'data', platform: 'node', format: 'esm', target: 'node20', banner }), //
        build({ entryPoints: await glob('scripts/*.ts'), outdir: 'scripts', platform: 'browser', format: 'esm', target: 'es2017', banner }),
        ...(await glob('scripts/pages/**/*.ts')).map((path) => build({ entryPoints: [path], outfile: path.replace('.ts', '.js'), platform: 'browser', format: 'esm', target: 'es2017', supported: { 'top-level-await': true }, banner })), // eslint-disable-line @typescript-eslint/naming-convention
        ...['app', 'dev', 'apod-fetcher'].map((name) => build({ entryPoints: [`${name}.ts`], outfile: `${name}.js`, platform: 'node', format: 'esm', target: 'node20', banner }))
    ]);
}

compileTypescript();
