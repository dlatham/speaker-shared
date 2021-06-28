import React from 'react';
import { createStore, combineReducers } from 'redux';
//import * as Global from 'lib/global';
import * as Authentication from './authentication';

const currentUser = (state={}, action) => {
	switch(action.type){
		case 'STORE_USER':
			return {
				...state,
				...action
			}
		case 'SIGN_IN':
			return {
				...state,
				...{username: action.username, password: action.password}
			}
		case 'SIGN_OUT':
			return {
				...state
			}
		default:
			return state
	}
}

const alerts = (state=[], action) => {
	switch(action.type){
		case 'ALERT_DANGER':
			return [
				...state,
				{message: action.message, desciption: action.description, type: 'danger'}
			]
		case 'ALERT_SUCCESS':
			return [
				...state,
				{message: action.message, desciption: action.description, type: 'success'}
			]
		default:
			return state
	}
}

const devices = (state=[], action) => {
	switch(action.type){
		case 'ADD_DEVICE':
			return {
				...state,
				...action
			}
		default:
			return state;
	}
}

export const rootReducer = combineReducers({
	currentUser,
	alerts
});

// LocalStorage functions need to be passed to this thunk in order to make
// sure this logic can work across both React DOM and React Native. The local storage
// mechanism is different for each platform.

// This should be dispatched as the Thunk middleware captures the request and runs it
// async
// e.g. store.dispatch(Store.initStore(LocalStorage))

export const initStore = (localStorage) => {
	return function(dispatch){
		Authentication.GetCurrentUser(localStorage).then(
			user => dispatch({type: 'STORE_USER', ...user}),
			err => console.error(err)
		)
	}
}