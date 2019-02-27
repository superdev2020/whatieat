import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity} from 'react-native';
import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";
import { PREFERENCES } from '../../constants/Mockup';
import { BASE_URL } from '../../constants/API';

const win = Dimensions.get('window');



@inject("userStore", "foodStore")
@observer
export default class Preference extends React.Component {


	constructor(props) {
		super(props);
		this.navigation = props.route.navigation;
		this.state = {
			data: []
		}
	}

	componentDidMount() {
    this.disposes = [
      reaction(
				() => this.props.foodStore.getFoodListState,
				(getFoodListState) => {
					if (getFoodListState.isSuccessful()) {
						this.setState({data: this.props.foodStore.lists});
					}
				}
			),
    ];
		this.props.foodStore.loadFoodList(this.props.userStore.currentUser.user_id);
  }

  componentWillUnmount() {
    this.disposes.forEach(dispose => dispose());
  }

	_renderFood = (item, i) => {
		if( i > 2)
			return null;
		const uri = `${BASE_URL}images/${item.icon}`;
		return (
			<View key={item.food_id} style={[styles.foodOutWrapper]}>
				<View style={styles.foodInnerWrapper}>
					<Image style={styles.image} source={{uri: uri}} resizeMode="cover" /> 
					<View style={[styles.food, {width: '100%'}]}>
						<Text style={[styles.footName]}>{item.name}</Text>
					</View>
				</View>
			</View>
		);
	}


	_ItemSeparator = () => <View style={styles.separator} />;

	_renderCategory = (cat) => {
		return (
			(cat.selected == 0 || cat.foods.length == 0)
			? null
			: <View key={cat.cat_id} style={styles.row}>
					<View style={styles.catTitle}>
						<Text style={{ fontWeight: 'bold', fontSize: 13 }}>{cat.cat_name}<Text style={{ fontWeight: 'normal' }}> | {cat.selected} Selected out of {cat.total} </Text></Text>
						{
							cat.selected > 3
							? <TouchableOpacity onPress={() => {
								this.navigation.navigate('SeeAll', {
									cat: cat
								});
							}}><Text style={{ color: '#ef9149', fontSize: 13 }}>SEE ALL</Text></TouchableOpacity>
							: null
						}
						
					</View>
					<View style={styles.imageGroup}>
						{
							cat.foods.map((food, i) => (
								food.f_id == null ? null : this._renderFood(food, i)
							))
						}
					</View>
				</View>
		);
	};
	render() {
		return (
			<ScrollView
				style={styles.container}
				contentContainerStyle={styles.content}
			>
				<View style={{marginTop: 10}}>
				{
					this.state.data.map((source, i) => (
						this._renderCategory(source)
					))
				}
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({

	container: {
		backgroundColor: '#fff',
		marginBottom: 20
	},

	foodOutWrapper: {
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: 5,
		paddingRight: 5,
		position: 'relative',
		marginBottom: 10,
		width: '33.3333%'
	},

	foodInnerWrapper: {
		alignItems: 'center',
		justifyContent: 'center',
		position: 'relative',
		shadowColor: '#888',
		shadowOffset: { width: 50, height: 50 },
		shadowOpacity: 1,
		shadowRadius: 50,
		elevation: 5,
		borderWidth: 0.1,
		borderColor: '#ebebeb',
		width: '100%'
	},

	catTitle: {
		fontSize: 8,
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingLeft: 15,
		paddingRight: 15
	},
	
	image: {
		width: '100%',
		height: ((win.width - 40) / 3  - 10),
	},

	footName: {
		width: '100%', textAlign: 'center',
		paddingTop: 3, paddingBottom: 3,
		backgroundColor: 'white',
		fontSize: 12
	},

	item: {
		backgroundColor: 'white',
		flexDirection: 'row',
		alignItems: 'center',
		padding: 18
	},

	imageGroup: {
		marginTop: 20,
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap',
		paddingLeft: 10,
		paddingRight: 10
		
	},
	row: {
		marginTop: 10,
	},
	avatar: {
		height: 36,
		width: 36,
		borderRadius: 18,
		backgroundColor: '#e91e63',
		alignItems: 'center',
		justifyContent: 'center',
	},
	letter: {
		color: 'white',
		fontWeight: 'bold',
	},
	details: {
		margin: 8,
	},
	name: {
		fontWeight: 'bold',
		fontSize: 14,
		color: 'black',
	},
	number: {
		fontSize: 12,
		color: '#999',
	},
	separator: {
		height: StyleSheet.hairlineWidth,
		backgroundColor: 'rgba(0, 0, 0, .08)',
	},
});