'use strict'

const Homey = require('homey')
const Light = require('../Light')
const { http } = require('../../nbhttp')

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

		this.initializeActions()

		this.log(this.getName(), 'has been initiated')
	}

	registerInApp() {
		Homey.app.devices.groups[this.id] = this
	}

	getScenesList(callback) {
		http.get(`http://${Homey.app.host}:${Homey.app.port}/api/${Homey.app.apikey}/groups/${this.id}/scenes`, (error, response) => {
			callback(error, !!error ? null : JSON.parse(response))
		})
	}

	recallScene(sceneId, callback) {
		http.put(Homey.app.host, Homey.app.port, `/api/${Homey.app.apikey}/groups/${this.id}/scenes/${sceneId}/recall`, {}, (error, data) => {
			callback(error, !!error ? null : JSON.parse(data))
		})
	}

	setGroupState(state, callback) {
		http.put(Homey.app.host, Homey.app.port, `/api/${Homey.app.apikey}/groups/${this.id}/action`, state, (error, response) => {
			callback(error, !!error ? null : JSON.parse(response))
		})
	}

	initializeActions() {
		let recalSceneAction = new Homey.FlowCardAction('recall_scene');
		recalSceneAction
			.register()
			.registerRunListener(async ( args, state ) => {
				return new Promise((resolve) => {
					this.recallScene(args.scene.id, (error, result) => {
						if (error) {
							return this.error(error);
						}
						resolve(true);
					})
				});
			})
			.getArgument('scene')
			.registerAutocompleteListener(( query, args ) => {
				return new Promise((resolve) => {
					this.getScenesList((error, scenes) => {
						if (error) {
							return this.error(error);
						}
						let result = [];
						Object.entries(scenes).forEach(entry => {
							const key = entry[0];
							const scene = entry[1];
							result.push({name: scene.name, id: key});
						});
						resolve(result);
					})
				});
			});

		let flashGroupShortAction = new Homey.FlowCardAction('flash_group_short');
		flashGroupShortAction
			.register()
			.registerRunListener(async ( args, state ) => {
				const groupState = { alert: 'select' };
				return new Promise((resolve) => {
					this.setGroupState(groupState, (error, result) => {
						if (error) {
							return this.error(error);
						}
						resolve(true);
					})
				});
			});

		let flashGroupLongAction = new Homey.FlowCardAction('flash_group_long');
		flashGroupLongAction
			.register()
			.registerRunListener(async ( args, state ) => {
				const groupState = { alert: 'lselect' };
				return new Promise((resolve) => {
					this.setGroupState(groupState, (error, result) => {
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
				const groupState = { bri_inc: args.relative_brightness * 254 };
				return new Promise((resolve) => {
					this.setGroupState(groupState, (error, result) => {
						if (error) {
							return this.error(error);
						}
						resolve(true);
					})
				});
			});
	}
}

module.exports = Group
