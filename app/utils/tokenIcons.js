import { PixelRatio } from 'react-native';


const getTokenIconPath = (contractAddress) => {
    let path;
    const densityMultiplier = Math.floor(PixelRatio.get());
    let densitySuffix = '';
    if ((densityMultiplier === 2) ||
	(densityMultiplier === 3)
       ) {
	densitySuffix = `@${densityMultiplier}x`;
    }

    // if ether
    if (contractAddress === '0x000_ether') {
	path = require('quid-wallet/app/views/assets/icons/ether.jpg');
    } else if (contractAddress && contractAddress.length > 10) {
	const url = `https://raw.githubusercontent.com/QuidWallet/erc20-tokens-list/master/result/tokens/icons/${contractAddress}${densitySuffix}.png`;
	path = {uri: url};
    }

    return path;
};


export default getTokenIconPath;
