import { attr, Model } from 'redux-orm';
import { actions } from 'quid-wallet/app/actions/transactions';
import { actions as walletActions } from 'quid-wallet/app/actions/wallet';


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

    static createFromParams(params) {
	const id = this.generateId(params);
	return {
	    ...params,
	    id
	};
    }
    
    static generateId({txHash, address, tokenAddress, direction}) {
	return [txHash, address, tokenAddress, direction].join('-');
    }
    
    static reducer(action, model) {
	switch (action.type) {
	case actions.CREATE_ASSET_TRANSFERS: {
	    const transfers = action.payload;
	    transfers.map(transfer => {
		if (!model.hasId(transfer.id)) {
		    return model.create(transfer);
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
