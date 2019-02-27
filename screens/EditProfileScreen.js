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
  ImageStore
} from 'react-native';

import { ImagePicker } from 'expo';
import RoundButton from './../components/RoundButton';
import FormInput from './../components/FormInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";
import Messages from '../constants/Messages';
import { BASE_URL } from '../constants/API';

const win = Dimensions.get('window');

@inject("userStore")
@observer

export default class EditProfileScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { state } = navigation;
    return {
      title: 'Edit Profile'.toUpperCase(),
    }
  };

  constructor(props) {
    super(props)

    this.state = {
      first_name: this.props.userStore.currentUser.first_name,
      last_name: this.props.userStore.currentUser.last_name,
      email: this.props.userStore.currentUser.email,
      avatar: `${BASE_URL}${this.props.userStore.currentUser.avatar}?time=` + new Date().valueOf(),
      is_loading: false,
      error_message: null,
    }
  }

  componentDidMount() {
    this.disposes = [
      reaction(
        () => this.props.userStore.updateUserState,
        (updateUserState) => {
          if (updateUserState.isSuccessful()) {
            this.setState({ is_loading: false }, () => {
              Alert.alert(
                '',
                'Profile has been updated successfully!',
                [
                  { text: 'OK', onPress: () => console.log('OK Pressed') },
                ],
                { cancelable: false }
              )

            });
          }
          else if (updateUserState.isNetworkProblems()) {
            this.setState({ is_loading: false, error_message: Messages.network_error_message });
          }
          else {
            this.setState({ is_loading: false, show_error: true, error_message: updateUserState.error });
          }
        }),
    ];
  }

  componentWillUnmount() {
    this.disposes.forEach(dispose => dispose());
  }

  onUpdate() {
    if (this.state.is_loading) return;

    if (this.state.first_name == null || this.state.first_name == "") {
      this.setState({ error_message: Messages.invalid_first_name_message });
      return;
    }

    if (this.state.last_name == null || this.state.last_name == "") {
      this.setState({ error_message: Messages.invalid_last_name_message });
      return;
    }

    if (this.state.email == null || this.state.email == "") {
      this.setState({ error_message: Messages.invalid_email_message });
      return;
    }

    this.setState({ is_loading: true });
    this.props.userStore.updateUser(this.props.userStore.currentUser.user_id, this.state.first_name, this.state.last_name, this.state.email, this.state.image64Encoded);
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    console.log(result);

    if (!result.cancelled) {
      ImageStore.getBase64ForTag(result.uri, (data) => {
        console.log('data', data.substring(0, 100));
        this.setState({ image64Encoded: data });
      }, e => console.warn("getBase64ForTag: ", e))
      this.setState({ avatar: result.uri });

    }
  };

  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAwareScrollView style={{ backgroundColor: 'white' }}>
          <View style={styles.container}>
            <TouchableOpacity style={styles.avatarWrapper} onPress={this._pickImage}>
              <Image
                style={styles.avatar}
                source={{uri: this.state.avatar}}
              />
            </TouchableOpacity>


            <View style={styles.form}>

              <FormInput type="text" style={{ marginBottom: 15 }} hasIcon={false} placeholder="First Name" value={this.state.first_name} onChangeText={(text) => this.setState({ first_name: text, error_message: null })} />
              <FormInput type="text" style={{ marginBottom: 15 }} hasIcon={false} placeholder="Last Name" value={this.state.last_name} onChangeText={(text) => this.setState({ last_name: text, error_message: null })} />
              <FormInput type="email" style={{ marginBottom: 15 }} hasIcon={false} placeholder="Email" value={this.state.email} onChangeText={(text) => this.setState({ email: text })} />

              <RoundButton style={styles.signButton} title="Update" isLoading={this.state.is_loading} onPress={() => this.onUpdate()}></RoundButton>
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
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    height: win.height,
    alignItems: 'center'
  },

  avatarWrapper: {
    width: '40%',
    shadowColor: '#888',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
    borderRadius: 100,
    marginTop: 30,
  },

  avatar: {
    width: '100%', height: null, aspectRatio: 1,
    borderRadius: 100,

  },
  backgroundImage: {
    position: 'absolute',
    bottom: 0,
    width: win.width,
    height: win.width,
  },

  form: {
    flex: 1,
    alignItems: "center",
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    height: 200,
    marginTop: 40,
  },

  signButton: {
    marginTop: 50,
  },

  labelText: {
    fontSize: 10,
  },

  errorMessage: {
    color: 'red',
    fontFamily: 'opensans-regular',
    fontSize: 12,
    marginTop: 5,
  },

  buttonText: {
    fontSize: 10,
  }
});
