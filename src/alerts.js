import React from'react';


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

export {dispatch, propsMap};


