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

@inject("userStore", "smsStore")
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
      phone_number: '',
      is_loading: false,
      error_message: null,
      show_result: false,
      home_navigation_name: '',
    }
  }

  async componentDidMount() {
    this.disposes = [
      reaction(
        () => this.props.smsStore.postSMSState,
        (postSMSState) => {
          if (postSMSState.isSuccessful()) {
            this.setState({ show_result: true, is_loading: false });
          }
        }
      ),
    ];

    const home_navigation_name = this.props.navigation.getParam("home_navigation_name");
    this.setState({
      home_navigation_name: home_navigation_name
    });
  }

  componentWillUnmount() {
    this.disposes.forEach(dispose => dispose());
  }

  onSendSMS() {
    const phone_number = this.phone.getValue();
    if (phone_number == null || phone_number.length == 0 || !this.phone.isValidNumber()) {
      this.setState({ error_message: Messages.invalid_phone_message });
      return;
    }

    this.setState({ is_loading: true, error_message: null });
    this.props.smsStore.postSMS(
      this.props.userStore.currentUser.user_id,
      phone_number,
    );
  }

  goToHome() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'Home_noTransition' })],
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
            <RoundButton style={styles.button} title="SEND PROFILE" floatSize={true} isLoading={this.state.is_loading} onPress={() => this.onSendSMS()}></RoundButton>
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
              'Your profile is sent successfully!!!',
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
