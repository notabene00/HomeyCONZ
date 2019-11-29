'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey')

class AqaraMotion extends Sensor {
	
	onInit() {
		super.onInit()
				
		this.setTriggers()
		this.log(this.getName(), 'has been initiated')	
	}
	
	setTriggers() {
		this._flowTriggerML = new Homey.FlowCardTriggerDevice('motion_with_luminance').register()
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
					// триггерим триггер с тэгом освещенности
					this._flowTriggerML.trigger(this, {luminance: super.getCapabilityValue('measure_luminance')})
				}
			}
		} else {
			super.setCapabilityValue(name, value)
		}
	}
	
}

module.exports = AqaraMotion