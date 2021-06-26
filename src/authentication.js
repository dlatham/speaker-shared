import React, { useState,useEffect,useContext } from 'react';
import * as Global from 'lib/global';
import * as Alerts from 'lib/alerts';
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from "react-native-flash-message";

const DefaultUser = {
	uid: null,
	accessToken: null,
	client: null,
	username: null,
	password: null,
	expiry: null
}

export const SignIn = async (username, password) => {
	if (!username || !password) throw('Username and password are required to sign in');
	try {
		let res = await Global.Server.post('/auth/sign_in', {
			email: username,
			password: password
		}, {raw: true})
		let user = {
			uid: res.headers.get('uid'),
			accessToken: res.headers.get('access-token'),
			client: res.headers.get('client'),
			expiry: res.headers.get('expiry'),
			username: username,
			password: password
		}
		SetCurrentUser(user);
		return user;
	} catch(err){
		throw(err);
	}
}

export function Ping() {
	return function(dispatch){
		return Global.Server.get('/ping').then(
			res => dispatch(Alerts.success({message: res.message})),
			err => {
				dispatch(Alerts.danger({message: 'Something went wrong', description: err.message}));
				throw(err);
			}
		);
	};
}

// REDUX REFACTOR
// --------------
// All of these should now be helper functions
// for leveraging the redux store.

export const CurrentUserMap = (state, ownProps={}) => {
	return {
		currentUser: state.currentUser,
		signedIn: (state.currentUser.uid && state.currentUser.accessToken && state.currentUser.client && parseInt(state.currentUser.expiry) > (Date.now()/1000)),
		...ownProps
	};
}

export const dispatch = (dispatch, ownProps={}) => {
	return {
		signIn: SignIn,
		ping: () => { dispatch(Ping()) }
	};
}


// This is the default context which is reset as soon as the AuthenticationProvider
// is mounted when the application loads

export const AuthenticationContext = React.createContext({
	currentUser: DefaultUser
});
AuthenticationContext.displayName = 'AuthenticationContext';




// This gets the CurrentUser object from secure storage

export const GetCurrentUser = async () => {
	try {
		return {
			uid: await Global.getValueFor('uid'),
			accessToken: await Global.getValueFor('accessToken'),
			client: await Global.getValueFor('client'),
			expiry: await Global.getValueFor('expiry'),
			username: await Global.getValueFor('username'),
			password: await Global.getValueFor('password')
		}
	} catch(err){
		console.error("Error getting current user from secure storage in Authentication.GetCurrentUser()");
		console.error(err);
		throw(err);
	}
}

// This sets the current user and geenrally is run when the user logs in using the SignIn component

export const SetCurrentUser = async(user) => {
	try {
		for(const key in user){
			await Global.save(key, user[key]);
		}
	} catch(err){
		console.error("Error when saving user info securely in Authentication.SetCurrentUser()");
		console.error(err);
		throw(err);
	}

}


// This is the main Component that needs to be added to the ApplicationProvider
// and mounted before the application loads screens

export class AuthenticationProvider extends React.Component {

	constructor(props){
		super(props);
		this.state = {
			currentUser:
			 {
				uid: null,
				accessToken: null,
				client: null,
				expiry: null,
				username: 'guest',
				password: null
			}
		}

	}

	get isSignedIn(){
		if(this.state.currentUser.uid && this.state.currentUser.accessToken && this.state.currentUser.client && parseInt(this.state.currentUser.expiry) > (Date.now()/1000)){
			return true;
		} else {
			return false;
		}
	}

	get expiresAt(){
		let date = new Date(parseInt(this.state.currentUser.expiry)*1000)
		return date.toLocaleString();
	}

	async signIn(username, password){
		try {
			let res = await SignIn(username, password);
			this.setState({
				currentUser: {...DefaultUser, ...res},
			});
			return res;
		} catch(err){
			throw(err);
		}
	}

	async signOut(){
		try {
			console.log("Starting signOut");
			let res = await Global.Server.destroy('/auth/sing_out')
			console.log(res);
			return res;
		} catch(err){
			throw(err);
		}
	}

	async ping(){
		try {
			let res = await Ping();
			return res;
		} catch(err){
			throw(err);
		}
	}

	componentDidMount(){
		// Go get the CurrentUser data from the sercure storage and mount it
		// into the CurrentUserContext
		console.log("AuthenticationProvider mounted, getting CurrentUser from secure storage...");
		GetCurrentUser().then(res => this.setState({
			currentUser: {...DefaultUser, ...res},
		}), err => console.error(err));
	}

	render(){
		return (
			<AuthenticationContext.Provider value={
				{
					...this.state, 
					isSignedIn: this.isSignedIn,
					expiresAt: this.expiresAt,
					signIn: this.signIn,
					signOut: this.signOut,
					ping: this.ping
				}
			}>{this.props.children}</AuthenticationContext.Provider>
		);
	}

}