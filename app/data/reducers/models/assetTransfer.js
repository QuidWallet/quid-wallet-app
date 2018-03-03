import { attr, Model } from 'redux-orm';
import { actions } from 'quid-wallet/app/actions/transactions';
import { actions as walletActions } from 'quid-wallet/app/actions/wallet';

// TODO move to constants.js
const ETHER_ASSET_DUMMY_ADDRESS = '0x000_ether';


export const generateAssetTransferId = ({txHash, address, tokenAddress, direction}) => {
    return [txHash, address, tokenAddress, direction].join('-');
}


export default class AssetTransfer extends Model {
    static modelName = 'AssetTransfer';
    static fields = {
	id: attr(),
	txHash: attr(),
	address: attr(),
	tokenAddress: attr(),
	timestamp: attr(),
	blockNumber: attr(),
	counterpartyAddress: attr(),
	direction: attr(),
	value: attr(),
	rawValue: attr(),
	success: attr()
    }
    
    static reducer(action, model) {
	switch (action.type) {
	case actions.CREATE_ASSET_TRANSFERS: {
	    const transfers = action.payload;
	    transfers.map(transfer => {
		if (!model.hasId(transfer.id)) {
		    model.create(transfer);

		    // saving only last n transactions to memory
		    // only for ether txs
		    if (transfer.tokenAddress !== ETHER_ASSET_DUMMY_ADDRESS) { return null }
		    
		    const addressTxs = model.filter((t) => t.address === transfer.address && t.tokenAddress === ETHER_ASSET_DUMMY_ADDRESS);
		    // TODO move cache limit to constants
		    if (addressTxs.count() > 50) {
			const sortedTxs = addressTxs.toRefArray().sort((a, b) => a.blockNumber - b.blockNumber);
			const tx = sortedTxs[0];			
			model.withId(tx.id).delete();
		    };
		}
	    });
	    return undefined;
	}
	case actions.DELETE_ASSET_TRANSFER: {
            return model.withId(action.payload).delete();	    
	}
	case walletActions.UNLINK_WALLET: {
	    const address = action.payload.address;
            return model.filter((tx) => tx.address === address).all().delete();
	}
	    
	default:
	    return undefined;
	}
    }
}
