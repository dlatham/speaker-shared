import React from 'react';
import { View, Text } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from "react-native-flash-message";

export class AlertComponent extends React.Component {

	// static options = {
	// 	layout: {
	// 		componentBackgroundColor: 'transparent',
	// 	},
	// 	overlay: {
	// 		interceptTouchOutside: false,
	// 	},
	// };

	componentDidUpdate(){
		if(this.props.alert){
			showMessage(this.props.alert);
		}
	}

	alert(message){
		return showMessage({message: message, type: 'success'});
	}

	render(){
		return (
			<View>
				<FlashMessage position="top" icon="auto" hideStatusBar={true} />
			</View>
		);
	}
};