// Global functions and data to share betweem
// all componentry in the app
import * as Authentication from './authentication';
import * as Alerts from './alerts';

export { Alerts }

export const isNative = () => {
	if (typeof document != 'undefined') {
  		// I'm on the web!
  		return false;
	}
	else if (typeof navigator != 'undefined' && navigator.product == 'ReactNative') {
		// I'm in react-native
		return true;
	}
	else {
  		// I'm in node js
  		return false;
	}
}


export const dispatch = (dispatch, ownProps={}) => {

	return {
		...Authentication.dispatch(dispatch, ownProps),
		...Alerts.dispatch(dispatch, ownProps),
		dispatch
	};

}

const Headers = async ()=> {

	try {
		let uid = await getValueFor('uid');
		let accessToken = await getValueFor('accessToken');
		let client = await getValueFor('client');

		let header = {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...(uid && {uid: uid}),
			...(accessToken && {'access-token': accessToken}),
			...(client && {client: client})
		}
		console.log(header);
		return header;
	} catch(err){
		console.error("Something went wron assembling the headers in Global.Headers()");
		console.error(err);
		throw(err)
	}
}

const baseURL = 'http://localhost:3000';
const basePath = '/api/v1';

export const Server = {


	get: async function(path, options={}){
			try {
				let res = await fetch(`${baseURL}${basePath}${path}`, {
					method: 'GET',
					headers: await Headers()
				});
				let json = await Server.responseHandler(res);
				return json;
			} catch(err) {
				throw(err);
			}
		},

	post: async function(path, body, options={}){
			try {
				let res = await fetch(`${baseURL}${basePath}${path}`, {
					method: 'POST',
					headers: await Headers(),
					body: JSON.stringify(body)
				});
				console.log(res);
				let json = await Server.responseHandler(res);
				if(options.raw) return res;
				return json;
			} catch(err) {
				throw(err);
			}
		},

	destroy: async function(path, body={}, options={}){
		try {
			let res = await fetch(`${baseURL}${basePath}${path}`, {
				method: 'DELETE',
				headers: await Headers(),
				body: JSON.stringify(body)
			});
			console.log(res);
			let json = await Server.responseHandler(res);
			if(options.raw) return res;
			return json;
		} catch(err) {
			throw(err);
		}

	},

	responseHandler: async function(response){
		try {
			if(!response.ok){
				let errorRes = await Server.responseError(response);
				console.log(`Server responseError: ${errorRes}`);
				throw(errorRes);
			}
			let json = await response.json();
			console.log(json);
			return json;
		} catch(err){
			console.error(err);
			throw(err);
			return null;
		}
		
	},

	responseError: async function(response){
		// We need to try and parse out the response message:
		// https://github.com/github/fetch/issues/203
		try {
			let json = await response.json();
			console.warn("Error response from server:");
			console.warn(json);

			// This will trigger the danger alert UI if it is mounted
			showMessage({
				message: 'Oh no',
				description: json.errors[0],
				type: 'danger'
			});

			return json.errors;
		} catch(err){
			console.error("Something went wrong in Global.Server.responseError()");
			showMessage({
				message: 'Oh no',
				description: 'Something went wrong!',
				type: 'danger'
			});
			throw(err);
		}
	}


}

