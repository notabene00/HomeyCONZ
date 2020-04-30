'use strict'

const Sensor = require('../Sensor')
const Homey = require('homey')

class AqaraVibration extends Sensor {
	
	onInit() {
		super.onInit()
				
		this.setTriggers()
		this.setConditions()
		
		this.log(this.getName(), 'has been initiated')	
	}
	
	setTriggers() {
		this.tiltAlarmOn = new Homey.FlowCardTriggerDevice('tilt_alarm_on').register()
		this.tiltAlarmOff = new Homey.FlowCardTriggerDevice('tilt_alarm_off').register()
		this.tiltAlarmToggle = new Homey.FlowCardTriggerDevice('tilt_alarm_toggle').register()
		this.vibrationAlarmOn = new Homey.FlowCardTriggerDevice('vibration_alarm_on').register()
		this.vibrationAlarmOff = new Homey.FlowCardTriggerDevice('vibration_alarm_off').register()
		this.vibrationAlarmToggle = new Homey.FlowCardTriggerDevice('vibration_alarm_toggle').register()
	}

	setConditions() {
		this.isVibrationAlarmActive = new Homey.FlowCardCondition('is_vibration_alarm_active').registerRunListener((args, state, callback) => {
			callback(null, args.device.getCapabilityValue('vibration_alarm'))
		}).register()
		this.isTiltAlarmActive = new Homey.FlowCardCondition('is_tilt_alarm_active').registerRunListener((args, state, callback) => {
			callback(null, args.device.getCapabilityValue('tilt_alarm'))
		}).register()
		this.isVibrationStrengthGreaterThan = new Homey.FlowCardCondition('is_vibration_strength_greater_than').registerRunListener((args, state, callback) => {
			callback(null, args.device.getCapabilityValue('vibration_strength') > args.value)
		}).register()
		this.isTiltAngleGreaterThan = new Homey.FlowCardCondition('is_tilt_angle_greater_than').registerRunListener((args, state, callback) => {
			callback(null, args.device.getCapabilityValue('tilt_angle') > args.value)
		}).register()
		this.isRelativeTiltAngleGreaterThan = new Homey.FlowCardCondition('is_relative_tilt_angle_greater_than').registerRunListener((args, state, callback) => {
			callback(null, args.device.getCapabilityValue('relative_tilt_angle') > args.value)
		}).register()
	}
	
	setCapabilityValue(name, value) {
		super.setCapabilityValue(name, value)
		if (name == 'tilt_angle') {
			// относительный угол
			let relative_angle = value - this.getCapabilityValue('tilt_angle')
			this.setCapabilityValue('relative_tilt_angle', relative_angle)
			// таймер отключения тревоги наклона
			this.timeout = setTimeout(() => {
				this.setCapabilityValue('tilt_alarm', false)
				// this.motionToggleTrigger.trigger(this)
				this.timeout = null
			}, this.getSetting('no_tilt_timeout') * 1000)
			this.setCapabilityValue('tilt_alarm', true)
		}
		if (name == 'vibration_alarm') {
			this.vibrationAlarmToggle.trigger(this)
			if (value) {
				this.vibrationAlarmOn.trigger(this, {strength: super.getCapabilityValue('vibration_strength')})
			} else {
				this.vibrationAlarmOff.trigger(this)
			}
		}
		if (name == 'tilt_alarm') {
			this.tiltAlarmToggle.trigger(this)
			if (value) {
				this.tiltAlarmOn.trigger(this, {
					angle: this.getCapabilityValue('tilt_angle'),
					relative_angle: this.getCapabilityValue('relative_tilt_angle')
				})
			} else {
				this.tiltAlarmOff.trigger(this)
			}
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

module.exports = AqaraVibration