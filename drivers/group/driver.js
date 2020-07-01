'use strict'

const Driver = require('../Driver')

class GroupDriver extends Driver {

	onInit() {
		super.onInit()
		this.log('GroupDriver has been initiated')
	}

	onPairListDevices(_, callback) {
		let capabilitiesArray = [
			['onoff'], 
			['onoff', 'dim'],
			['onoff', 'dim', 'light_temperature'],
			['onoff', 'dim', 'light_temperature', 'light_mode', 'light_saturation', 'light_hue']
		]

		let matchTable = {
			'On/Off light': 0,
			'Dimmable light': 1,
			'Color temperature light': 2,
			'Extended color light': 3,
			'Color light': 3,
			'Smart plug': 0, 
			'On/Off plug-in unit': 0,
			'Window covering device': 1
		}

		this.getGroupsList((groupError, groupDevices) => {
			if (groupError) {
				callback(groupError)
				return
			}
			this.getLightsList((lightError, lights) => {
				if (lightError) {
					callback(lightError)
					return
				}
				let devicesObjects = Object.entries(groupDevices).filter(entry => {
					const group = entry[1]
					return group.lights.length > 0
				}).map(entry => {
					const key = entry[0]
					const group = entry[1]
					let groupLights = Object.entries(lights).filter(entry => {
						const lightKey = entry[0]
						// const light = entry[1]
						return group.lights.includes(lightKey)
					}).map(light => {
						light = light[1]
						return matchTable[light.type]
					})

					return {
						name: group.name,
						data: {
							id: group.etag
						},
						settings: {
							id: key
						},
						capabilities: capabilitiesArray[Math.max.apply(Math, groupLights)]
					}
				})
				callback(null, devicesObjects)
			})
		})
	}
}

module.exports = GroupDriver
