'use strict'

const Homey = require('homey')
const { http, https } = require('./../nbhttp')

class Sensor extends Homey.Device {
	
	onInit() {
		this.host = Homey.ManagerSettings.get('host')
		this.apikey = Homey.ManagerSettings.get('apikey')
		this.port = Homey.ManagerSettings.get('port')
		this.id = this.getSetting('id')
		
		this.registerInApp()
		
		// randomize this s.t we're not performing too many requests at once that could cause timeouts
		this.initializeTimeout = setTimeout(() => {
			this.setInitialState()
		}, Math.random() * 30 * 1000)
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

			if(state && state.config && state.config.tampered){
				this.addCapability("tampered");
			}

			Homey.app.updateState(this, state, true)
		})
	}
	
	getSwitchEventTokens(number) {

		let buttonIndex = (number - (number % 1000) ) / 1000;
		let actionIndex = number % 1000;
		let action = 'unknown';

		switch(actionIndex){
			case 0: 
				action = 'initial_press';
				break;
			case 1: 
				action = 'hold';
				break;
			case 2: 
				action = 'release_after_press';
				break;
			case 3: 
				action = 'release_after_hold';
				break;
			case 4: 
				action = 'double_press';
				break;
			case 5: 
				action = 'tripple_press';
				break;
			case 6: 
				action = 'quadruple_press';
				break;
			case 7: 
				action = 'shake';
				break;
			case 8: 
				action = 'drop';
				break;
			case 9: 
				action = 'tilt';
				break;
			case 10: 
				action = 'many_presses';
				break;
		}

		return { rawEvent: number, buttonIndex: buttonIndex, actionIndex: actionIndex, action: action };
	}

	// updates the config of the device in deConz itself
	putSensorConfig(data, callback){
		http.put(this.host, this.port, `/api/${this.apikey}/sensors/${this.id}`, data, (error, response) => {
			callback(error, !!error ? null : JSON.parse(response))
		})
	}
}

module.exports = Sensor