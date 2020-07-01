'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey')
const { util } = require('../../util')

class TintRgbRemote extends Sensor {
	
	onInit() {
		super.onInit()
		
		this.setTriggers()
		
		this.log(this.getName(), 'has been initiated')
	}
	
	fireEvent(number, fullState) {

		const tokens = this.getSwitchEventTokens(number);
		const flowState = {buttonIndex: tokens.buttonIndex.toString(), actionIndex: tokens.actionIndex.toString()};

		this.log('TintRgbRemote event (' + number + ') button: ' + tokens.buttonIndex + ', action: '+ tokens.action);

		this.triggerRaw.trigger(this, tokens, flowState);

		if (tokens.buttonIndex === 6){
			const angle = util.round((fullState.angle > 90 ? fullState.angle - 90 : fullState.angle + 270) / 360, 2)
			
			this.triggerHue.trigger(this, { hue: angle })
			this.setCapabilityValue('hue_angle', fullState.angle).catch(this.error)
		}
	}
	
	setTriggers() {
		this.triggerRaw = new Homey.FlowCardTriggerDevice('raw_switch_event')
		.register()
		.registerRunListener((args, state) => {
			return Promise.resolve(
				(args.button === '-1' || args.button === state.buttonIndex))
		});

		this.triggerHue = new Homey.FlowCardTriggerDevice('hue_changed_event')
		.register()
	}
	
}

module.exports = TintRgbRemote