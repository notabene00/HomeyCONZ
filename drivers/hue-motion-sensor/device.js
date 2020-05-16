'use strict'

const Sensor = require('../Sensor')

class HueMotion extends Sensor {
	
	onInit() {
		super.onInit()
				
		this.log(this.getName(), 'has been initiated')
	}
	
	setCapabilityValue(name, value) {
		if (name === 'alarm_motion') {
			if (!value) {
				// сработало "движение не обнаружено"
				// ставим таймер на выключение сработки датчика
				this.timeout = setTimeout(() => {
					super.setCapabilityValue(name, false)
					this.timeout = null
				}, this.getSetting('no_motion_timeout') * 1000)
			} else {
				// сработало "движение обнаружено"
				if (this.timeout) {
					// если есть таймер, очищаем его
					// если таймер есть, то датчик все еще обнаруживает движение
					clearTimeout(this.timeout)
					this.timeout = null
				} else {
					// если таймера нет, заставляем датчик в колобке обнаружить движение
					super.setCapabilityValue(name, true)
				}
			}
		} else {
			super.setCapabilityValue(name, value)
		}
	}
	
	async onSettings( oldSettingsObj, newSettingsObj, changedKeysArr ) {
		this.putSensorConfig({config:{sensitivity:newSettingsObj.sensitivity}}, (error, data) => {
			if (error) {
				throw new Error(error);
			}
		})
	}
	
}

module.exports = HueMotion