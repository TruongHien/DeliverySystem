import fetchCached, { httpPostLogin, httpPost, httpPut, httpGetEmail } from './cached-json-fetch'
const baseURL = `https://hteamshipperappmobileapi.azurewebsites.net/api/`

export default () => {
	let services = {
		// Login API
		emailLogin(username, password) {
			return httpPostLogin(baseURL + `login`, username, password)
		},
		// Forget API
		getEmail: (email) => {
			return httpGetEmail(baseURL + `forgetpassword?email=${email}`)
		},
		// Order API
		getOrderByShipperID: (time, token) => {
			return fetchCached(baseURL + `BillShipper?time=${time}`, token, true)
		},
		getDetailOrder: (orderID, token) => {
			return fetchCached(baseURL + `BillShipper/${orderID}`, token, true)
		},
		getStatusOrder: (orderID, status, message, token) => {
			return fetchCached(baseURL + `changebillstatus?billID=${orderID}&status=${status}&message=${message}`, token, true)
		},
		getHistoryOrder: (status, time, token) => {
			return fetchCached(baseURL + `history?status=${status}&to=${time}`, token, true)
		},
		getStatisticOrder: (from, to, token) => {
			return fetchCached(baseURL + `Statistic?from=${from}&to=${to}`, token, true)
		},
		// User API
		getDetailUser: (token) => {
			return fetchCached(baseURL + `User`, token, true)
		},
		putDetailUser: (data, token) => {
			return httpPut(baseURL + `User`, data, token)
		},
		// Map API
		getBillsForMap: (time, token) => {
			return fetchCached(baseURL + `billsformap?time=${time}`, token, true)
		},
		pushTokenNotification: (data, token) => {
			return httpPost(baseURL + `TokenNotification`, data, token)
		},
		updateStatusShipper: (token) => {
			return fetchCached(baseURL + `freeshipper`, token, true)
		},
		updateShipperLocation: (time, long, lat, token) => {
			return fetchCached(baseURL + `updatecurrentlocation?longtitude=${long}&latitude=${lat}&time=${time}`, token, true)
		}
	}
	return services
}

