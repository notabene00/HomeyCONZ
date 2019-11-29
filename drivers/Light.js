'use strict'

const Homey = require('homey')
const { http } = require('../node_modules/nbhttp')

class Light extends Homey.Device {
	
	onInit() {
		this.host = Homey.ManagerSettings.get('host')
		this.apikey = Homey.ManagerSettings.get('apikey')
		this.port = Homey.ManagerSettings.get('port')
		this.id = this.getSetting('id')
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
			this.setColorTemperature(ct, callback)
		})
	}
	
	registerColorListener() {
		this.registerMultipleCapabilityListener(['light_hue', 'light_saturation'], (value, opts, callback) => {
			let { light_hue, light_saturation } = value
			this.setColor(light_hue * 65535, light_saturation * 255, callback)
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
		this.put(`/lights/${this.id}/state`, {on: value}, callback)
	}
	
	dim(level, duration, callback) {
		this.put(`/lights/${this.id}/state`, {on: true, bri: level * 255, transitiontime: duration}, callback)
	}
	
	setColorTemperature(value, callback) {
		this.put(`/lights/${this.id}/state`, {ct: value}, callback)
	}
	
	setColor(hue, sat, callback) {
		this.put(`/lights/${this.id}/state`, {hue: hue, sat: sat}, callback)
	}
	
}

module.exports = Light