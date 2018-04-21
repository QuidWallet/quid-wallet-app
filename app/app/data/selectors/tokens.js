import { createSelector } from 'reselect';

export const getTokensDct = state => state.config.tokens.tokens;

export const getTokensList = createSelector(
    [getTokensDct], 
    (tokensDct) => {
	return Object.keys(tokensDct).map(tokenAddr => {
	    const token = tokensDct[tokenAddr];
	    token.contractAddress = tokenAddr;
	    return token;
	});
    }
)
