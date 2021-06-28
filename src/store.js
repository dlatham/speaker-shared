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

export const initStore = () => {
	return function(dispatch){
		Authentication.GetCurrentUser().then(
			user => dispatch({type: 'STORE_USER', ...user}),
			err => console.error(err)
		)
	}
}