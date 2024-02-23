# hardhat-plugin

[Kriptonio](https://kriptonio.com/) plugin for [Hardhat](https://hardhat.org)

This plugin allows you to upload compiled hardhat smart contract artifacts to Kriptonio. On kriptonio side new smart contract will be created with attached artifacts, which you can afterward deploy and manage via kriptonio.

## Installation

```bash
npm install @kriptonio/hardhat-plugin
```

Import the plugin in your `hardhat.config.js`:

```js
require('@kriptonio/hardhat-plugin');
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import '@kriptonio/hardhat-plugin';
```

### TypeScript users

If you are using Hardhat with TypeScript, you need to add this to your `hardhat.config.ts`:

1. Set `target` to minimum `ES2020` or higher.
2. Add `ES2022` to your `lib`.

## Configuration

This plugin adds new configuration option in your hardhat config file, called `kriptonio`.

| option                 | Description                                                                                                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| access-token (required) | Kriptonio organization level access token. You can find it in your settings page.                                       |
| chainId (required)     | ID of the chain where you want to deploy your smart contract. List of supported blockchain networks with their chain IDs you can find [here](https://docs.kriptonio.com/sdk/introduction/supported-networks).                                       |
| contract (required)    | Smart contract name which you want to upload to kriptonio                                                                                                                   |
| title (optional)        | Title of kriptonio smart contract to be created. Defaults to contract name.                                                                                          |

Example of configuration via hardhat.config.ts

```js
const config: HardhatUserConfig = {
  kriptonio: {
    title: 'Token on Kriptonio',
    contract: 'MyERC20',
    accessToken: '<kriptonio-access-token>',
    chainId: 1
  },
  /** ...the rest of hardhat.config config file  */
};
```

## Usage

This plugin adds the `kriptonio-upload` task to Hardhat:

If you are providing configuration via CLI arguments

```bash
npx hardhat kriptonio-upload --contract <contract-name> --access-token <kriptonio-access-token> --chain-id <chain-id>
```

If you are providing configuration via hardhat.config file or if you want to provide configuration interactively

```bash
npx hardhat kriptonio-upload
```
