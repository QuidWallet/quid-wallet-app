import { createSelector } from 'reselect';
import { createSelector as createOrmSelector } from 'redux-orm';
import { schema } from 'quid-wallet/app/data/reducers/models';
import { getActiveWalletAddress } from './wallet';
import { formatUSDate } from 'quid-wallet/app/utils';


const ormSelector = state => state.orm;


export const getAllTransfers = createSelector(
    ormSelector,
    createOrmSelector(schema, session => ({
	transfers: session.AssetTransfer.all(),
	count: session.AssetTransfer.count()
    }))
);


export const getPendingTxs = createSelector(
    getAllTransfers,
    ({transfers}) => {
	return transfers.filter(transfer => (transfer.isPending)).toRefArray();				
    }
);


export const getAssetTransfers = createSelector(
    [	
	getAllTransfers,
	(state, props) => props.token.contractAddress,
	getActiveWalletAddress,
    ],
    ({transfers}, tokenAddress, address) => {
	return transfers.filter(transfer => (transfer.tokenAddress === tokenAddress &&
					     transfer.address === address)).orderBy('timestamp', ['desc']).toRefArray();
    }
);


// export const getAssetFlowByDate = createSelector(
//     getAssetTransfers,
//     (transfers) => {
// 	return transfers.reduce((dct, transfer) => {
// 	    const date = formatUSDate(new Date(transfer.timestamp*1000));
// 	    const dctCopy = {
// 		    ...dct		
// 	    };
// 	    dctCopy[date] = dctCopy[date] || 0;
// 	    const sign = (transfer.direction === 'IN') ? 1 : -1;
// 	    dctCopy[date] += sign * transfer.value;
// 	    return dctCopy;
// 	}, {});	
//     }
// );


