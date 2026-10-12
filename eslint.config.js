// @ts-check

import importAlias from '@dword-design/eslint-plugin-import-alias';
import sharedConfig from '@eejit/eslint-config-typescript';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';

export default defineConfig(
    sharedConfig,
    globalIgnores(['src/public/scripts/external/*.js']),
    {
        languageOptions: {
            parserOptions: { project: ['./tsconfig.json', './src/public/tsconfig.json'] },
            globals: globals.browser,
        },
    },
    importAlias.configs.recommended,
    {
        rules: {
            'unicorn/no-top-level-assignment-in-function': 'off',

            '@dword-design/import-alias/prefer-alias': ['error', { aliasForSubpaths: true }],
        },
    },
);
