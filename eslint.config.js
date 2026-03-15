// @ts-check

import importAlias from '@dword-design/eslint-plugin-import-alias';
import sharedConfig from '@eejit/eslint-config-typescript';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig(
    sharedConfig,
    globalIgnores(['src/public/scripts/external/*.js']),
    {
        languageOptions: { parserOptions: { project: ['./tsconfig.json', './src/public/tsconfig.json'] } },
    },
    importAlias.configs.recommended,
    {
        rules: {
            '@dword-design/import-alias/prefer-alias': ['error', { aliasForSubpaths: true }],
        },
    },
);
