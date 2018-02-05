import { ORM, createReducer } from 'redux-orm';
import Wallet from './wallet';
import AssetTransfer from './assetTransfer';


export const schema = new ORM();

schema.register(
    Wallet,
    AssetTransfer
);


export default createReducer(schema);
