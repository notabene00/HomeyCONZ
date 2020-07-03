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

	getGroupsList(callback) {
		http.get(`http://${Homey.app.host}:${Homey.app.port}/api/${Homey.app.apikey}/groups`, (error, response) => {
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

			let none = []
			let onoff = ['onoff']
			let dim = ['onoff', 'dim']
			let ct = ['onoff', 'dim', 'light_temperature']
			let color = ['onoff', 'dim', 'light_temperature', 'light_mode', 'light_saturation', 'light_hue']

			let matchTable = {
				'On/Off light': onoff,
				'Dimmable light': dim,
				'Color temperature light': ct,
				'Extended color light': color,
				'Color light': color,
				'Smart plug': onoff,
				'On/Off plug-in unit': onoff,
				'Window covering device': dim,
				'Range extender': none
			}

			this.getSensorsList((error, sensors) => {
				// entry[0] - key, entry[1] - value
				let filtered = Object.entries(lights).filter(entry => condition(entry[1])).map((entry, _index, _array) => {

					const key = entry[0]
					const light = entry[1]
					const mac = light.uniqueid.split('-')[0]

					// some devices (aqara relay) define multiple light ressources and some sensors. In that case only the first light resource should have
					// attached the sensors
					const lightSiblings = Object.entries(lights).filter(l => l[1].uniqueid.startsWith(mac)).map((e, _index, _array) => {
						return e[1].uniqueid
					}).sort()
					const isMainLight = lightSiblings[0] === light.uniqueid

					var linked_sensors = []
					var additionalCapabilities = []
					if (sensors && isMainLight) {
						let filteredSensors = Object.entries(sensors).filter(d => d[1].uniqueid.startsWith(mac))

						let powerMeasurementSensor = filteredSensors.find(s => s[1].state.hasOwnProperty('power'))
						if (powerMeasurementSensor) {
							linked_sensors.push(powerMeasurementSensor[0])
							additionalCapabilities.push('measure_power')
						}

						let voltageMeasurementSensor = filteredSensors.find(s => s[1].state.hasOwnProperty('voltage'))
						if (voltageMeasurementSensor) {
							linked_sensors.push(voltageMeasurementSensor[0])
							additionalCapabilities.push('measure_voltage')
						}

						let currentMeasurementSensor = filteredSensors.find(s => s[1].state.hasOwnProperty('current'))
						if (currentMeasurementSensor) {
							linked_sensors.push(currentMeasurementSensor[0])
							additionalCapabilities.push('measure_current')
						}

						let consumptionMeasurementSensor = filteredSensors.find(s => s[1].state.hasOwnProperty('consumption'))
						if (consumptionMeasurementSensor) {
							linked_sensors.push(consumptionMeasurementSensor[0])
							additionalCapabilities.push('meter_power')
						}

						let batteryMeasurementSensor = filteredSensors.find(s => s[1].config.hasOwnProperty('battery'))
						if (batteryMeasurementSensor) {
							linked_sensors.push(batteryMeasurementSensor[0])
							additionalCapabilities.push('measure_battery')
						}

						let temperatureMeasurementSensor = filteredSensors.find(s => s[1].config.hasOwnProperty('temperature'))
						if (temperatureMeasurementSensor) {
							linked_sensors.push(temperatureMeasurementSensor[0])
							additionalCapabilities.push('measure_temperature')
						}

					}
					let capabilities = (matchTable[light.type] || ['onoff']).concat(additionalCapabilities)
					
					return {
						name: light.name,
						data: {
							id: light.uniqueid,
							model_id: light.modelid
						},
						settings: {
							id: key,
							sensors: linked_sensors
						},
						capabilities: capabilities
					}
				})
				callback(null, filtered)
			})
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

			let filtered = sensorsEntries.filter(entry => {
					let sensor = entry[1]
					if (!condition(sensor)) {
						return false
					}
					let mac = sensor.uniqueid.split('-')[0]
					let isNew = !knownMacAddresses.includes(mac)
					knownMacAddresses.push(mac)
					return isNew
				}).map((entry, _index, _array) => {

					const sensor = entry[1]
					const mac = sensor.uniqueid.split('-')[0]

					return {
						name: sensor.name,
						data: {
							id: mac,
							model_id: sensor.model_id
						},
						settings: {
							id: sensorsEntries.filter(d => d[1].uniqueid.startsWith(mac)).map(d => d[0])
					}

				}
			})
			callback(null, filtered)
		})
	}

}

module.exports = Driver
