import { attr, Model } from 'redux-orm';
import { actions } from 'quid-wallet/app/actions/wallet';


export default class Wallet extends Model {
    static modelName = 'Wallet';
    static fields = {
	id: attr(),
	address: attr(),
	name: attr(),
	walletType: attr(),
	icon: attr(),
	keystore: attr()
    }
    options = {
	idAttribute: 'address',
    };
    
    static reducer(action, model) {
	switch (action.type) {
	case actions.ADD_WALLET: {
	    const {
		address, icon, name,
		walletType, keystore } = action.payload;
	    if (!model.hasId(address)) {
		return model.create({
		    id: address,
		    address,
		    icon,
		    name,
		    walletType,
		    keystore
		});
	    }
	    return undefined;
	}
	case actions.UNLINK_WALLET: {
	    return model.withId(action.payload.address).delete();
	}
	default:
	    return undefined;
	}
    }
}
