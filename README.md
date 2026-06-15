# CNO Blocks

A group of native blocks for the CNO Site.

## About the Repo

### PHP

-   This repo uses autoloading for PHP file inclusion. Run `composer dump-autoload` each time you add a new PHP file.
-   This repo uses layered architecture. Talk to AI about if you don't understand it, but try to keep things clean and keep all classes namespaced!

### JS/CSS/Webpack

This repo makes use of aliases for quick navigation to key folders (right now, `@shared/*` points to `src/blocks/_shared/*`) in JS/TS. SCSS doesn't support this property, so you'll still need to use relative paths to import any shared code.

This repo also supports concurrent builds of classic and interactive blocks, so the `webpack.config.mjs` file looks a little different. If you need editor scripts, place them in `src/editor` and add them to the `addEditorEntry.entry` function that returns `{...entries,['folder/'filename']:path.resolve(__dirname,'entry.ts')` and enqueue it properly in the Plugin_Loader.

## Getting Started

1. `npm install`
2. `composer install`
3. `npm run start`
