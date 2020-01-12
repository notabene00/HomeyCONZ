'use strict'

const Homey = require('homey')
const { http } = require('../node_modules/nbhttp')

class Light extends Homey.Device {

	onInit() {
		this.host = Homey.ManagerSettings.get('host')
		this.apikey = Homey.ManagerSettings.get('apikey')
		this.port = Homey.ManagerSettings.get('port')
		this.id = this.getSetting('id')
		this.address = `/lights/${this.id}/state`
		this.sensors = this.getSetting('sensors')

		this.isBlinds = this.getClass() === 'windowcoverings'

		this.registerInApp()

		let capabilities = this.getCapabilities()

		if (capabilities.includes('onoff')) {
			this.registerOnoffListener()
		}

		if (capabilities.includes('dim')) {
			this.dimDuration = this.getSetting('dim_duration') || 1
			this.registerDimListener()
		}

		if (capabilities.includes('light_temperature')) {
			this.registerCTListener()
		}

		if (capabilities.includes('light_hue') && capabilities.includes('light_saturation')) {
			this.registerColorListener()
		}

		this.setInitialState()
	}

	registerInApp() {
		Homey.app.devices.lights[this.id] = this
		if (this.sensors) {
			this.sensors.forEach(id => {
				Homey.app.devices.sensors[id] = this
			})
		}
	}

	setInitialState() {
		Homey.app.getLightState(this, (error, state) => {
			if (error) {
				return this.error(error)
			}
			Homey.app.updateState(this, state, true)
		})
	}

	registerOnoffListener() {
		this.registerCapabilityListener('onoff', (value, opts, callback) => {
			let power = this.isBlinds ? !value : value
			this.setPower(power, callback)
		})
	}

	registerDimListener() {
		this.registerCapabilityListener('dim', (value, opts, callback) => {
			let dim = this.isBlinds ? 1 - value : value
			this.dim(dim, this.dimDuration, (err, result) => {
				callback(err, result)
			})
		})
	}

	registerCTListener() {
		this.registerCapabilityListener('light_temperature', (value, opts, callback) => {
			let ct = value * 347 + 153
			this.setCapabilityValue('light_mode', 'ct')
			this.setColorTemperature(ct, callback)
		})
	}

	registerColorListener() {
		this.registerCapabilityListener('light_hue', (hue, _, callback) => {
			this.hue = hue
			callback(null, true)
		})
		this.registerCapabilityListener('light_saturation', (saturation, _, callback) => {
			this.log('sat', saturation)
			this.setColor(this.hue, saturation, callback)
		})
	}

	put(path, data, callback) {
		let headers = {
			'Content-Type': 'application/json',
			'Content-Length': JSON.stringify(data).length
		}
		http.put(this.host, this.port, `/api/${this.apikey}${path}`, headers, data, (error, data) => {
			callback(error, !!error ? null : JSON.parse(data))
		})
	}

	setPower(value, callback) {
		this.put(this.address, {on: value}, callback)
	}

	dim(level, duration, callback) {
		this.put(this.address, {on: true, bri: level * 255, transitiontime: duration}, callback)
	}

	setColorTemperature(value, callback) {
		this.put(this.address, {ct: value}, callback)
	}

	setColor(hue, sat, hue_callback, saturation_callback) {
		this.put(this.address, {hue: hue * 65534, sat: sat * 255}, hue_callback, saturation_callback)
	}

}

module.exports = Light
