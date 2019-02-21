import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Alert,
  View,
} from 'react-native';

import { Constants, Location, Permissions, Notifications } from 'expo';

import LabelText from './../components/LabelText';
import ButtonText from './../components/ButtonText';
import RoundButton from './../components/RoundButton';
import FormInput from './../components/FormInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";
import Messages from '../constants/Messages';

const win = Dimensions.get('window');

@inject("userStore")
@observer

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: '',
      remember: false,
      is_loading: false,
      error_message: null,
      device_token: null,
    }
  }

  componentDidMount() {
    this.disposes = [
      // reaction(
      //   () => this.props.userStore.restoreUserState,
      //   (restoreUserState) => {
      //     if (restoreUserState.isSuccessful()) {
      //       this.props.navigation.navigate('Home_noTransition', {
      //         navigation_name: 'Home_noTransition',
      //       });
      //     }
      //   }
      // ),

      // reaction(
      //   () => this.props.userStore.loginState,
      //   (loginState) => {
      //     if (loginState.isSuccessful()) {
      //       this.setState({
      //           is_loading: false, remember: false, email: '', password: ''
      //       }, () => {
      //           this.props.navigation.navigate('Home', {
      //             navigation_name: 'Home',
      //           });
      //       });
      //     }
      //     else if(loginState.isNetworkProblems()) {
      //       this.setState({is_loading: false, error_message: Messages.network_error_message});
      //     }
      //     else {
      //       this.setState({is_loading: false, show_error: true, error_message: loginState.error}); 
      //     }
      //   }),
    ];

    this.props.userStore.restoreUser();
    this.getLocationAsync();
    this.registerForPushNotifications();
  }

  componentWillUnmount() {
    this.disposes.forEach(dispose => dispose());
  }

  async registerForPushNotifications() {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== 'granted') {
        return;
      } else {
        const token = await Notifications.getExpoPushTokenAsync();
        this.subscription = Notifications.addListener(this.handleNotification);
        this.setState({
          device_token: token,
        });
      }
    } else {
    } 
  }

  handleNotification(notification) {
  }

  async getLocationAsync()  {
   let { status } = await Permissions.askAsync(Permissions.LOCATION);
   if (status !== 'granted') {
	   	Alert.alert(
	      '',
	      'Permission to access location was denied',
	      [
	        {text: 'OK', onPress: () => console.log('OK Pressed')},
	      ],
	      { cancelable: false }
	    );
   } else {
   	 	this.props.userStore.hasLocationPermissions = true;
   	 	try {
        	location = await Location.getCurrentPositionAsync();
      	} catch (e) {
	        console.log('error', e);
      	}  
   }
  };

  onRemember() {
    this.setState({ remember: !this.state.remember});
  }

  onSignUp() {
    this.props.navigation.navigate('SignUp', {
    	device_token: this.state.device_token
    });
  }

  onForgot() {
    this.props.navigation.navigate('Forgot'); 
  }

  onLogin() {
    if (this.state.is_loading) return;

    this.props.navigation.navigate('Home_noTransition', {
      navigation_name: 'Home_noTransition',
    });

    if (this.state.email == null || this.state.email == "") {
      this.setState({ error_message: Messages.invalid_email_message });
      return;
    }

    if (this.state.password == null || this.state.password == "") {
      this.setState({ error_message: Messages.invalid_password_message });
      return;
    }

    

    // this.setState({ is_loading: true});
    // this.props.userStore.login(this.state.email, this.state.password, this.state.remember, this.state.device_token);
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView style={{backgroundColor: 'white'}}>
        <View style={styles.container}>
        <View style={styles.form}>
          <Image
            style={styles.logoImage} resizeMode="contain"
            source={require('./../assets/images/logo.png')}
          />

          <View style={[styles.formInput, {marginBottom: 15}]}>
            <Image style={styles.prefixIcon} source={require('./../assets/images/email_icon.png')} />
            <FormInput style={styles.inputField} hasIcon={true} placeholder="Email" type="email" value={this.state.email} onChangeText={(text) => this.setState({email: text, error_message: null})} />
          </View>

          <View style={styles.formInput}>
            <Image style={styles.prefixIcon} source={require('./../assets/images/password_icon.png')} />
            <FormInput style={styles.inputField} hasIcon={true} placeholder="Password" type="password" value={this.state.password} onChangeText={(text) => this.setState({password: text, error_message: null})}/>
          </View>                       

          <View style={styles.actionView}>
            <TouchableOpacity style={styles.rememberView} onPress={() => this.onRemember()}>
              {
                this.state.remember
                ? <Image style={styles.checkmark} source={require('./../assets/images/checkmark.png')} />
                : <Image style={styles.checkmark} source={require('./../assets/images/checkmark_empty.png')} />
              }
              
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.onForgot()}>
              <Text style={styles.forgotText} textDecorationLine="underline">Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <RoundButton style={styles.loginButton} title="LOGIN" isLoading={this.state.is_loading} onPress={() => this.onLogin()}></RoundButton>
          {
            this.state.error_message
            ? <Text style={styles.errorMessage}>{this.state.error_message}</Text>
            : null
          }
        </View>

        <View style={styles.bottomView}>
          <LabelText style={styles.labelText}>New user?</LabelText>
          <TouchableOpacity onPress={() => this.onSignUp()}>
            <ButtonText>Register Here</ButtonText>
          </TouchableOpacity>
        </View>
      </View>
      </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: win.height,
    paddingTop: Constants.statusBarHeight,
  },

  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    width: win.width,
    height: win.width,
  },

  logoImage: {
    height: 150,
    marginBottom: 50,
    backgroundColor: 'transparent'
  },

  prefixIcon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },

  form: {
    alignItems: "center",
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    height: undefined,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 100
    
  },

  formInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },

  actionView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
  },

  rememberView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  rememberText: {
    color: '#494949',
    fontFamily: 'opensans-regular',
    fontSize: 13,
  },

  forgotText: {
    color: '#494949',
    fontFamily: 'opensans-regular',
    fontSize: 13,
  },

  checkmark: {
    width: 22,
    height: 22,
    marginRight: 7,
  },

  loginButton: {

  },

  bottomView: {
    position: 'absolute',
    bottom: 50,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },

  errorMessage: {
    color: 'red',
    fontFamily: 'opensans-regular',
    fontSize: 12,
    marginTop: 5,
  },

  labelText: {
    marginRight: 5,
  },

});
