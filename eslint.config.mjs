import wordpress from '@wordpress/eslint-plugin';
import { includeIgnoreFile } from '@eslint/compat';
import { defineConfig } from 'eslint/config';
import { fileURLToPath, URL } from 'url';

const gitignorePath = fileURLToPath( new URL( '.gitignore', import.meta.url ) );
export default defineConfig( [
	includeIgnoreFile( gitignorePath, 'Ignore .gitignore files' ),
	...wordpress.configs.recommended,
	{
		files: [ 'src/**/*.{js,ts,jsx,tsx}' ],
		rules: {
			'@typescript-eslint/no-shadow': 'off',
			'jsdoc/require-param': 'off',
			'jsdoc/require-param-description': 'error',
			'jsdoc/require-param-name': 'off',
			'no-console': 'warn',
			'import/no-duplicates': 'error',
		},
	},
] );
