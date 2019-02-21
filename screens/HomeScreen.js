import React from 'react';
import {
	Image,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	Dimensions,
	View,
} from 'react-native';

import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import Preference from './Home/Preference';
import Profile from './Home/Profile';

import { Constants } from 'expo';
import { NavigationActions, StackActions } from 'react-navigation';
import ListPage from './Home/ListPage';
import HistoryPage from './Home/HistoryPage';
import SettingsPage from './Home/SettingsPage';
import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";
import LabelText from '../components/LabelText';

const win = Dimensions.get('window');


const FirstRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#ff4081' }]} />
);
const SecondRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
);

@inject("userStore")
@observer

export default class HomeScreen extends React.Component {

	
	
	_handleIndexChange = index =>
    this.setState({
      index,
    });

  _renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={styles.indicator}
      style={styles.tabbar}
      tabStyle={styles.tab}
      labelStyle={styles.label}
    />
  );

  _renderScene = SceneMap({
    preference: Preference,
    profile: Profile
  });
	
	static navigationOptions = {
		header: null,
	};

	constructor(props) {
		super(props)

		this.state = {
			page: 'list',
			navigation_name: '',
			index: 0,
			routes: [
				{ key: 'preference', title: 'Food Preferences' },
				{ key: 'profile', title: 'Profile' },
			],
		}
	}

	componentDidMount() {
		const navigation_name = this.props.navigation.getParam("navigation_name");
		this.setState({
			navigation_name: navigation_name,
		});
	}

	changePage(page) {
		this.setState({ page: page });
	}

	editProfile() {
		this.props.navigation.navigate('EditProfile');
	}

	setting() {
		this.props.navigation.navigate('Settings');
	}

	changePassword() {
		this.props.navigation.navigate('ChangePassword');
	}

	logout() {
		this.props.userStore.logout();

		const resetAction = StackActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: 'Login' })],
		});
		this.props.navigation.dispatch(resetAction);
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.headerView}>
					<LabelText style={styles.settings}></LabelText>
					<LabelText style={styles.title}>HOME</LabelText>
					<TouchableOpacity onPress={() => this.setting()}>
						<Image style={styles.settings} source={require('../assets/images/btn-setting.png')} resizeMode="contain"/>
					</TouchableOpacity>
				</View>
				<TabView
					navigationState={this.state}
					renderScene={SceneMap({
						preference: Preference,
						profile: Profile,
					})}
					renderTabBar={this._renderTabBar}
					onIndexChange={index => this.setState({ index })}
					initialLayout={{ width: Dimensions.get('window').width, height: win.height }}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},

	tabbar: {
		backgroundColor: '#ffffff',
		
  },
  tab: {
    width: win.width / 2,
  },
  indicator: {
		backgroundColor: '#ee9148',
		height: 3
  },
  label: {
		fontWeight: '400',
		color: '#000',
		textTransform: 'none',
		fontSize: 13
	},
	
	headerView: {
		backgroundColor: '#fff',
		width: '100%',
		height: 80,
		flexDirection: 'row',
		paddingTop: Constants.statusBarHeight,
		alignItems: 'center',
		zIndex: 2,
		justifyContent: 'space-between'
	},

	title: {
		fontSize: 16,
		fontWeight: 'bold'
	},

	settings: {
		height: 26,
		width: 26,
		marginLeft: 20, marginRight: 20
	},

	headerIcon: {
		width: 54,
		height: 50,
	},

	bottomView: {
		backgroundColor: '#fff',
		position: 'absolute',
		bottom: 0,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#888',
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0.3,
		shadowRadius: 5,
		elevation: 3,
		zIndex: 2,
	},

	addButton: {
		position: 'absolute',
		top: -25,
	},

	historyButton: {
		position: 'absolute',
		left: win.width / 4 - 45,
		top: 10,
	},

	settingsButton: {
		position: 'absolute',
		left: win.width * 3 / 4,
		top: 10,
	},

	bottomBackgroundImage: {
		width: '100%',
		height: 50,
	},
});
