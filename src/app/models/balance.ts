import { u128 } from '@polkadot/types';

export class Balance {
    assetType: string; // Native, Asset, Contract (XON20), NFT
    symbol: string;
    description: string;
    free: string;
    reserved: string;
}