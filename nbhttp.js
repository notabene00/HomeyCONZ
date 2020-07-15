const http = require('http')
const https = require('https')
const urlParser = require('url')

module.exports.http = {}
module.exports.https = {}

module.exports.http.get = function(url, callback) {
	http.get(url, response => {
		let data = ''
		response.on('data', chunk => {
			data += chunk
		})
		response.on('end', () => {
			callback(null, data, response.statusCode)
		})
	}).on('error', err => {
		callback(err)
	})
}

module.exports.https.get = function(url, callback) {
	https.get(url, response => {
		let data = ''
		response.on('data', chunk => {
			data += chunk
		})
		response.on('end', () => {
			callback(null, data, response.statusCode)
		})
	}).on('error', err => {
		callback(err)
	})
}

module.exports.http.post = function(link, data, callback) {
	let url = urlParser.parse(link)
	let postRequest = http.request({host: url.host, path: url.path, method: 'POST'}, response => {
		let data = ''
		response.on('data', chunk => {
			data += chunk
		})
		response.on('end', () => {
			callback(null, data, response.statusCode)
		})
	}).on('error', err => {
		callback(err)
	})
	postRequest.write(JSON.stringify(data))
	postRequest.end()
}

module.exports.https.post = function(link, data, callback) {
	let url = urlParser.parse(link)
	let postRequest = https.request({host: url.host, path: url.path, method: 'POST'}, response => {
		let data = ''
		response.on('data', chunk => {
			data += chunk
		})
		response.on('end', () => {
			callback(null, data, response.statusCode)
		})
	}).on('error', err => {
		callback(err)
	})
	postRequest.write(JSON.stringify(data))
	postRequest.end()
}

module.exports.http.put = function(host, port, path, data, callback) {
	let dataString = JSON.stringify(data)
	let options = {
		host: host,
		port: port,
		path: path,
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': dataString.length
		}
	}
	http.request(options, response => {
		let data = ''
		response.on('data', chunk => {
			data += chunk
		})
		response.on('end', () => {
			callback(null, data, response.statusCode)
		})
	}).on('error', err => {
		callback(err)
	}).write(dataString)
}

module.exports.https.put = function(host, port, path, data, callback) {
	let dataString = JSON.stringify(data)
	let options = {
		host: host,
		port: port,
		path: path,
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': dataString.length
		}
	}
	https.request(options, response => {
		let data = ''
		response.on('data', chunk => {
			data += chunk
		})
		response.on('end', () => {
			callback(null, data, response.statusCode)
		})
	}).on('error', err => {
		callback(err)
	}).write(dataString)
}