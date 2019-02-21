import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  View,
} from 'react-native';

import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";
import { NavigationActions, StackActions } from 'react-navigation';

@inject("userStore")
@observer

export default class SettingsScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Settings',
    }
  };

  constructor(props) {
    super(props);
    this.state = {
        geoLocation: false,
        notificaiton: false,
    }
  }

  editProfile() {
		this.props.navigation.navigate('EditProfile');
	}

	changePassword() {
		this.props.navigation.navigate('ChangePassword');
  }
  
  logout() {
		//this.props.userStore.logout();

		const resetAction = StackActions.reset({
			index: 0,
			actions: [NavigationActions.navigate({ routeName: 'Login' })],
		});
		this.props.navigation.dispatch(resetAction);
	}

  componentDidMount() {
    this.disposes = [
      // reaction(
      //   () => this.props.userStore.updateUserSettingState,
      //   (updateUserSettingState) => {
      //     if (updateUserSettingState.isSuccessful()) {
      //     }
      //   }
      // ),
    ];

    // const geoLocation = this.props.userStore.geoLocationIsEnabled();
    // const notification = this.props.userStore.notificationIsEnabled();
    
    // this.setState({
    //   geoLocation: geoLocation,
    //   notificaiton: notification
    // });
  }

  onChangeGeoLocation(value) {
    // this.setState({
    //     geoLocation: value
    // }, () => {
    //   this.props.userStore.updateUserSettings(this.props.userStore.currentUser.user_id, this.state.geoLocation, this.state.notificaiton);
    // });    
  }

  onChangeNotification(value) {
    // this.setState({
    //     notificaiton: value
    // }, () => {
    //   this.props.userStore.updateUserSettings(this.props.userStore.currentUser.user_id, this.state.geoLocation, this.state.notificaiton);
    // });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.cardView}>
          <TouchableOpacity style={styles.rowView} onPress={() => this.editProfile()}>
            <Text style={styles.titleText}>Profile</Text>
            <Image 
              style={{width: 10, height: 19}}
              source={require('../assets/images/right_arrow_icon.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowView} onPress={() => this.changePassword()}>
            <Text style={styles.titleText}>Change Password</Text>
            <Image 
              style={{width: 10, height: 19}}
              source={require('../assets/images/right_arrow_icon.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowView}>
            <Text style={styles.titleText}>Geo Location</Text>
            <Switch
             onValueChange = {(value) => this.onChangeGeoLocation(value)}
             value = {this.state.geoLocation}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowView}>
            <Text style={styles.titleText}>Notification</Text>
            <Switch
             onValueChange = {(value) => this.onChangeNotification(value)}
             value = {this.state.notificaiton}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowView} onPress={() => this.logout()}>
            <Text style={styles.redTitleText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  cardView: {
    margin: 10,
    borderRadius: 5,
    borderColor: '#e1e1e1',
    borderWidth: 1,
    shadowColor: '#888',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
    backgroundColor: 'white',    
  },

  rowView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 55,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },

  titleText: {
    fontFamily: 'opensans-regular',
    fontSize: 16,
    color: 'black',
  },

  redTitleText: {
    fontFamily: 'opensans-regular',
    fontSize: 16,
    color: '#e12246',
  },

});
