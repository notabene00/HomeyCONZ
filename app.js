'use strict'

const Homey = require('homey')
const { http, https } = require('./nbhttp')
const WebSocketClient = require('ws')

class deCONZ extends Homey.App {
	
	onInit() {
		// сюда складываем ссылки на все устройства, которые у нас добавлены	
		this.devices = {
			lights: {},
			sensors: {}
		}
		
		this.host = Homey.ManagerSettings.get('host')
		this.port = Homey.ManagerSettings.get('port')
		this.apikey = Homey.ManagerSettings.get('apikey')
		this.wsPort = Homey.ManagerSettings.get('wsport')
		
		if (!this.host || !this.port || !this.apikey || !this.wsPort) {
			this.wfc = setInterval(this.waitForCredentials.bind(this), 3 * 1000)
			return this.log('Go to the app settings page and fill all the fields')
		}
		
		this.start()
	}

	start() {
		this.webSocketConnect(this.wsPort)
	}

	waitForCredentials() {
		this.host = Homey.ManagerSettings.get('host')
		this.port = Homey.ManagerSettings.get('port')
		this.apikey = Homey.ManagerSettings.get('apikey')
		this.wsPort = Homey.ManagerSettings.get('wsport')
		if (!!this.host && !!this.port && !!this.apikey && !!this.wsPort) {
			clearInterval(this.wfc)
			this.start()
		}
	}
	
	setWSKeepAlive(wsPort) {
		// убивать таймаут при переподключениях
		if (this.keepAliveTimeout) {
			clearTimeout(this.keepAliveTimeout)
		}
		// когда приходит pong - убивать таймаут на переподключение
		this.websocket.on('pong', () => {
			if (this.keepAliveTimeout) {
				clearTimeout(this.keepAliveTimeout)
			}
			this.keepAliveTimeout = setTimeout(() => {
				this.error('Connection lost')
				this.websocket.terminate()
				this.webSocketConnect(wsPort)
			}, 3.1 * 60 * 1000)
		})
		// ping каждую минуту
		setInterval(() => {
			try {
				this.websocket.ping()
			} catch(error) {
				this.error('Can\'t ping websocket')
				this.error(error)
			}
		}, 60 * 1000)	
	}
	
	webSocketConnect(wsPort) {
		this.log('Websocket connect...')
		this.websocket = new WebSocketClient(`ws://${this.host}:${wsPort}`)
		this.websocket.on('open', () => {
			this.log('Websocket is up')
			// установить начальный статус всем устройствам
			this.setInitialStates()
			// настроить поддержание жизни
			this.setWSKeepAlive(wsPort)
		})
		this.websocket.on('message', message => {
			let data = JSON.parse(message)
			let device = this.getDevice(data.r, data.id)
			
			if (device) {
				// STATE
				if (data.state) {
					this.updateState(device, data.state)
				// CONFIG
				} else if (data.config) {
					this.updateConfig(device, data.config)
				}
			// UNKNOWN
			} else {
				this.log('Update for unregistered device', data)
			}
		})
		this.websocket.on('error', error => {
			this.error(error)
		})
		this.websocket.on('close', (reasonCode, description) => {
			this.setAllUnavailable()
			this.error(`Closed, error #${reasonCode}`)
			this.log('Reconnection in 5 seconds...')
			setTimeout(
				this.webSocketConnect.bind(this, wsPort), 
				5 * 1000
			)
		})
	}
	
	getLightState(device, callback) {
		http.get(`http://${this.host}:${this.port}/api/${this.apikey}/lights/${device.id}`, (error, response) => {
			callback(error, !!error ? null : JSON.parse(response))
		})
	}
	
	getSensorState(device, callback) {
		http.get(`http://${this.host}:${this.port}/api/${this.apikey}/sensors/${device.id}`, (error, response) => {
			callback(error, !!error ? null : JSON.parse(response))
		})
	}
	
	getLightsList(callback) {
		http.get(`http://${this.host}:${this.port}/api/${this.apikey}/lights`, (error, response) => {
			callback(error, !!error ? null : JSON.parse(response))
		})
	}
	
	getSensorsList(callback) {
		http.get(`http://${this.host}:${this.port}/api/${this.apikey}/sensors`, (error, response) => {
			callback(error, !!error ? null : JSON.parse(response))
		})
	}
	
	setInitialStates() {
		this.getLightsList((error, lights) => {
			if (error) {
				return this.error(error)
			}
			Object.entries(lights).forEach(entry => {
				const key = entry[0]
				const light = entry[1]
				const device = this.getDevice('lights', key)
				if (device && light.state) {
					this.updateState(device, light.state)
				}
			})
		})
		
		this.getSensorsList((error, sensors) => {
			if (error) {
				return this.error(error)
			}
			Object.entries(sensors).forEach(entry => {
				const key = entry[0]
				const sensor = entry[1]
				const device = this.getDevice('sensors', key)
				if (device) {
					if (sensor.state) {
						this.updateState(device, sensor.state, true) // initial=true
					}
					if (sensor.config) {
						this.updateConfig(device, sensor.config, true) // initial=true
					}
				}
			})
		})
	}
	
	// websocket processing
	
	setAllUnavailable() {
		Object.values(this.devices.lights).forEach(device => {
			device.setUnavailable('Websocket is down')
		})
		Object.values(this.devices.sensors).forEach(device => {
			device.setUnavailable('Websocket is down')
		})
	}
	
	getDevice(type, id) {
		if (type === 'groups') return null
		return this.devices[type].hasOwnProperty(id) ? this.devices[type][id] : null
	}
	
	updateState(device, state, initial=false) {		
		if (!initial) {
			this.log('state update for', device.getName(), state)
		}
		if (state.hasOwnProperty('on')) {
			device.setCapabilityValue('onoff', state.on)
		}
		if (state.hasOwnProperty('bri')) {
			device.setCapabilityValue('dim', state.bri/255)
		}
		if (state.hasOwnProperty('presence')) {
			device.setCapabilityValue('alarm_motion', state.presence)
		}
		if (state.hasOwnProperty('reachable')) {
			state.reachable ? device.setAvailable() : device.setUnavailable('Unreachable')
		}
		if (state.hasOwnProperty('lux')) {
			device.setCapabilityValue('measure_luminance', state.lux)
		}
		if (state.hasOwnProperty('water')) {
			device.setCapabilityValue('alarm_water', state.water)
		}
		if (state.hasOwnProperty('buttonevent') && !initial) {
			device.fireEvent(state.buttonevent)
		}
		if (state.hasOwnProperty('open')) {
			device.setCapabilityValue('alarm_contact', state.open)
		}
		if (state.hasOwnProperty('fire')) {
			device.setCapabilityValue('alarm_smoke', state.fire)
		}
		if (state.hasOwnProperty('temperature')) {
			device.setCapabilityValue('measure_temperature', state.temperature / 100)
		}
		if (state.hasOwnProperty('humidity')) {
			device.setCapabilityValue('measure_humidity', state.humidity / 100)
		}
		if (state.hasOwnProperty('pressure')) {
			device.setCapabilityValue('measure_pressure', state.pressure)
		}
		if (state.hasOwnProperty('ct')) {
			device.setCapabilityValue('light_temperature', (state.ct - 153) / 347)
		}
		
		// FIX: NOT WORKING at all
		if (state.hasOwnProperty('hue')) {
			device.setCapabilityValue('light_hue', state.hue / 65535)
		}
		if (state.hasOwnProperty('sat')) {
			device.setCapabilityValue('light_saturation', state.sat / 255)
		}
	}
	
	updateConfig(device, config, initial=false) {
		if (!initial) {
			this.log('Config update for', device.getName(), config)
		}
		
		let deviceСapabilities = device.getCapabilities()
		
		if (config.hasOwnProperty('temperature') && deviceСapabilities.includes('measure_temperature')) {
			device.setCapabilityValue('measure_temperature', config.temperature/100)
		}
		if (config.hasOwnProperty('battery') && deviceСapabilities.includes('measure_battery')) {
			device.setCapabilityValue('measure_battery', config.battery)
		}
	}
	
	// init processing
	
	get(url, callback) {
		let handler = function (error, result) {
			callback(error, !!error ? null : JSON.parse(result))
		}
		if (url.startsWith('https')) {
			https.get(url, handler)
		} else {
			http.get(url, handler)
		}
	}
	
	getWSport(callback) {
		let link = `http://${this.host}:${this.port}/api/${this.apikey}/config`
		this.get(link, (error, result) => {
			callback(error, !!error ? null : result.websocketport)
		})
	}
	
}

module.exports = deCONZ