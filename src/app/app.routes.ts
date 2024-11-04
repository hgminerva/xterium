import { Routes } from '@angular/router';

import {NetworkComponent} from './modules/network/network';
import {AddressComponent} from './modules/address/address';
import {AddressDetailComponent} from './modules/address-detail/address-detail';
import {AssetComponent} from './modules/asset/asset';
import {AssetDetailComponent} from './modules/asset-detail/asset-detail';
import {BalanceComponent} from './modules/balance/balance';
import {TransferComponent} from './modules/transfer/transfer';

export const routes: Routes = [
    {
        path: 'network',
        component: NetworkComponent,
        title: 'Network',
    },    
    {
        path: 'address',
        component: AddressComponent,
        title: 'Address',
    },    
    {
        path: 'address-detail',
        component: AddressDetailComponent,
        title: 'Address Detail',
    },    
    {
        path: 'asset',
        component: AssetComponent,
        title: 'Asset',
    },    
    {
        path: 'asset-detail',
        component: AssetDetailComponent,
        title: 'Asset Detail',
    },    
    {
        path: 'balance',
        component: BalanceComponent,
        title: 'Balance',
    },    
    {
        path: 'transfer/:id',
        component: TransferComponent,
        title: 'Transfer',
    },    
];
