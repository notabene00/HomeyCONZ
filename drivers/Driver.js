'use strict'

const Homey = require('homey')
const { http } = require('../../nbhttp')

class Driver extends Homey.Driver {
	
	onInit() {
		// this.host = Homey.ManagerSettings.get('host')
		// this.apikey = Homey.ManagerSettings.get('apikey')
		// this.port = Homey.ManagerSettings.get('port')
	}
	
	getLightsList(callback) {
		http.get(`http://${Homey.app.host}:${Homey.app.port}/api/${Homey.app.apikey}/lights`, (error, response) => {
			callback(error, !!error ? null : JSON.parse(response))
		})
	}
	
	getSensorsList(callback) {
		http.get(`http://${Homey.app.host}:${Homey.app.port}/api/${Homey.app.apikey}/sensors`, (error, response) => {
			callback(error, !!error ? null : JSON.parse(response))
		})
	}
	
	getLightsByCondition(condition, callback) {
		if (!Homey.app.host || !Homey.app.port || !Homey.app.apikey) {
			return callback(new Error('Go to app settings page and fill all fields'))
		}
		this.getLightsList((error, lights) => {
			if (error) {
				callback(error)
				return
			}
			let onoff = ['onoff']
			let dim = ['onoff', 'dim']
			let ct = ['onoff', 'dim', 'light_temperature']
			let color = ['onoff', 'dim', 'light_temperature', 'light_saturation', 'light_hue']
			
			let matchTable = {
				'On/Off light': onoff,
				'Dimmable light': dim,
				'Color temperature light': ct,
				'Extended color light': color,
				'Smart plug': onoff, // отличаются только классом устройства - socket
				'Window covering device': dim // отличаются только классом устройства - windowcoverings
			}
			// entry[0] - key, entry[1] - value
			let filered = Object.entries(lights).filter(entry => condition(entry[1])).map((entry, _index, _array) => {
				// для каждого уже отфильтрованного entry
				const key = entry[0] // ключ
				const light = entry[1] // значение
				return {
					name: light.name,
					data: {
						id: light.uniqueid 
					},
					settings: {
						id: key
					},
					capabilities: matchTable[light.type]
				}
			})
			callback(null, filered)
		})
	}
	
	getSensorsByCondition(condition, callback) {
		if (!Homey.app.host || !Homey.app.port || !Homey.app.apikey) {
			return callback(new Error('Go to app settings page and fill all fields'))
		}
		this.getSensorsList((error, sensors) => {
			if (error) {
				callback(error)
				return
			}
			
			let sensorsEntries = Object.entries(sensors)

			let knownMacAddresses = []
			
			let filered = sensorsEntries.filter(entry => {
					let sensor = entry[1]
					if (!condition(sensor)) {
						return false
					}
					let mac = sensor.uniqueid.split('-')[0]
					let isNew = !knownMacAddresses.includes(mac)
					knownMacAddresses.push(mac)
					return isNew
				}).map((entry, _index, _array) => {
				// для каждого уже отфильтрованного entry
				const key = entry[0] // ключ
				const sensor = entry[1] // значение
				const mac = sensor.uniqueid.split('-')[0] // мак-адрес является частью уникального идентификатора
				
				const isSplintered = ['lumi.sensor_ht', 'lumi.sensor_motion.aq2', 'lumi.weather', 'lumi.sensor_cube.aqgl01'].includes(sensor.modelid)
				this.log(sensorsEntries)
				return {
					name: sensor.name,
					data: {
						id: mac
					},
					settings: {
						id: isSplintered ? sensorsEntries.filter(d => d[1].uniqueid.startsWith(mac)).map(d => d[0]) : [key]
					}
				}
			})
			callback(null, filered)
		})
	}
	
}

module.exports = Driver