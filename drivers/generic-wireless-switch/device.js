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

		this.log('generic switch event (' + number + ') button: ' + buttonIndex + ', action: '+ action);

		const tokens = {rawEvent: number, buttonIndex: buttonIndex, actionIndex: actionIndex, action: action};
		const state = {buttonIndex: buttonIndex.toString(), actionIndex: actionIndex.toString()};

		this.triggerRaw.trigger(this, tokens, state);
	}
	
	setTriggers() {
		this.triggerRaw = new Homey.FlowCardTriggerDevice('raw_switch_event')
		.register()
		.registerRunListener((args, state) => {
			return Promise.resolve(
				(args.button === '-1' || args.button === state.buttonIndex) &&
				(args.action === '-1' || args.action === state.actionIndex));
		});
	}
	
}

module.exports = GenericWirelessSwitch