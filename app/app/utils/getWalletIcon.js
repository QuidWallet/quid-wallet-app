export const getWalletIcon = (icon) => {    
    switch (icon) { 
    case 'turtle':
	return require('quid-wallet/app/views/assets/icons/wallet_icons/unselected/icon_wallet_avatar_turtle_nonactive.png');
    case 'gorilla':
	return require('quid-wallet/app/views/assets/icons/wallet_icons/unselected/icon_wallet_avatar_gorilla_nonactive.png');
    case 'fox':
	return require('quid-wallet/app/views/assets/icons/wallet_icons/unselected/icon_wallet_avatar_fox_nonactive.png');
    case 'deer':
	return require('quid-wallet/app/views/assets/icons/wallet_icons/unselected/icon_wallet_avatar_deer_nonactive.png');
    case 'dog':
	return require('quid-wallet/app/views/assets/icons/wallet_icons/unselected/icon_wallet_avatar_dog_nonactive.png');
    case 'crab':
	return require('quid-wallet/app/views/assets/icons/wallet_icons/unselected/icon_wallet_avatar_crab_nonactive.png');		
    default:
	return require('quid-wallet/app/views/assets/icons/wallet_icons/unselected/icon_wallet_avatar_crab_nonactive.png');
    }    
};

