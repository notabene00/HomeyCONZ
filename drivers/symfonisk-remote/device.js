'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey')

class SymfoniskRemote extends Sensor {
	
	onInit() {
		super.onInit()
		
		this.setTriggers()
		
		this.log(this.getName(), 'has been initiated')
	}
	
	fireEvent(number) {
		switch (number) {
			case 1002:
				this.log('pressed once')
				this.triggerPressedOnce.trigger(this)
				break		
			case 1004:
				this.log('pressed twice')
				this.triggerPressedTwice.trigger(this)
				break
			case 1005:
				this.log('pressed threefold')
				this.triggerPressedThreefold.trigger(this)
				break
			case 2001:
				this.log('Start clock wise turn');
				this.triggerStartCW.trigger(this);
				break
			/*case 2003:
				this.log('Stop clock wise turn')
				this.triggerStopCW.trigger(this)
				break*/
			case 3001:
				this.log('Start counter clock wise turn');
				this.triggerStartCCW.trigger(this);
				break
			/*case 3003:
				this.log('Stop counter clock wise turn')
				this.triggerStopCCW.trigger(this)
				break*/
		}
	}
	
	setTriggers() {
		this.triggerPressedOnce = new Homey.FlowCardTriggerDevice('1_button_press').register()
		this.triggerPressedTwice = new Homey.FlowCardTriggerDevice('2_button_press').register()
		this.triggerPressedThreefold = new Homey.FlowCardTriggerDevice('3_button_press').register()
		this.triggerStartCCW = new Homey.FlowCardTriggerDevice('start_ccw_rotate').register()
		//this.triggerStopCCW = new Homey.FlowCardTriggerDevice('stop_ccw_rotate').register()
		this.triggerStartCW = new Homey.FlowCardTriggerDevice('start_cw_rotate').register()
		//this.triggerStopCW = new Homey.FlowCardTriggerDevice('stop_cw_rotate').register()
	}
	
}

module.exports = SymfoniskRemote