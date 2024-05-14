<div align="center">

<h1>Cartable</h1>
<p>A fast, zero-config toolkit to develop node.js applications.</p>

[![npm version](https://img.shields.io/npm/v/@cartable/core.svg)](https://www.npmjs.com/package/@cartable/core)

</div>

Cartable aims to provide you the best DX to develop your node.js applications. It's focused on server-only applications. Heavily inspired by [backpack](https://github.com/jaredpalmer/backpack), the idea is a zero-config tool giving you all the tools you need. You can use it for new apps as well as existing ones.

## Features

- [TypeScript](https://github.com/microsoft/TypeScript) support out of the box
- Fast, using [rspack](https://www.rspack.dev/) and [swc](https://github.com/swc-project/swc)
- Great DX, readable error messages, live reloading etc
- Fast tests with [jest](https://github.com/facebook/jest) and [swc](https://github.com/swc-project/swc)
- Zero-config, one dependency
- Easily customizable

## Documentation

- [Installation](#installation)
- [Usage](#usage)
  - [Using in development](#using-in-development)
  - [Building for Production](#building-for-production)
  - [Testing your application](#testing-your-application)
- [Configuration](#configuration)
  - [Customizing rspack config](#customizing-rspack-config)
  - [Customizing swc config](#customizing-swc-config)
- [Commands](#commands)
  - [`cartable dev`](#cartable-dev)
  - [`cartable build`](#cartable-build)
  - [`cartable test`](#cartable-test)
- [Inspiration](#inspiration)
- [License](#license)

## Installation

Install the package:

```sh
# with npm
npm install --save-dev @cartable/core

# with yarn
yarn add --dev @cartable/core

# with pnpm
pnpm add --save-dev @cartable/core
```

Add the cartable scripts to your package.json like this:

```json
{
  "scripts": {
    "dev": "cartable",
    "build": "cartable build",
    "test": "cartable test"
  }
}
```

## Usage

### Using in development

Run the dev command that will reload your server when you edit:

```
npm run dev
```

Successful builds will show a console like this. _Note: screenshot taken from running the [basic typescript example](https://github.com/pradel/cartable/tree/master/examples/basic-typescript)._

![Dev mode](assets/dev-mode.png)

### Building for Production

Run the build command and start your app:

```bash
npm run build
node ./dist/index.js
```

### Testing your application

Runs your tests using Jest:

```bash
npm run test
```

## Configuration

### Customizing rspack config

To extend rspack, you can define a function that extends its config via `cartable.config.js`.

```js
// cartable.config.js
module.exports = {
  rspack: (config) => {
    // Perform customizations to config
    // Important: return the modified config
    return config;
  },
};
```

### Customizing swc config

To extend our usage of `swc`, you can define a `.swcrc` file at the root of your app. This file is optional.

If found, cartable will consider it to be the _source of truth_.

Here's an example `.swcrc` file:

```json
{
  "jsc": {
    "target": "es2020",
    "parser": {
      "syntax": "typescript"
    }
  }
}
```

## Commands

### `cartable dev`

Runs cartable in development mode.
Your code will reload if you make edits.

### `cartable build`

Builds the app for production to the `dist` folder.
It correctly bundles your production mode and optimizes the build for the best performance.

You can run your production application with the following command:

```sh
node ./dist/index.js
```

### `cartable test`

Test the app with jest. For better performance, compiling the JavaScript / TypeScript code is done via swc.

You can pass any option to jest, for example to generate coverage:

```sh
cartable test --coverage
```

## Inspiration

- [jaredpalmer/backpack](https://github.com/jaredpalmer/backpack) - First version of Cartable is a modified version of backpack.
- [zeit/next.js](https://github.com/zeit/next.js)
- [jaredpalmer/tsdx](https://github.com/jaredpalmer/tsdx)

## License

MIT License © [Léo Pradel](https://www.leopradel.com/)
