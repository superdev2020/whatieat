
import * as React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import RoundButton from './../../components/RoundButton';
import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";
import { BASE_URL } from '../../constants/API';

import { _allowStateChangesInsideComputed } from 'mobx';

@inject("userStore", "foodStore")
@observer
export default class Profile extends React.Component {

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
				() => this.props.foodStore.getCategoryListState,
				(getCategoryListState) => {
					if (getCategoryListState.isSuccessful()) {
						this.setState({data: this.props.foodStore.categories});
					}
				}
			),
    ];
		this.props.foodStore.loadCategoryList(this.props.userStore.currentUser.user_id);
  }

  componentWillUnmount() {
    this.disposes.forEach(dispose => dispose());
  }

	_clickCat(cat) {

		this.navigation.navigate('SelectFoods', {
			cat: cat
		});
	}

	_renderCategory = (cat) => {

		//return null;
		const uri = `${BASE_URL}images/${cat.icon}`;
		
		return (
			<TouchableOpacity key={cat.category_id} style={[styles.catItem]} onPress={() => {this._clickCat(cat)}}>
				<View style={{justifyContent: 'center', alignItems: 'center'}}>
					<Image style={styles.image} source={{uri: uri}} resizeMode="cover" />
					<View style={styles.badge}>
						<Text style={{color: 'white'}}>{cat.selected == null ? 0 : cat.selected}</Text>
					</View>
					<Text style={[styles.catName]}>{cat.name.toUpperCase()}</Text>
				</View>
			</TouchableOpacity>
		);
	};

	render() {

		const avatar = `${BASE_URL}${this.props.userStore.currentUser.avatar}?time=` + new Date().valueOf();
		console.log('avatar', avatar);
		return (
			<ScrollView
				style={styles.container}
				contentContainerStyle={styles.content}
			>
			<View style={styles.profileWrapper}>
				<View style={styles.avatarWrapper}>
					<Image style={styles.avatar} source={{uri: avatar}}/>
				</View>
				
				<View style={styles.foodWrapper}>
					<Text style={{fontWeight: 'bold', fontSize: 16, marginTop: 16, zIndex: 0, marginBottom: 16}}>Jone Doe</Text>
					<View style={{justifyContent: 'center', flex: 1, flexDirection: 'row', alignItems: 'center'}}>
						<View style={{marginTop: 10, backgroundColor: 'white', flexDirection: 'row', flexWrap: 'wrap', justfiyContent: 'space-between'}}>
						{
							this.state.data.map((cat, i) => (
								this._renderCategory(cat, i)
							))
							//console.log('this.state.data', this.state.data)
						}
						</View>
					</View>
					<TouchableOpacity>
						<RoundButton theme="theme2" style={styles.sendButton} title="SEND PROFILE VIA SMS"  onPress={() => {
							this.navigation.navigate('SendProfile');
						}}></RoundButton>
					</TouchableOpacity>
				</View>
			</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
	},
	content: {
		paddingVertical: 16,
	},
	sendButton: {
		marginTop: 20
	},
	
	catName: {
		width: '100%',
		textAlign: 'center',
		marginTop: 10,
		textTransform: 'uppercase',
		fontSize: 12
	},
	catItem: {
		width: '33.33%',
		paddingLeft: 5, paddingRight: 5,
		marginBottom: 30
	},
	image: {
		width: '100%',
		height: undefined,
		aspectRatio: 1
	},

	avatarWrapper: {
		width: 100,
		height: 100,
		borderRadius: 100,
		zIndex: 1000,
		position: 'relative',
		top: 0,
		elevation: 8,
		shadowOffset: { width: 5, height: 5 },
		shadowOpacity: 1,
		shadowRadius: 5,
	},

	avatar: {
		width: 100,
		height: undefined,
		aspectRatio: 1,
		borderRadius: 100
	},
	foodWrapper: {
		flex: 1, marginTop: -50, paddingTop: 60, 
		// borderWidth: 1, borderColor: '#ebebeb', 
		justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', 
		marginLeft: 20, marginRight: 20, paddingLeft: 10, paddingRight: 10,
		shadowOffset: { width: 8, height: 8 },
		shadowOpacity: 1,
		shadowRadius: 50,
		elevation: 8,
		borderWidth: 1,
		borderColor: '#ebebeb',
		zIndex: 0,
		paddingBottom: 30
	},
	profileWrapper: {justifyContent: 'center', flexDirection: 'column', 
		flex: 1, alignItems: 'center', marginTop: 20, position: 'relative', paddingBottom: 30
	},
	badge: {marginTop: -14, width: 24, height: 24, backgroundColor: '#ee9148', borderRadius: 20, justifyContent: 'center', alignItems: 'center'}
});