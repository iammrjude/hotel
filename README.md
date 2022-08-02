# HOTEL

This is a smart contract of a Hotel whereby customers can book a room in the Hotel
by sending ether to the contract.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
REPORT_GAS=true npx hardhat test
npx hardhat coverage
npx hardhat run scripts/deploy.js
node scripts/deploy.js
npx eslint '**/*.js'
npx eslint '**/*.js' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

### Start coding

#### Setup

```
git clone https://github.com/iammrjude/hotel.git
cd hotel
yarn
```

#### Local environment

```
npx hardhat node
```

#### Testing

```
yarn test
```

#### Linting

```
yarn lint
```

#### Coverage

```
yarn coverage
```

### Cleaning

```
yarn clean
```
