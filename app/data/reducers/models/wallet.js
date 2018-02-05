import { attr, Model } from 'redux-orm';
import { actions } from 'quid-wallet/app/actions/wallet';


export default class Wallet extends Model {
    static modelName = 'Wallet';
    static fields = {
	id: attr(),
	address: attr(),
	name: attr(),
	walletType: attr(),
	icon: attr()
    }
    options = {
	idAttribute: 'address',
    };
    
    static reducer(action, model) {
	switch (action.type) {
	case actions.LINK_WATCH_WALLET: {
	    const { address, icon } = action.payload;
	    if (!model.hasId(address)) {
		return model.create({
		    id: address,
		    address,
		    icon: icon,
		    name: address,
		    walletType: 'WATCH_WALLET'
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
