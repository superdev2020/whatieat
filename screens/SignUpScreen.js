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
  View
} from 'react-native';

import PhoneInput from 'react-native-phone-input'
import LabelText from './../components/LabelText';
import ButtonText from './../components/ButtonText';
import RoundButton from './../components/RoundButton';
import FormInput from './../components/FormInput';
import { Constants } from 'expo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";
import Messages from '../constants/Messages';

const win = Dimensions.get('window');

@inject("userStore")
@observer

export default class SignUpScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      title: 'Sign Up'.toUpperCase(),
    }
  };

  constructor(props) {
    super(props)

    this.state = {
      first_name: 'aaa',
      last_name: 'bbb',
      email: 'aaaa@gmail.com',
      password: '123456',
      confirm_password: '123456',
      is_loading: false,
      error_message: null,
      device_token: null,
      agree: false
    }
  }

  componentDidMount() {
    this.disposes = [
      reaction(
        () => this.props.userStore.signUpState,
        (signUpState) => {
          if (signUpState.isSuccessful()) {
            this.setState({
              is_loading: false, first_name: '', last_name: '', password: '', email: '', confirm_password: ''
            }, () => {
              this.props.navigation.navigate('Home', {
                navigation_name: 'Home',
              });
            });
          }
          else if (signUpState.isNetworkProblems()) {
            this.setState({ is_loading: false, error_message: Messages.network_error_message });
          }
          else {
            this.setState({ is_loading: false, show_error: true, error_message: signUpState.error });
          }
        }),
    ];

    const device_token = this.props.navigation.getParam("device_token");
    this.setState({ device_token: device_token });
  }

  componentWillUnmount() {
    this.disposes.forEach(dispose => dispose());
  }

  onTerms() {
    this.props.navigation.navigate('Terms');
  }

  onSignUp() {
    if (this.state.is_loading) return;

    if (this.state.first_name == null || this.state.first_name == "") {
      this.setState({ error_message: Messages.invalid_first_name_message });
      return;
    }

    if (this.state.last_name == null || this.state.last_name == "") {
      this.setState({ error_message: Messages.invalid_last_name_message });
      return;
    }

    const phone_number = this.phone.getValue();
    if (phone_number == null || phone_number.length == 0 || !this.phone.isValidNumber()) {
      this.setState({ error_message: Messages.invalid_phone_message });
      return;
    }

    if (this.state.email == null || this.state.email == "") {
      this.setState({ error_message: Messages.invalid_email_message });
      return;
    }

    if (this.state.password == null || this.state.password == "" || this.state.confirm_password == null || this.state.confirm_password == "" || this.state.password != this.state.confirm_password) {
      this.setState({ error_message: Messages.invalid_password_message });
      return;
    }

    this.setState({ is_loading: true, error_message: null });
    this.props.userStore.signUp(this.state.first_name, this.state.last_name, this.state.email, this.state.password, phone_number, this.state.device_token);
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
          <View style={styles.container}>
            <Image
              style={styles.logoImage} resizeMode="contain"
              source={require('./../assets/images/logo.png')}
            />
            <View style={{ flexDirection: 'row', height: 38, justifyContent: 'space-between', width: '100%', marginBottom: 15, paddingLeft: 20, paddingRight: 20 }}>
              <FormInput type="text" style={{ width: win.width / 2 - 30 }} hasIcon={false} floatSize={true} placeholder="First Name" value={this.state.first_name} onChangeText={(text) => this.setState({ first_name: text, error_message: null })} />
              <FormInput type="text" style={{ width: win.width / 2 - 30 }} hasIcon={false} floatSize={true} placeholder="Last Name" value={this.state.last_name} onChangeText={(text) => this.setState({ last_name: text, error_message: null })} />
            </View>

            <FormInput type="email" style={{ marginBottom: 15 }} hasIcon={false} placeholder="Email" value={this.state.email} onChangeText={(text) => this.setState({ email: text, error_message: null })} />
            <PhoneInput style={styles.phoneInput} textStyle={styles.phoneTextStyle} ref={(ref) => {this.phone = ref;}}/>
            <FormInput type="password" style={{ marginBottom: 15 }} hasIcon={false} placeholder="Password" value={this.state.password} onChangeText={(text) => this.setState({ password: text, error_message: null })} />
            <FormInput type="password" hasIcon={false} placeholder="Confirm Password" value={this.state.confirm_password} onChangeText={(text) => this.setState({ confirm_password: text, error_message: null })} />


            <View style={styles.bottomView}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.terms}>
                  <TouchableOpacity onPress={() => this.setState({agree: !this.state.agree})}>
                  {
                    this.state.agree
                      ? <Image style={styles.checkmark} source={require('./../assets/images/checkmark.png')} />
                      : <Image style={styles.checkmark} source={require('./../assets/images/checkmark_empty.png')} />
                  }
                  </TouchableOpacity>
                  

                  <View style={styles.termsText}>
                    <LabelText style={styles.labelText}>I agree to the</LabelText>
                    <TouchableOpacity onPress={() => this.onTerms()}>
                      <ButtonText style={styles.buttonText}>Terms & Conditions</ButtonText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <RoundButton style={styles.signButton} title="Sign Up" isLoading={this.state.is_loading} onPress={() => this.onSignUp()}></RoundButton>
              {
                this.state.error_message
                  ? <Text style={styles.errorMessage}>{this.state.error_message}</Text>
                  : null
              }
            </View>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'center',
    // backgroundColor: '#fff',
    // height: win.height - 200,
    // alignItems: 'center',
    // backgroundColor: 'blue',
    // height: win.height,
    // paddingTop: 0,
    // marginTop: 0
    alignItems: 'center',
    paddingTop: 30,
  },

  phoneInput: {
    fontFamily: 'opensans-regular',
    color: '#8b8b8b',
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    
  },

  phoneTextStyle: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    height: 25,
    paddingBottom: 5
  },

  terms: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

  termsText: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  

  checkmark: {
    width: 22,
    height: 22,
    marginRight: 7,
  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    width: win.width,
    height: win.height,
  },

  logoImage: {
    height: 150,
    marginTop: 30,
    marginBottom: 30,
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
    position: 'absolute',
    backgroundColor: 'red',
    bottom: 100
  },

  signButton: {
    marginTop: 30,
  },

  bottomView: {
    // position: 'absolute',
    // bottom: 20,
    marginTop: 30,
    paddingBottom: 30,
    alignItems: 'center'
  },

  labelText: {
    fontSize: 12,
    marginLeft: 10
  },
  buttonText: {
    fontSize: 12,
  },

  errorMessage: {
    color: 'red',
    fontFamily: 'opensans-regular',
    fontSize: 12,
    marginTop: 5,
  },

  

});
