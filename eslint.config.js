// @ts-check

import importAlias from '@dword-design/eslint-plugin-import-alias';
import sharedConfig from '@eejit/eslint-config-typescript';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig(
    sharedConfig,
    {
        languageOptions: { parserOptions: { project: ['./tsconfig.json', './src/public/tsconfig.json'] } },
    },
    globalIgnores(['eslint.config.js', 'src/public/scripts/external/*.js']),
    importAlias.configs.recommended,
    {
        rules: {
            '@dword-design/import-alias/prefer-alias': ['error', { aliasForSubpaths: true }],
        },
    },
);
