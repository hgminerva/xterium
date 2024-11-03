export class Asset {
    assetType: string; // Native, Asset, Contract (XON20), NFT
    network: string; // Xode, Kusama, Polkadot, etc.
    networkId: string
    symbol: string;
    description: string;
}