'use strict'

const Light = require('../Light')
const { http } = require('../nbhttp')

class GenericLamp extends Light {
	
	onInit() {
		super.onInit()
		
		this.initializeActions()

		this.log(this.getName(), 'has been initiated')
	}
	
	setLightState(state, callback) {
		http.put(Homey.app.host, Homey.app.port, `/api/${Homey.app.apikey}/lights/${this.id}/state`, state, (error, response) => {
			callback(error, !!error ? null : JSON.parse(response))
		})
	}

	initializeActions() {

		let flashShortAction = new Homey.FlowCardAction('flash_short');
		flashShortAction
			.register()
			.registerRunListener(async ( args, state ) => {
				const lightState = { alert: 'select' };
				return new Promise((resolve) => {
					this.setLightState(lightState, (error, result) => {
						if (error) {
							return this.error(error);
						}
						resolve(true);
					})
				});
			});

		let flashLongAction = new Homey.FlowCardAction('flash_long');
		flashLongAction
			.register()
			.registerRunListener(async ( args, state ) => {
				const lightState = { alert: 'lselect' };
				return new Promise((resolve) => {
					this.setLightState(lightState, (error, result) => {
						if (error) {
							return this.error(error);
						}
						resolve(true);
					})
				});
			});

		let setRelativeBrightnessAction = new Homey.FlowCardAction('relative_brightness');
		setRelativeBrightnessAction
			.register()
			.registerRunListener(async ( args, state ) => {
				const lightState = { bri_inc: args.relative_brightness * 254 };
				return new Promise((resolve) => {
					this.setLightState(lightState, (error, result) => {
						if (error) {
							return this.error(error);
						}
						resolve(true);
					})
				});
			});

		let setRelativeColorTemperatureAction = new Homey.FlowCardAction('relative_colortemperature');
		setRelativeColorTemperatureAction
			.register()
			.registerRunListener(async ( args, state ) => {
				const lightState = { ct_inc: args.relative_colortemperature * 254 };
				return new Promise((resolve) => {
					this.setLightState(lightState, (error, result) => {
						if (error) {
							return this.error(error);
						}
						resolve(true);
					})
				});
			});
	}
}

module.exports = GenericLamp