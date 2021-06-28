import Axios from 'axios';

// Main HTTP handlers using Axios across native and DOM

const Headers = async (state)=> {

	try {

		let header = {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...(state.currentUser && {
				...(state.currentUser.uid && {uid: state.currentUser.uid}),
				...(state.currentUser.accessToken && {'access-token': state.currentUser.accessToken}),
				...(state.currentUser.client && {client: state.currentUser.client})
			})
		}
		console.log(header);
		return header;
	} catch(err){
		console.error("Something went wrong assembling the headers in Global.Headers()");
		console.error(err);
		throw(err)
	}
}

const baseURL = 'http://localhost:3000';
const basePath = '/api/v1';

const request = async (method, path, body, options) => {

	try {

		let res = await Axios[method](path, body, {
			headers: Headers
		});
		return res;

	} catch(err){
		console.error(err);
		throw(err);
	}


}

const get = async (path, body={}, options={}) => {

	try {
		let res = await request('get', path, body);
		return res;
	} catch(err){
		throw(err);
	}

}

const HttpMap = (state, ownProps={}) => {

	return {
		headers: Headers(state),
		...ownProps,
		get: (path, body={}, options={}) => { get(path, body, options, Headers(state)) } 
	}

}