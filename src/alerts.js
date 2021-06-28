import React from'react';
import { View, Text } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from "react-native-flash-message";
import { connect, useSelector } from 'react-redux';


export const success = ({message, description=null}) => {
	console.log("Dispatching new success");
	return {
		type: 'ALERT_SUCCESS',
		message: message,
		description: description
	}
}

export const danger = ({message, description=null}) => {
	console.log("Danger alert requested")
	return {
		type: 'ALERT_DANGER',
		message: message,
		description: description
	}
}


class AlertComponent extends React.Component {

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


const dispatch = (dispatch, ownProps = {}) => {
	return {
		danger: (message, description=null)=> dispatch(danger(message, description)),
		success: (message, description=null)=> dispatch(success(message, description))
	}
};

const propsMap = (state, ownProps={})=> {
	return {
		alert: state.alerts[state.alerts.length - 1]
	}
};

const AlertProvider = connect(propsMap)(AlertComponent);

export {AlertProvider, dispatch};


