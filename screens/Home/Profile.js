
import * as React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import RoundButton from './../../components/RoundButton';

import { PREFERENCES } from '../../constants/Mockup';

export default class Profile extends React.Component {

	_renderCategory = (cat) => {
		return (
			<View key={cat.cat_name} style={[styles.catItem]}>
				<View style={{justifyContent: 'center', alignItems: 'center'}}>
					<Image style={styles.image} source={cat.image} resizeMode="cover" />
					<View style={styles.badge}>
						<Text style={{color: 'white'}}>{cat.selected}</Text>
					</View>
					<Text style={[styles.catName]}>{cat.cat_name.toUpperCase()}</Text>
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
			<View style={styles.profileWrapper}>
				<View style={styles.avatarWrapper}>
					<Image style={styles.avatar} source={require('../../assets/images/avatar.png')}/>
				</View>
				
				<View style={styles.foodWrapper}>
					<Text style={{fontWeight: 'bold', fontSize: 16, marginTop: 16, zIndex: 0, marginBottom: 16}}>Jone Doe</Text>
					<View style={{justifyContent: 'center', flex: 1, flexDirection: 'row', alignItems: 'center'}}>
						<View style={{marginTop: 10, backgroundColor: 'white', flexDirection: 'row', flexWrap: 'wrap', justfiyContent: 'space-between'}}>
						{
							PREFERENCES.map((cat, i) => (
								this._renderCategory(cat, i)
							))
						}
						</View>
					</View>
					<TouchableOpacity>
						<RoundButton theme="theme2" style={styles.sendButton} title="SEND PROFILE VIA SMS"  onPress={() => {}}></RoundButton>
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
		elevation: 20,
		shadowOffset: { width: 50, height: 50 },
		shadowOpacity: 1,
		shadowRadius: 50,
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
		shadowOffset: { width: 50, height: 50 },
		shadowOpacity: 1,
		shadowRadius: 50,
		elevation: 20,
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