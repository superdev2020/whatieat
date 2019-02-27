import { observable, action } from 'mobx';
import { AsyncState } from '../models';
import { AsyncStorage } from 'react-native';

export default class UserStore {
	@observable restoreUserState = new AsyncState();
	@observable updateUserState = new AsyncState();
	@observable updateUserSettingState = new AsyncState();
	@observable changePasswordState = new AsyncState();
	@observable forgotPasswordState = new AsyncState();
	@observable confirmPinState = new AsyncState();
	@observable loginState = new AsyncState();
	@observable signUpState = new AsyncState();

	constructor(ctx) {
		this.ctx = ctx;
		this.currentUser = null;
		this.hasLocationPermissions = false;
	}

	@action
	async restoreUser() {
		const user = await AsyncStorage.getItem('__currentUser__');
		if (user) {
			const interUser = JSON.parse(user);
			this.currentUser = interUser;
			this.restoreUserState = new AsyncState('SUCCESS', { ...this.currentUser });
		}
		else {
			this.restoreUserState = new AsyncState('API_ERROR');
		}
	}

	@action
	async login(email, password, is_remember, device_token) {
		this.loginState = new AsyncState('IN_PROGRESS');
		try {
			const loginResponse = await this.ctx.callApi('users/login.php', {
				method: 'POST',
				body: {
					email: email,
					password: password,
					device_token: device_token,
				}
			});

			const data = await loginResponse.json();
			console.log('login data', data);
			if (data.status) {
				const user = await data.user;
				this.currentUser = user;
				if (is_remember) {
					await AsyncStorage.setItem('__currentUser__', JSON.stringify(user));
				}
				this.loginState = new AsyncState('SUCCESS', { ...user });
			}
			else {
				this.loginState = new AsyncState('API_ERROR', null, data.message);
			}
		} catch (error) {
			console.log("error = ", error);
			this.loginState = new AsyncState('NETWORK_PROBLEMS');
		}
	}

	@action
	async signUp(first_name, last_name, email, password, phone, device_token) {
		this.signUpState = new AsyncState('IN_PROGRESS');
		try {
			const signUpResponse = await this.ctx.callApi('users/signup.php', {
				method: 'POST',
				body: {
					first_name: first_name,
					last_name: last_name,
					email: email,
					password: password,
					phone: phone,
					device_token: device_token,
				}
			});

			const data = await signUpResponse.json();
			if (data.status) {
				const user = await data.user;
				this.currentUser = user;
				await AsyncStorage.setItem('__currentUser__', JSON.stringify(user));
				this.signUpState = new AsyncState('SUCCESS', { ...user });
			}
			else {
				this.signUpState = new AsyncState('API_ERROR', null, data.message);
			}
		} catch (error) {
			console.log("error = ", error);
			this.signUpState = new AsyncState('NETWORK_PROBLEMS');
		}
	}

	@action
	async updateUser(user_id, first_name, last_name, email, avatar) {
		this.updateUserState = new AsyncState('IN_PROGRESS');
		try {
			const response = await this.ctx.callApi('users/update.php', {
				method: 'POST',
				body: {
					user_id: user_id,
					first_name: first_name,
					last_name: last_name,
					email: email,
					avatar: avatar
				}
			});

			const data = await response.json();
			console.log('user data', data);
			if (data.status) {
				const user = await data.user;
				this.currentUser = user;
				await AsyncStorage.setItem('__currentUser__', JSON.stringify(user));
				this.updateUserState = new AsyncState('SUCCESS', { ...user });
			}
			else {
				this.updateUserState = new AsyncState('API_ERROR', null, data.message);
			}
		} catch (error) {
			console.log("error = ", error);
			this.updateUserState = new AsyncState('NETWORK_PROBLEMS');
		}
	}

	@action geoLocationIsEnabled() {
		let geoLocation = false;
		if (this.currentUser.geo_location == "1" || this.currentUser.geo_location == true) {
			geoLocation = true;
		}

		return geoLocation;
	}

	@action notificationIsEnabled() {
		let notificaiton = false;
		if (this.currentUser.push_notification == "1" || this.currentUser.push_notification == true) {
			notificaiton = true;
		}

		return notificaiton;
	}

	@action
	async updateUserSettings(user_id, geo_location, push_notification) {
		this.updateUserSettingState = new AsyncState('IN_PROGRESS');
		try {
			const response = await this.ctx.callApi('users/update_settings.php', {
				method: 'POST',
				body: {
					user_id: user_id,
					geo_location: geo_location,
					push_notification: push_notification
				}
			});

			const data = await response.json();

			if (data.status) {
				const user = await data.user;
				this.currentUser = user;
				await AsyncStorage.setItem('__currentUser__', JSON.stringify(user));
				this.updateUserSettingState = new AsyncState('SUCCESS', { ...user });
			}
			else {
				this.updateUserSettingState = new AsyncState('API_ERROR', null, data.message);
			}
		} catch (error) {
			console.log("error = ", error);
			this.updateUserSettingState = new AsyncState('NETWORK_PROBLEMS');
		}
	}

	@action
	async changePassword(user_id, old_password, new_password, forgot) {
		this.changePasswordState = new AsyncState('IN_PROGRESS');
		try {
			const response = await this.ctx.callApi('users/change_password.php', {
				method: 'POST',
				body: {
					user_id: user_id,
					old_password: old_password,
					new_password: new_password,
					forgot: forgot,
				}
			});

			const data = await response.json();
			if (data.status) {
				this.changePasswordState = new AsyncState('SUCCESS');
			}
			else {
				this.changePasswordState = new AsyncState('API_ERROR', null, data.message);
			}
		} catch (error) {
			console.log("error = ", error);
			this.changePasswordState = new AsyncState('NETWORK_PROBLEMS');
		}
	}

	@action
	async forgotPassword(email) {
		this.forgotPasswordState = new AsyncState('IN_PROGRESS');
		try {
			const response = await this.ctx.callApi('users/forgot_password.php', {
				method: 'POST',
				body: {
					email: email,
				}
			});

			console.log('forgotPassword', data);
			const data = await response.json();
			if (data.status) {
				this.forgotPasswordState = new AsyncState('SUCCESS');
			}
			else {
				this.forgotPasswordState = new AsyncState('API_ERROR', null, data.message);
			}
		} catch (error) {
			console.log("error = ", error);
			this.forgotPasswordState = new AsyncState('NETWORK_PROBLEMS');
		}
	}

	@action
	async confirmPin(email, pin) {
		this.confirmPinState = new AsyncState('IN_PROGRESS');
		try {
			const response = await this.ctx.callApi('users/confirm_pin.php', {
				method: 'POST',
				body: {
					email: email,
					pin: pin,
				}
			});

			const data = await response.json();

			if (data.status) {
				this.confirmPinState = new AsyncState('SUCCESS', data);
			}
			else {
				this.confirmPinState = new AsyncState('API_ERROR', null, data.message);
			}
		} catch (error) {
			console.log("error = ", error);
			this.confirmPinState = new AsyncState('NETWORK_PROBLEMS');
		}
	}




	@action
	async logout() {
		await AsyncStorage.removeItem('__currentUser__');
		this.currentUser = null;
	}

}