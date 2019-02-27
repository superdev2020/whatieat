import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
  Keyboard,
  View,
} from 'react-native';

import { Constants, Location } from 'expo';
import RoundButton from './../components/RoundButton';
import PhoneInput from 'react-native-phone-input'
import { NavigationActions, StackActions } from 'react-navigation';

import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";
import Messages from './../constants/Messages';

const win = Dimensions.get('window');

@inject("userStore", "ndaStore")
@observer

export default class SendProfileScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      title: 'SEND MY PROFILE',
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      activity_name: '',
      nda: '',
      signature: '',
      phone_number: '',
      is_loading: false,
      error_message: null,
      show_result: false,
      home_navigation_name: '',
      locationResult: null,
      current_lat: 0,
      current_lng: 0,
    }
  }

  async componentDidMount() {
    this.disposes = [
      reaction(
        () => this.props.ndaStore.postNDAState,
        (postNDAState) => {
          if (postNDAState.isSuccessful()) {
            this.setState({ show_result: true, is_loading: false });
          }
        }
      ),
    ];

    const activity_name = this.props.navigation.getParam("activity_name");
    const nda = this.props.navigation.getParam("nda");
    const signature = this.props.navigation.getParam("signature");
    const home_navigation_name = this.props.navigation.getParam("home_navigation_name");

    const geoLocationEnabled = this.props.userStore.geoLocationIsEnabled();

    if (geoLocationEnabled && this.props.userStore.hasLocationPermissions === true) {
      let location;
      try {
        location = await Location.getCurrentPositionAsync();

        console.log(location);

        this.setState({ current_lat: location.coords.latitude, current_lng: location.coords.longitude });
      } catch (e) {
        console.log('geolocation error', e);
      }
    }


    this.setState({
      activity_name: activity_name,
      nda: nda,
      signature: signature,
      home_navigation_name: home_navigation_name
    });
  }

  componentWillUnmount() {
    this.disposes.forEach(dispose => dispose());
  }

  onReviewNDA() {
    this.props.navigation.goBack();
  }

  onSendNDA() {
    const phone_number = this.phone.getValue();
    if (phone_number == null || phone_number.length == 0 || !this.phone.isValidNumber()) {
      this.setState({ error_message: Messages.invalid_phone_message });
      return;
    }

    var lat = 0;
    var lng = 0;


    this.setState({ is_loading: true, error_message: null });
    this.props.ndaStore.postNDA(
      this.props.userStore.currentUser.user_id,
      this.state.activity_name,
      this.state.nda,
      phone_number,
      this.state.signature,
      this.state.current_lat,
      this.state.current_lng
    );
  }

  goToHome() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: this.state.home_navigation_name })],
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    return (
      <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => Keyboard.dismiss()}>
        <View style={styles.contentView}>
          <Image
            style={styles.phoneIcon}
            source={require('./../assets/images/phone_call_icon.png')}
          />

          <View style={styles.phoneInputContainer}>
            <Text style={styles.titleText}>Enter Partner's Mobile Number</Text>
            <PhoneInput style={styles.phoneInput} ref={(ref) => { this.phone = ref; }} />
            <View style={styles.separatorLine} />
          </View>

          <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <RoundButton style={styles.button} title="SEND PROFILE" floatSize={true} isLoading={this.state.is_loading} onPress={() => this.onSendNDA()}></RoundButton>
            {
              this.state.error_message
                ? <Text style={styles.errorMessage}>{this.state.error_message}</Text>
                : null
            }
          </View>
        </View>
        {
          this.state.show_result
            ? Alert.alert(
              'NDA is posted successfully!!!',
              '',
              [
                { text: 'OK', onPress: () => this.goToHome() },
              ],
              { cancelable: false }
            )
            : null
        }
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: Constants.statusBarHeight,
  },

  contentView: {
    alignItems: 'center',
  },

  phoneIcon: {
    width: 120,
    height: 120,
    marginBottom: 30,
  },

  phoneInputContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    marginBottom: 70,
  },

  separatorLine: {
    backgroundColor: '#e5e5e5',
    height: 1,
    width: win.width - 100,
    position: 'absolute',
    bottom: 0,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 5,
  },

  titleText: {
    fontFamily: 'opensans-regular',
    color: '#8b8b8b',
    textAlign: 'center',
  },

  phoneInput: {
    fontFamily: 'opensans-regular',
    color: '#8b8b8b',
    marginTop: 10,

  },

  button: {
    marginTop: 10,
    width: '70%',
  },

  errorMessage: {
    color: 'red',
    fontFamily: 'opensans-regular',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },
});
