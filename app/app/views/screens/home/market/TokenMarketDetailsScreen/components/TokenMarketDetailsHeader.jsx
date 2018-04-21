import React from 'react';
import {
    Text, View,
    TouchableOpacity, Image } from 'react-native';
import { TokenRow } from 'quid-wallet/app/views/screens/home/market/TokenMarketDetailsScreen/components/TokenRow';
import NumberFormat from 'react-number-format';
import { toFixed } from 'quid-wallet/app/utils';
import PortfolioQuantityFormatted from 'quid-wallet/app/views/screens/home/portfolio/components/PortfolioQuantityFormatted';


const TokenMarketDetailsHeader = (props) => {
    return (	
        <View>
            <View style={{ flex: 5 }}>
		<View style={{ flex: 2, alignItems: 'flex-start', paddingTop: 20, marginBottom: 20 }}>
		    <TokenRow token={props.token} currency={props.currency}/>
		</View>
		
		<View style={{ flex: 1, marginLeft: 10 }}>
		    <TouchableOpacity onPress={() => { props.toggleFavoriteToken(props.token.contractAddress); }}>
			<View style={{ flexDirection: 'row', marginBottom: 20 }}>
			    <Image
				style={{ marginRight: 10 }}
				source={require('quid-wallet/app/views/assets/icons/icon_favorite.png')} />
			    <Text style={{ fontWeight: 'bold', color: "#FECB2E" }}>{props.token.isFavorite ? "Remove from favorites" : "Add to favorites"}</Text>
			</View>
		    </TouchableOpacity>
		</View>
		<View style={{ flex: 1, paddingBottom: 20, marginTop: 10, marginLeft: 15 }}>
		    <View style={{ flex: 2, marginBottom: 10 }}>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
			    <View style={{ flex: 1 }}>
				<Text style={{ color: "#24283666", fontSize: 11 }}>Market Cap</Text>
			    </View>
			    <View style={{ flex: 1 }}>
                    </View>
			</View>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>		  
			    <View style={{ flex: 1 }}>
				<PortfolioQuantityFormatted style={{ fontSize: 12, fontWeight: 'bold' }} value={props.token.marketCap} precision={2} currency={props.currency}/>  
			    </View>
			    <View style={{ flex: 1}}>
			    </View>
			</View>
		    </View>
		    <View style={{ flex: 2 }}>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
			    <View style={{ flex: 1 }}>
				<Text style={{ color: "#24283666", fontSize: 11 }}>Circulating supply</Text>
			    </View>
			    <View style={{ flex: 1 }}>
				<Text style={{ color: "#24283666", fontSize: 11 }}>Total supply</Text>
			    </View>
			</View>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
			    <View style={{ flex: 1}}>		    
				<NumberFormat value={toFixed(props.token.available_supply, 0)} displayType={'text'} thousandSeparator={' '} renderText={(formattedValue) => <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{formattedValue}</Text>} decimalScale={0}/>
			    </View>
			    <View style={{ flex: 1}}>
				<NumberFormat value={toFixed(props.token.total_supply, 0)} displayType={'text'} thousandSeparator={' '} renderText={(formattedValue) => <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{formattedValue}</Text>} decimalScale={0}/>
			    </View>
			</View>
		    </View>
		</View>
	    </View>
	    
	    <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 20, marginLeft: 15 }}>
		<View style={{ flex: 1 }}>
		    <Text style={{ color: "#24283666", fontSize: 15 }}>Date</Text>
		</View>
		<View style={{ flex: 1 }}>
		    <Text style={{ color: "#24283666", fontSize: 15}}>Price</Text>
		</View>
		<View style={{ flex: 1 }}>
		    <Text style={{ color: "#24283666", fontSize: 15 }}>Market Cap</Text>
		</View>
	    </View>
	</View>    
    );
}


export default TokenMarketDetailsHeader;
