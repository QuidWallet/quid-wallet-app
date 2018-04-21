import React from 'react';
import { connect } from 'react-redux';
import { Text, TouchableOpacity } from 'react-native';
import { toggleHiddenBalance } from 'quid-wallet/app/actions/app';


const HideBalanceToggle = ({children, toggleHiddenBalance, isBalanceHidden, hiddenTextStyle}) => {    
    return (
        <TouchableOpacity onPress={() => toggleHiddenBalance()}>
          { isBalanceHidden ? <Text style={hiddenTextStyle}>Balances Hidden</Text> : children } 
        </TouchableOpacity>
    );
}


export default connect((state) => ({
    isBalanceHidden: state.data.balanceHidden
}), { toggleHiddenBalance})(HideBalanceToggle);
