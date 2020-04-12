'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey')

class GenericWirelessSwitch extends Sensor {
	
	onInit() {
		super.onInit()
		
		this.setTriggers()
		
		this.log(this.getName(), 'has been initiated')
	}
	
	fireEvent(number) {

		let buttonIndex = (number - (number % 1000))/1000;
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

		this.log('button ' + buttonIndex + ', action '+ action);
		this.triggerRaw.trigger(this, {rawEvent: number, button: buttonIndex, actionIndex: actionIndex, action: action});
	}
	
	setTriggers() {
		this.triggerRaw = new Homey.FlowCardTriggerDevice('raw_switch_event').register();

		this.triggerLeftClicked = new Homey.FlowCardTriggerDevice('left_button_clicked').register();
		this.triggerRightClicked = new Homey.FlowCardTriggerDevice('right_button_clicked').register();
		this.triggerBothClicked = new Homey.FlowCardTriggerDevice('both_buttons_clicked').register();
		this.triggerLeftHeld = new Homey.FlowCardTriggerDevice('left_button_held').register();
		this.triggerRightHeld = new Homey.FlowCardTriggerDevice('right_button_held').register();
		this.triggerBothHeld = new Homey.FlowCardTriggerDevice('both_buttons_held').register();
		this.triggerLeftDoubleClicked = new Homey.FlowCardTriggerDevice('left_button_double_clicked').register();
		this.triggerRightDoubleClicked = new Homey.FlowCardTriggerDevice('right_button_double_clicked').register();
		this.triggerBothDoubleClicked = new Homey.FlowCardTriggerDevice('both_buttons_double_clicked').register();
	}
	
}

module.exports = GenericWirelessSwitch