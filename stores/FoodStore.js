import { observable, action } from 'mobx';
import { AsyncState } from '../models';
import { AsyncStorage } from 'react-native';

export default class FoodStore {
	@observable restoreFoodListState = new AsyncState();
	@observable postFoodState = new AsyncState();
	@observable getFoodListState = new AsyncState();
	@observable getCategoryListState = new AsyncState();
	@observable getFoodListByCategoryState = new AsyncState();
	

	constructor(ctx) {
		this.ctx = ctx;
		this.lists = [];
		this.categories = [];
		this.foodsByCategory = [];

	}

	@action
	async restoreFoodList() {
		const lists = await AsyncStorage.getItem('__foodLists__');
		if (lists) {
			const interlists = JSON.parse(lists);
			this.lists = lists;
		}
		this.restoreFoodListState = new AsyncState('SUCCESS', { ...this.lists });
	}

	@action
	async postFood(user_id, food_id, selected, item) {
		this.postFoodState = new AsyncState('IN_PROGRESS');
		try {
			const response = await this.ctx.callApi('categories/set_food.php', {
				method: 'POST',
				body: {
					user_id: user_id,
					food_id: food_id,
					selected: selected
				}
			});

			const data = await response.json();

			if (data.status) {
				// const nda = data.nda;
				// this.lists.push(nda);
				await AsyncStorage.setItem('__foodLists__', JSON.stringify(this.lists));

				this.postFoodState = new AsyncState('SUCCESS', { ...item });
			}
			else {
				this.postFoodState = new AsyncState('API_ERROR', null, data.message);
			}
		} catch (error) {
			console.log("error = ", error);
			this.postFoodState = new AsyncState('NETWORK_PROBLEMS');
		}
	}

	@action
	async loadFoodList(user_id) {
		this.getFoodListState = new AsyncState('IN_PROGRESS');
		try {
			const response = await this.ctx.callApi('categories/get_list_foods_by_user.php', {
				method: 'POST',
				body: {
					user_id: user_id,
				}
			});

			
			const data = await response.json();

			//console.log('loadFoodList=', data);
			if (data.status) {
				const list = data.list;
				this.lists = list;
				await AsyncStorage.setItem('__foodLists__', JSON.stringify(this.lists));
				this.getFoodListState = new AsyncState('SUCCESS', { ...list });
			}
			else {
				this.getFoodListState = new AsyncState('API_ERROR', null, data.message);
			}
		} catch (error) {
			console.log("error = ", error);
			this.getFoodListState = new AsyncState('NETWORK_PROBLEMS');
		}
	}

	@action
	async loadCategoryList(user_id) {
		this.getCategoryListState = new AsyncState('IN_PROGRESS');
		try {
			const response = await this.ctx.callApi('categories/get_list_categories_by_user.php', {
				method: 'POST',
				body: {
					user_id: user_id,
				}
			});

			const data = await response.json();
			if (data.status) {
				const categories = data.list;
				this.categories = categories;
				await AsyncStorage.setItem('__categoryLists__', JSON.stringify(this.categories));
				this.getCategoryListState = new AsyncState('SUCCESS', { ...categories });
			}
			else {
				this.getCategoryListState = new AsyncState('API_ERROR', null, data.message);
			}
		} catch (error) {
			console.log("error = ", error);
			this.getCategoryListState = new AsyncState('NETWORK_PROBLEMS');
		}
	}

	@action
	async loadFoodListByCategory(user_id, category_id) {
		this.getFoodListByCategoryState = new AsyncState('IN_PROGRESS');
		try {
			const response = await this.ctx.callApi('categories/get_list_foods_by_user_category.php', {
				method: 'POST',
				body: {
					user_id: user_id,
					category_id: category_id
				}
			});
			const data = await response.json();

			
			if (data.status) {
				const foodsByCategory = data.list;
				this.foodsByCategory = foodsByCategory;
				await AsyncStorage.setItem('__categoryLists__', JSON.stringify(this.foodsByCategory));
				this.getFoodListByCategoryState = new AsyncState('SUCCESS', { ...foodsByCategory });
			}
			else {
				this.getFoodListByCategoryState = new AsyncState('API_ERROR', null, data.message);
			}
		} catch (error) {
			console.log("error = ", error);
			this.getFoodListByCategoryState = new AsyncState('NETWORK_PROBLEMS');
		}
	}

	async setFood(user_food_id, user_id, food_id, category_id) {

		console.log('user_food_id', user_food_id);
		console.log('user_id', user_id);
		console.log('food_id', food_id);
		console.log('category_id', category_id);

		this.getFoodListByCategoryState = new AsyncState('IN_PROGRESS');
		try {
			const response = await this.ctx.callApi('categories/set_food.php', {
				method: 'POST',
				body: {
					food_id: food_id,
					user_id: user_id,
					user_food_id: user_food_id
				}
			});

			//console.log('response', response);
			const data = await response.json();

			console.log('setFood=', data);
			if (data.status) {
				this.loadFoodListByCategory(user_id, category_id);
				this.loadCategoryList(user_id);
				this.loadFoodList(user_id);
				
			}
			else {
				this.getFoodListByCategoryState = new AsyncState('API_ERROR', null, data.message);
			}
		} catch (error) {
			console.log("error = ", error);
			this.getFoodListByCategoryState = new AsyncState('NETWORK_PROBLEMS');
		}
	}

}