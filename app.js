'use strict'

const Homey = require('homey')
const { http, https } = require('./nbhttp')
const WebSocketClient = require('ws')

class deCONZ extends Homey.App {

	onInit() {
		// holds all devices that we have, added when a device gets initialized (see Sensor.registerInApp for example).
		this.devices = {
			lights: {},
			sensors: {},
			groups: {}
		}

		this.host = Homey.ManagerSettings.get('host')
		this.port = Homey.ManagerSettings.get('port')
		this.apikey = Homey.ManagerSettings.get('apikey')
		this.wsPort = Homey.ManagerSettings.get('wsport')

		if (!this.host || !this.port || !this.apikey || !this.wsPort) {
			Homey.ManagerSettings.on('set', this.onSettingsChanged.bind(this))
			return this.log('Go to the app settings page and fill all the fields')
		}

		this.startWebSocketConnection()

		// Update all devices regularly. This might be needed for two cases
		// - state/config values that do not update very often, such as the battery for certain devices: in that case we would need to wait until something changes s.t we receive
		//   it trough the websocket update
		// - some config values are not pushed via websockets such as the sensitivity of certain devices
		setInterval(() => {
			this.log("Initialize initial states");
			this.setInitialStates()
		}, 15 * 60 * 1000)
	}

	startWebSocketConnection() {
		if (this.websocket) {
			this.websocket.terminate()
		}
		this.webSocketConnectTo(this.wsPort)
	}

	onSettingsChanged(modifiedKey) {
		this.host = Homey.ManagerSettings.get('host')
		this.port = Homey.ManagerSettings.get('port')
		this.apikey = Homey.ManagerSettings.get('apikey')
		this.wsPort = Homey.ManagerSettings.get('wsport')
		if (!!this.host && !!this.port && !!this.apikey && !!this.wsPort) {
			this.startWebSocketConnection()
		}
	}

	setWSKeepAlive() {
		// убивать таймаут при переподключениях
		if (this.keepAliveTimeout) {
			clearTimeout(this.keepAliveTimeout)
		}
		// когда приходит ping - убивать таймаут на переподключение
		this.websocket.on('ping', () => {
			if (this.keepAliveTimeout) {
				clearTimeout(this.keepAliveTimeout)
			}
			this.keepAliveTimeout = setTimeout(() => {
				this.error('Connection lost')
				this.startWebSocketConnection()
			}, 3.1 * 60 * 1000)
		})
		// ping every 60 seconds
		setInterval(() => {
			try {
				this.websocket.ping()
			} catch(error) {
				this.error('Can\'t ping websocket')
				this.error(error)
			}
		}, 60 * 1000)
	}

	webSocketConnectTo() {
		this.log('Websocket connect...')
		this.websocket = new WebSocketClient(`ws://${this.host}:${this.wsPort}`)
		this.websocket.on('open', () => {
			this.log('Websocket is up')
			this.setWSKeepAlive()
		})
		this.websocket.on('message', message => {
			let data = JSON.parse(message)
			let device = this.getDevice(data.r, data.id)

			if (device) {
				// STATE
				if (data.state) {
					this.updateState(device, data.state)
				} else if (data.action) { // if GROUPS
					this.updateState(device, data.action)
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
		this.websocket.on('close', (reasonCode, _) => {
			this.setAllUnavailable()
			this.error(`Closed, error #${reasonCode}`)
			this.log('Reconnection in 5 seconds...')
			setTimeout(
				this.webSocketConnectTo.bind(this),
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

	getGroupsList(callback) {
		http.get(`http://${Homey.app.host}:${Homey.app.port}/api/${Homey.app.apikey}/groups`, (error, response) => {
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
				if(device){
					this.updateDeviceInfo(device, light)
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
						this.updateState(device, sensor.state, true)
					}
					if (sensor.config) {
						this.updateConfig(device, sensor.config, true)
					}
					this.updateDeviceInfo(device, sensor)
				}
			})
		})

		this.getGroupsList((error, groups) => {
			if (error) {
				return this.error(error)
			}
			Object.entries(groups).forEach(entry => {
				const key = entry[0]
				const group = entry[1]
				const device = this.getDevice('groups', key)
				if (device) {
					if (group.action) {
						this.updateState(device, group.action, true)
					}
					this.updateDeviceInfo(device, group)
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
		Object.values(this.devices.groups).forEach(device => {
			device.setUnavailable('Websocket is down')
		})
	}

	getDevice(type, id) {
		if (this.devices[type] && this.devices[type].hasOwnProperty(id)) {
			return this.devices[type][id]
		}
		return null
	}

	updateState(device, state, initial = false) {
		let deviceCapabilities = device.getCapabilities()
		let deviceSupports = (capabilities) => {
			if (typeof(capabilities) == 'string') capabilities = [capabilities]
			return !capabilities.map(capability => {
				return deviceCapabilities.includes(capability)
			}).includes(false)
		}

		// this.log('state update for', device.getSetting('id'), device.getName(), state)

		if (state.hasOwnProperty('on')) {
			if (deviceSupports('onoff')) {
				device.setCapabilityValue('onoff', state.on)
			}
		}

		if (state.hasOwnProperty('any_on')) {
			if (deviceSupports('onoff')) {
				device.setCapabilityValue('onoff', state.any_on)
			}
		}

		if (state.hasOwnProperty('bri')) {
			if (deviceSupports('dim')) {
				device.setCapabilityValue('dim', state.bri / 255)
			}
		}

		if (state.hasOwnProperty('presence')) {
			if (deviceSupports('alarm_motion')) {
				device.setCapabilityValue('alarm_motion', state.presence)
			}
		}

		if (state.hasOwnProperty('vibration')) {
			if (deviceSupports('vibration_alarm')) {
				device.setCapabilityValue('vibration_alarm', state.vibration)
			}
		}

		if (state.hasOwnProperty('vibrationstrength')) {
			if (deviceSupports('vibration_strength')) {
				device.setCapabilityValue('vibration_strength', state.vibrationstrength)
			}
		}

		if (state.hasOwnProperty('tiltangle')) {
			if (deviceSupports('tilt_angle')) {
				device.setCapabilityValue('tilt_angle', state.tiltangle)
			}
		}

		if (state.hasOwnProperty('dark')) {
			if (deviceSupports('dark')) {
				device.setCapabilityValue('dark', state.dark)
			}
		}

		if (state.hasOwnProperty('reachable')) {
			state.reachable ? device.setAvailable() : device.setUnavailable('Unreachable')
		}

		if (state.hasOwnProperty('lux')) {
			if (deviceSupports('measure_luminance')) {
				device.setCapabilityValue('measure_luminance', state.lux)
			}
		}
		if (state.hasOwnProperty('water')) {
			if (deviceSupports('alarm_water')) {
				device.setCapabilityValue('alarm_water', state.water)
			}
		}

		if (state.hasOwnProperty('buttonevent') && !initial) {
			device.fireEvent(state.buttonevent)
		}

		if (state.hasOwnProperty('buttonevent') && state.hasOwnProperty('gesture')) {
			device.fireEvent(state.buttonevent, initial, state.gesture)
		}

		if (state.hasOwnProperty('open')) {
			if (deviceSupports('alarm_contact')) {
				device.setCapabilityValue('alarm_contact', state.open)
			}
		}

		if (state.hasOwnProperty('colormode')) {
			if (deviceSupports('light_mode')) {
				device.setCapabilityValue('light_mode', (state.colormode == 'xy' || state.colormode == 'hs') ? 'color': 'temperature')
			}
		}

		if (state.hasOwnProperty('fire')) {
			if (deviceSupports('alarm_smoke')) {
				device.setCapabilityValue('alarm_smoke', state.fire)
			}
		}

		if (state.hasOwnProperty('temperature')) {
			if (deviceSupports('measure_temperature')) {
				device.setCapabilityValue('measure_temperature', state.temperature / 100)
			}
		}

		if (state.hasOwnProperty('humidity')) {
			if (deviceSupports('measure_humidity')) {
				device.setCapabilityValue('measure_humidity', state.humidity / 100)
			}
		}

		if (state.hasOwnProperty('pressure')) {
			if (deviceSupports('measure_pressure')) {
				device.setCapabilityValue('measure_pressure', state.pressure)
			}
		}

		if (state.hasOwnProperty('power')) {
			if (deviceSupports('measure_power')) {
				device.setCapabilityValue('measure_power', state.power)
			}
		}

		if (state.hasOwnProperty('ct')) {
			if (!deviceSupports(['light_mode', 'light_temperature']) || (state.ct > 500)) return
			device.setCapabilityValue('light_mode', 'temperature')
			device.setCapabilityValue('light_temperature', (state.ct - 153) / 347)
		}

		if (state.hasOwnProperty('hue')) {
			if (!deviceSupports('light_hue')) return
			device.setCapabilityValue('light_hue', parseFloat((state.hue / 65535).toFixed(2)))
		}
		if (state.hasOwnProperty('sat')) {
			if (!deviceSupports('light_saturation')) return
			device.setCapabilityValue('light_saturation', parseFloat((state.sat / 255).toFixed(2)))
		}
	}

	updateConfig(device, config, initial = false) {

		// this.log('config update for', device.getSetting('id'), device.getName(), config)

		let deviceСapabilities = device.getCapabilities()

		if (config.hasOwnProperty('temperature') && deviceСapabilities.includes('measure_temperature')) {
			device.setCapabilityValue('measure_temperature', config.temperature / 100)
		}

		if (config.hasOwnProperty('battery') && deviceСapabilities.includes('measure_battery')) {
			device.setCapabilityValue('measure_battery', config.battery)
		}

		if (config.hasOwnProperty('sensitivity') && device.getSetting('sensitivity') != null) {
			device.setSettings({ sensitivity: config.sensitivity });
		}

		if (config.hasOwnProperty('ledindication') && device.getSetting('ledindication') != null) {
			device.setSettings({ ledindication: config.ledindication });
		}

		if (config.hasOwnProperty('pending') && device.getSetting('pending') != null) {
			device.setSettings({ pending: JSON.stringify(config.pending) });
		}

		if (config.hasOwnProperty('reachable')) {
			config.reachable ? device.setAvailable() : device.setUnavailable('Unreachable')
		}
	}

	updateDeviceInfo(device, data) {

		// this.log('device info update for', device.getSetting('id'), device.getName(), data)

		if (data.hasOwnProperty('modelid') && device.getSetting('modelid') != null) {
			device.setSettings({ modelid: data.modelid });
		}

		if (data.hasOwnProperty('manufacturername') && device.getSetting('manufacturername') != null) {
			device.setSettings({ manufacturername: data.manufacturername });
		}

		if (data.hasOwnProperty('swversion') && device.getSetting('swversion') != null) {
			device.setSettings({ swversion: data.swversion });
		}

		if (device.getSetting('ids') != null && device.getSetting('id') != null) {
			device.setSettings({ ids: JSON.stringify(device.getSetting('id')) });
		}
	}

	// init processing

	get(url, callback) {
		let handler = (error, result) => {
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
