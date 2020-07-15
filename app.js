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

		this.initializeActions()

		this.host = Homey.ManagerSettings.get('host')
		this.port = Homey.ManagerSettings.get('port')
		this.apikey = Homey.ManagerSettings.get('apikey')
		this.wsPort = Homey.ManagerSettings.get('wsport')

		Homey.ManagerSettings.on('set', this.onSettingsChanged.bind(this))

		this.startIntervalStateUpdate()

		if (!this.host || !this.port || !this.apikey || !this.wsPort) {
			return this.log('Go to the app settings page and fill all the fields')
		}

		this.startWebSocketConnection()
	}

	startWebSocketConnection() {
		if (this.websocket) {
			this.websocket.terminate()
		}
		this.webSocketConnectTo(this.wsPort)
	}

	startIntervalStateUpdate() {
		// Update all devices regularly. This might be needed for two cases
		// - state/config values that do not update very often, such as the battery for certain devices: in that case we would need to wait until something changes s.t we receive
		//   it trough the websocket update
		// - some config values are not pushed via websockets such as the sensitivity of certain devices
		// IMPORTANT: decreasing this might get cpu warnings and lead to a disabled app!
		setInterval(() => {
			this.log("Initialize initial states");
			this.setInitialStates()
		}, 15 * 60 * 1000)
	}

	onSettingsChanged(modifiedKey) {

		this.log('settings changed', modifiedKey)

		this.host = Homey.ManagerSettings.get('host')
		this.port = Homey.ManagerSettings.get('port')
		this.apikey = Homey.ManagerSettings.get('apikey')
		this.wsPort = Homey.ManagerSettings.get('wsport')
		if (!!this.host && !!this.port && !!this.apikey && !!this.wsPort) {
			this.startWebSocketConnection()
		}
	}

	setWSKeepAlive() {
		if (this.keepAliveTimeout) {
			clearTimeout(this.keepAliveTimeout)
		}
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
				if (data.state) {
					this.updateState(device, data.state)
				} else if (data.action) {
					// applies to groups only
					this.updateState(device, data.action)
				} else if (data.config) {
					this.updateConfig(device, data.config)
				}
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

	getFullState(callback) {
		http.get(`http://${this.host}:${this.port}/api/${this.apikey}`, (error, response) => {
			callback(error, !!error ? null : JSON.parse(response))
		})
	}

	test(host, port, apikey, callback) {
		http.get(`http://${host}:${port}/api/${apikey}`, (error, response) => {
			callback(error, !!error ? null : JSON.parse(response))
		})
	}

	getDiscoveryData(callback) {
		http.get(`http://phoscon.de/discover`, (error, response) => {
			callback(error, !!error ? null : JSON.parse(response)[0])
		})
	}

	discover(callback) {
		this.log('[SETTINGS-API] start discovery')
		this.getDiscoveryData((error, discoveryResponse) => {
			if(error || discoveryResponse == null){
				this.log('[SETTINGS-API] discovery failed', error)
				callback('Unable to find a deCONZ gateway', null)
			} else {
				this.log('[SETTINGS-API] discovery successfull, starting registration', error)
				http.get(`http://${discoveryResponse.internalipaddress}:${discoveryResponse.internalport}/api`, (error, registerResponse,  statusCode) => {
					if(error){
						this.log('[SETTINGS-API] registration failed', error)
						callback('Found a unreachable gateway', null)
					} else if (statusCode === 403) {
						this.log('[SETTINGS-API] registration incomplete, authorization needed')
						callback(null, {message: 'Successfuly discovered the deCONZ gateway! Please go to settings→gateway→advanced and click on authenticate in the phoscon before continuing.'})
					} else if (statusCode === 200) {
						this.log('[SETTINGS-API] registration successful')
						completeAuthentication(discoveryResponse.internalipaddress, discoveryResponse.internalport, JSON.parse(registerResponse)[0].success.username, callback)
					} else {
						callback('Unknown error', null)
					}
				})
			}
		})
	}

	authenticate(host, port, callback){
		this.log('[SETTINGS-API] start authenticate', host, port)
		http.get(`http://${host}:${port}/api`, (error, response,  statusCode) => {
			if (statusCode === 403) {
				this.log('[SETTINGS-API] authenticate failed, authorization needed')
				callback(null, {message: 'Please go to settings→gateway→advanced and click on authenticate in the phoscon and try again.'})
			} else if (statusCode === 200) {
				this.log('[SETTINGS-API] authenticate successful')
				completeAuthentication(host, port, JSON.parse(response)[0].success.username, callback)
			} else {
				this.log('[SETTINGS-API] authenticate failed', statusCode)
				callback('Unknown error', null)
			}
		})
	}

	completeAuthentication(host, port, apikey, callback){
		this.log('[SETTINGS-API] fetch config')
		http.get(`http://${host}:${port}/api/${apikey}/config`, (error, result) => {
			if (error){
				this.log('[SETTINGS-API] error getting config', error)
				callback('Error getting WS port', null)
			} else {

				Homey.set('host', host, (err, settings) => {
					if (err) return callback(err, null)
				})
				Homey.set('port', port, (err, settings) => {
					if (err) return callback(err, null)
				})
				Homey.set('wsport', JSON.parse(result).websocketport, (err, settings) => {
					if (err) return callback(err, null)
				})
				Homey.set('apikey', apikey, (err, settings) => {
					if (err) return callback(err, null)
				})
				
				this.log('[SETTINGS-API] successfully persisted config')
				callback(null, 'Successfuly discovered and authenticated the deCONZ gateway!')
			}
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
						device.setAvailable()
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

		this.log('state update for', device.getSetting('id'), device.getName()/*, state*/)

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

		if (state.hasOwnProperty('dark')) {
			if (deviceSupports('dark')) {
				device.setCapabilityValue('dark', state.dark)
			}
		}

		if (state.hasOwnProperty('lux')) {
			if (deviceSupports('measure_luminance')) {
				device.setCapabilityValue('measure_luminance', state.lux)
			}
		}

		if (state.hasOwnProperty('presence')) {
			if (deviceSupports('alarm_motion')) {
				device.setCapabilityValue('alarm_motion', state.presence)
			}
		}

		if (state.hasOwnProperty('bri')) {
			if (deviceSupports('dim')) {
				device.setCapabilityValue('dim', state.bri / 255)
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

		if (state.hasOwnProperty('reachable')) {
			(state.reachable || device.getSetting('ignore-reachable') === true) ? device.setAvailable() : device.setUnavailable('Unreachable')
		}

		if (state.hasOwnProperty('water')) {
			if (deviceSupports('alarm_water')) {
				const invert = device.getSetting('invert_alarm') == null ? false : device.getSetting('invert_alarm')
				if (invert === true){
					device.setCapabilityValue('alarm_water', !state.water)
				} else {
					device.setCapabilityValue('alarm_water', state.water)
				}
			}
		}

		if (state.hasOwnProperty('buttonevent') && !initial) {
			device.fireEvent(state.buttonevent, state)
		}
		
		if (state.hasOwnProperty('buttonevent') && state.hasOwnProperty('gesture')) {
			device.fireEvent(state.buttonevent, initial, state.gesture, state)
		}

		if (state.hasOwnProperty('open')) {
			if (deviceSupports('alarm_contact')) {
				const invert = device.getSetting('invert_alarm') == null ? false : device.getSetting('invert_alarm')
				if (invert === true){
					device.setCapabilityValue('alarm_contact', !state.open)
				} else {
					device.setCapabilityValue('alarm_contact', state.open)
				}
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

		if (state.hasOwnProperty('carbonmonoxide')) {
			if (deviceSupports('alarm_co')) {
				device.setCapabilityValue('alarm_co', state.carbonmonoxide)
			}
		}

		if (state.hasOwnProperty('temperature')) {
			if (deviceSupports('measure_temperature')) {
				const offset = device.getSetting('temperature_offset') == null ? 0 : device.getSetting('temperature_offset')
				device.setCapabilityValue('measure_temperature', (state.temperature / 100) + offset)
			}
		}

		if (state.hasOwnProperty('humidity')) {
			if (deviceSupports('measure_humidity')) {
				const offset = device.getSetting('humidity_offset') == null ? 0 : device.getSetting('humidity_offset')
				device.setCapabilityValue('measure_humidity', (state.humidity / 100) + offset)
			}
		}

		if (state.hasOwnProperty('pressure')) {
			if (deviceSupports('measure_pressure')) {
				const offset = device.getSetting('pressure_offset') == null ? 0 : device.getSetting('pressure_offset')
				device.setCapabilityValue('measure_pressure', state.pressure + offset)
			}
		}

		if (state.hasOwnProperty('power')) {
			if (deviceSupports('measure_power')) {
				device.setCapabilityValue('measure_power', state.power)
			}
		}

		if (state.hasOwnProperty('voltage')) {
			if (deviceSupports('measure_voltage')) {
				device.setCapabilityValue('measure_voltage', state.voltage)
			}
		}

		if (state.hasOwnProperty('current')) {
			if (deviceSupports('measure_current')) {
				device.setCapabilityValue('measure_current', state.current / 100)
			}
		}

		if (state.hasOwnProperty('consumption')) {
			if (deviceSupports('meter_power')) {
				device.setCapabilityValue('meter_power', state.consumption / 1000)
			}
		}

		if (state.hasOwnProperty('ct') && state.hasOwnProperty('colormode') && state.colormode === 'ct') {
			if (!deviceSupports(['light_mode', 'light_temperature']) || (state.ct > 500)) return
			device.setCapabilityValue('light_mode', 'temperature')
			device.setCapabilityValue('light_temperature', (state.ct - 153) / 347)
		}

		if (state.hasOwnProperty('hue') && state.hasOwnProperty('colormode') && state.colormode === 'hs') {
			if (!deviceSupports('light_hue')) return
			device.setCapabilityValue('light_hue', parseFloat((state.hue / 65535).toFixed(2)))
		}

		if (state.hasOwnProperty('sat') && state.hasOwnProperty('colormode') && state.colormode === 'hs') {
			if (!deviceSupports('light_saturation')) return
			device.setCapabilityValue('light_saturation', parseFloat((state.sat / 255).toFixed(2)))
		}

		if (state.hasOwnProperty('tampered')) {
			if (deviceSupports('alarm_tamper')) {
				device.setCapabilityValue('alarm_tamper', state.tampered)
			}
		}
	}

	updateConfig(device, config, initial = false) {

		this.log('config update for', device.getSetting('id'), device.getName()/*, config*/)

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
			(config.reachable || device.getSetting('ignore-reachable') === true) ? device.setAvailable() : device.setUnavailable('Unreachable')
		}
	}

	updateDeviceInfo(device, data) {

		this.log('device info update for', device.getSetting('id'), device.getName()/*, data*/)

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

		if (device.getSetting('sensorids') != null && device.getSetting('sensors') != null) {
			device.setSettings({ sensorids: JSON.stringify(device.getSetting('sensors')) });
		}

		if (data.hasOwnProperty('uniqueid') && device.getSetting('mac') != null) {
			device.setSettings({ mac: data.uniqueid.split('-')[0] });
		}
	}

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
		this.get(`http://${this.host}:${this.port}/api/${this.apikey}/config`, (error, result) => {
			callback(error, !!error ? null : result.websocketport)
		})
	}

	initializeActions() {

		let updateAllDevicesManuallyAction = new Homey.FlowCardAction('update_all_devices');
		updateAllDevicesManuallyAction
			.register()
			.registerRunListener(async ( args, state ) => {
				return new Promise((resolve) => {
					try{
						this.log('update all devices manually')
						this.setInitialStates()
					} catch(error){
						return this.error(error);
					}
				});
			});

			let updateIpAddressAction = new Homey.FlowCardAction('update_ip_address');
			updateIpAddressAction
				.register()
				.registerRunListener(async ( args, state ) => {
					return new Promise((resolve) => {
						try{
							this.log('update ip address')
							this.getDiscoveryData((error, response) => {
								if (error) {
									this.log(error)
									return this.error(error)
								}

								if( Object.keys(response).length > 0 && response.internalipaddress && this.host !== response.internalipaddress)
								{
									this.log('ip address has changed', this.host, response.internalipaddress)
									Homey.set('host', response.internalipaddress, (err, settings) => {
										if (err) this.error(err)
									})
									this.startWebSocketConnection()
									this.log('ip address updated successfully')
								}else{
									this.log('no deconz changed gateway found')
								}
							})
						} catch(error){
							return this.error(error);
						}
					});
				});
		
		}

}

module.exports = deCONZ