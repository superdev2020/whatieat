import { observable, action } from 'mobx';
import { AsyncState } from '../models';
import { AsyncStorage } from 'react-native';

export default class SmsStore {
	@observable postSMSState = new AsyncState();

	constructor(ctx) {
		this.ctx = ctx;
	}

	@action
	async postSMS(user_id, phone_number) {
		this.postSMSState = new AsyncState('IN_PROGRESS');
		try {
			const response = await this.ctx.callApi('sms/post.php', {
				method: 'POST',
				body: {
					user_id: user_id,
					phone_number: phone_number,
				}
			});

			console.log('response', response);
			const data = await response.json();

			if (data.status) {
				this.postSMSState = new AsyncState('SUCCESS', { ...data });
			}
			else {
				this.postSMSState = new AsyncState('API_ERROR', null, data.message);
			}
		} catch (error) {
			console.log("error = ", error);
			this.postSMSState = new AsyncState('NETWORK_PROBLEMS');
		}
	}
}