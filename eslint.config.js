// @ts-check

import sharedConfig from '@eejit/eslint-config-typescript';
import typescriptEslint from 'typescript-eslint';

export default typescriptEslint.config(sharedConfig, {
    languageOptions: { parserOptions: { project: ['./tsconfig.json', './src/public/tsconfig.json'] } },
});
