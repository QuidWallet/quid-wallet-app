import { Navigation } from 'react-native-navigation';
//import AddWalletScreen from './start/AddWalletScreen';
import AddWatchWalletScreen from './start/AddWalletScreen/AddWatchWalletScreen';
//import CreateWalletScreen from './start/AddWalletScreen/CreateWalletScreen';
// import ImportPrivateKeyScreen from './start/AddWalletScreen/ImportPrivateKeyScreen';
// import ImportKeystoreScreen from './start/AddWalletScreen/ImportKeystoreScreen';
import WalletScreen from './home/wallet/WalletScreen';
import WalletScreenDrawer from './home/wallet/components/WalletDrawer';
import UnlinkWalletScreen from './home/wallet/settings/unlink/UnlinkWalletScreen';
import CurrenciesSettingsScreen from './home/wallet/settings/currencies/CurrenciesSettingsScreen';
import TokensListScreen from './home/wallet/settings/tokens/TokensListScreen';
import NotificationSettingsScreen from './home/wallet/settings/notifications/NotificationSettingsScreen';
import PortfolioScreen from './home/portfolio/PortfolioScreen';

import MarketScreen from './home/market/MarketScreen';

import WalletHistoryScreen from './home/wallet/history/HistoryScreen';
import TransactionRecordScreen from './home/wallet/history/transactionRecord/TransactionRecordScreen';
import WalletReceiveScreen from './home/wallet/history/Receive/ReceiveScreen';
import WalletSendScreen from './home/wallet/history/Send/SendScreen';
import WalletSendConfirmScreen from './home/wallet/history/Send/ConfirmScreen';


import WalletSettingsScreen from './home/wallet/settings/SettingsScreen';
import AboutScreen from './home/wallet/settings/about';
import WebviewScreen from './home/wallet/settings/WebviewScreen';
import NotificationComponent from 'quid-wallet/app/views/components/Notification';
import TokenMarketDetailsScreen from './home/market/TokenMarketDetailsScreen/TokenMarketDetailsScreen';
import CurrencySwitcherIcon from 'quid-wallet/app/views/components/currency-switcher/CurrencySwitcherIcon';


export default (store, Provider) => {
    // SCREENS
    Navigation.registerComponent('quidwallet.start.AddWallet', () => AddWatchWalletScreen, store, Provider);
    //Navigation.registerComponent('quidwallet.start.AddWallet.AddWatchWallet', () => AddWatchWalletScreen, store, Provider);
    // Navigation.registerComponent('quidwallet.start.AddWallet.CreateWallet', () => CreateWalletScreen, store, Provider);
    // Navigation.registerComponent('quidwallet.start.AddWallet.ImportPrivateKey', () => ImportPrivateKeyScreen, store, Provider);
    // Navigation.registerComponent('quidwallet.start.AddWallet.ImportKeystore', () => ImportKeystoreScreen, store, Provider);                

    Navigation.registerComponent('quidwallet.home.wallet.WalletScreen', () => WalletScreen, store, Provider);
    Navigation.registerComponent('quidwallet.home.wallet.WalletScreen.Drawer', () => WalletScreenDrawer, store, Provider);
    Navigation.registerComponent('quidwallet.home.wallet.WalletSettingsScreen', () => WalletSettingsScreen, store, Provider);            
    Navigation.registerComponent('quidwallet.home.wallet.settings.UnlinkWalletScreen', () => UnlinkWalletScreen, store, Provider);            
    Navigation.registerComponent('quidwallet.home.wallet.settings.CurrenciesSettingsScreen', () => CurrenciesSettingsScreen, store, Provider);
    Navigation.registerComponent('quidwallet.home.wallet.settings.TokensListScreen', () => TokensListScreen, store, Provider);
    Navigation.registerComponent('quidwallet.home.wallet.settings.NotificationSettingsScreen', () => NotificationSettingsScreen, store, Provider);
    
    Navigation.registerComponent('quidwallet.home.wallet.history.WalletHistoryScreen', () => WalletHistoryScreen, store, Provider);
    Navigation.registerComponent('quidwallet.home.wallet.receive.WalletReceiveScreen', () => WalletReceiveScreen, store, Provider);
    Navigation.registerComponent('quidwallet.home.wallet.send.WalletSendScreen', () => WalletSendScreen, store, Provider);
    Navigation.registerComponent('quidwallet.home.wallet.send.WalletSendConfirmScreen', () => WalletSendConfirmScreen, store, Provider);                            

    
    Navigation.registerComponent('quidwallet.home.portfolio.PortfolioScreen', () => PortfolioScreen, store, Provider);  
    Navigation.registerComponent('quidwallet.home.market.MarketScreen', () => MarketScreen, store, Provider);
    Navigation.registerComponent('quidwallet.home.market.TokenMarketDetailsScreen', () => TokenMarketDetailsScreen, store, Provider);

    Navigation.registerComponent('quidwallet.home.wallet.history.TransactionRecordScreen', () => TransactionRecordScreen, store, Provider);
    Navigation.registerComponent('quidwallet.home.wallet.settings.AboutScreen', () => AboutScreen, store, Provider);
    Navigation.registerComponent('quidwallet.home.wallet.settings.WebviewScreen', () => WebviewScreen, store, Provider);

    
    // COMPONENTS
    Navigation.registerComponent('quidwallet.components.Notification', () => NotificationComponent);
    Navigation.registerComponent('quidwallet.components.CurrencySwitcherIcon', () => CurrencySwitcherIcon, store, Provider);    
};
