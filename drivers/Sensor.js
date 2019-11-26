'use strict'

const Homey = require('homey')

class Sensor extends Homey.Device {
	
	onInit() {
		this.host = Homey.ManagerSettings.get('host')
		this.apikey = Homey.ManagerSettings.get('apikey')
		this.port = Homey.ManagerSettings.get('port')
		this.id = this.getSetting('id')
		
		this.registerInApp()
		
		this.setInitialState()
	}
	
	registerInApp() {
		if (typeof(this.id) === 'object') {
			this.id.forEach(id => {
				Homey.app.devices.sensors[id] = this
			})
		} else {
			Homey.app.devices.sensors[this.id] = this
		}
	}

	setInitialState() {
		Homey.app.getSensorState(this, (error, state) => {
			if (error) {
				return this.error(error)
			}
			Homey.app.updateState(this, state, true)
		})
	}
	
}

module.exports = Sensor