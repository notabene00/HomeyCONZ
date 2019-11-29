'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey')

class TradfriWirelessDimmer extends Sensor {
	
	onInit() {
		super.onInit()
		
		this.setTriggers()
		
		this.log(this.getName(), 'has been inited')
	}
	
	fireEvent(number) {
		switch (number) {
			case 1002:
				this.log('Sharp clock wise turn')
				this.triggerSharpCounterClockwise.trigger(this)
				break
			case 2002:
				this.log('Start clock wise turn')
				this.triggerStartClockwise.trigger(this)
				break
			case 3002:
				this.log('Start counter clock wise turn')
				this.triggerStartCounterClockwise.trigger(this)
				break
			case 4002:
				this.log('Sharp counter clock wise turn')
				this.triggerSharpClockwise.trigger(this)
				break
		}
	}
	
	setTriggers() {
		this.triggerSharpCounterClockwise = new Homey.FlowCardTriggerDevice('sharp_ccw_rotate').register()
		this.triggerStartCounterClockwise = new Homey.FlowCardTriggerDevice('start_ccw_rotate').register()
		this.triggerStartClockwise = new Homey.FlowCardTriggerDevice('sharp_cw_rotate').register()
		this.triggerSharpClockwise = new Homey.FlowCardTriggerDevice('start_cw_rotate').register()
	}
	
}

module.exports = TradfriWirelessDimmer