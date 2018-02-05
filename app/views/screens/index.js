import { Navigation } from 'react-native-navigation';
import AddWalletScreen from './start/AddWalletScreen';
import WalletScreen from './home/wallet/WalletScreen';
import WalletScreenDrawer from './home/wallet/components/WalletDrawer';
import UnlinkWalletScreen from './home/wallet/settings/unlink/UnlinkWalletScreen';
import CurrenciesSettingsScreen from './home/wallet/settings/currencies/CurrenciesSettingsScreen';
import PortfolioScreen from './home/portfolio/positions/PositionsScreen';
import TransactionRecordScreen from './home/wallet/history/transactionRecord/TransactionRecordScreen.jsx';
import MarketScreen from './home/exchange/all/AllTokensMarketScreen';
import WalletHistoryScreen from './home/wallet/history/HistoryScreen';
import WalletSettingsScreen from './home/wallet/settings/SettingsScreen';
import AboutScreen from './home/wallet/settings/about';
import WebviewScreen from './home/wallet/settings/WebviewScreen';
import NotificationComponent from 'quid-wallet/app/views/components/Notification';
import AssetDetailsScreen from './home/exchange/AssetDetailsScreen.jsx';
import CurrencySwitcherIcon from 'quid-wallet/app/views/components/currency-switcher/CurrencySwitcherIcon';


export default (store, Provider) => {
    // SCREENS
    Navigation.registerComponent('quidwallet.start.Splash', () => SplashScreen, store, Provider);
    Navigation.registerComponent('quidwallet.start.AddWallet', () => AddWalletScreen, store, Provider);
    Navigation.registerComponent('quidwallet.home.wallet.WalletScreen', () => WalletScreen, store, Provider);
    Navigation.registerComponent('quidwallet.home.wallet.WalletScreen.Drawer', () => WalletScreenDrawer, store, Provider);
    Navigation.registerComponent('quidwallet.home.wallet.WalletSettingsScreen', () => WalletSettingsScreen, store, Provider);            
    Navigation.registerComponent('quidwallet.home.wallet.settings.UnlinkWalletScreen', () => UnlinkWalletScreen, store, Provider);            
    Navigation.registerComponent('quidwallet.home.wallet.settings.CurrenciesSettingsScreen', () => CurrenciesSettingsScreen, store, Provider);
    Navigation.registerComponent('quidwallet.home.wallet.history.WalletHistoryScreen', () => WalletHistoryScreen, store, Provider);                
    Navigation.registerComponent('quidwallet.home.portfolio.PortfolioScreen', () => PortfolioScreen, store, Provider);  
    Navigation.registerComponent('quidwallet.home.exchange.MarketScreen', () => MarketScreen, store, Provider);
    Navigation.registerComponent('quidwallet.home.exchange.AssetDetailsScreen', () => AssetDetailsScreen, store, Provider);
    Navigation.registerComponent('quidwallet.home.wallet.history.TransactionRecordScreen', () => TransactionRecordScreen, store, Provider);
    Navigation.registerComponent('quidwallet.home.wallet.settings.AboutScreen', () => AboutScreen, store, Provider);
    Navigation.registerComponent('quidwallet.home.wallet.settings.WebviewScreen', () => WebviewScreen, store, Provider);

    
    // COMPONENTS
    Navigation.registerComponent('quidwallet.components.Notification', () => NotificationComponent);
    Navigation.registerComponent('quidwallet.components.CurrencySwitcherIcon', () => CurrencySwitcherIcon, store, Provider);    
};
