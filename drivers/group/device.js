'use strict'

const Homey = require('homey')
const Light = require('../Light')

class Group extends Light {

	onInit() {
		this.host = Homey.ManagerSettings.get('host')
		this.apikey = Homey.ManagerSettings.get('apikey')
		this.port = Homey.ManagerSettings.get('port')
		this.id = this.getSetting('id')
		this.address = `/groups/${this.id}/action`

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

		this.log(this.getName(), 'has been initiated')
	}

	registerInApp() {
		Homey.app.devices.groups[this.id] = this
	}

}

module.exports = Group
