import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  Dimensions,
} from 'react-native';

import RoundButton from './../../components/RoundButton';
import Messages from '../../constants/Messages';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ExpoPixi from 'expo-pixi';

const win = Dimensions.get('window');

export default class Post1Screen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      activity_name: '',
      nda: '',
      signature: null,
      agree: false,
      showSignatureDialog: false,
      error_message: null,
      home_navigation_name: '',
    }     
  }

  componentDidMount() {
    const home_navigation_name = this.props.navigation.getParam("home_navigation_name");
    this.setState({ 
      home_navigation_name: home_navigation_name,
     });
  }

  onBack() {
	 this.props.navigation.goBack();
  }

  onNextStep() {
  	if (this.state.activity_name === null || this.state.activity_name.length == 0) {
      	return;
  	}

  	if (this.state.nda === null || this.state.nda.length == 0) {
      	return;
  	}

  	if (this.state.signature === null || this.state.signature.length == 0) {
      	return;
  	}

  	if (this.state.agree === false) {
      	return;
  	}

	this.props.navigation.navigate('Post2', {
		activity_name: this.state.activity_name,
		nda: this.state.nda,
		signature: this.state.signature,
    home_navigation_name: this.state.home_navigation_name,
	});
  }

  onAgree() {
  	this.setState({agree: !this.state.agree});
  }

  onSignature() {
  	this.setState({showSignatureDialog: true});
  }

  onChange() {

  }

  handleSignature = signature => {
  	this.setState({ signature: signature });
  	this.setState({showSignatureDialog: false});
  }

  async onSaveSignature() {
    const options = {
      format: 'png',
      result: 'data-uri',
      width: 200,
      height: 200
    };

    const uri = await Expo.takeSnapshotAsync(this.sketch, options);
	  this.setState({showSignatureDialog: false, signature: uri});
  }

  onCloseSignature() {
	 this.setState({showSignatureDialog: false, signature: null});
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.container}>
            {
              this.state.showSignatureDialog
              ? <View style={styles.signatureContainer}>
                  <ExpoPixi.Sketch 
                      ref={ref => (this.sketch = ref)}
                      style={{backgroundColor: 'white', width: '100%', height: win.height - 50}}
                      strokeColor={0x000000}
                      strokeWidth={5}
                      strokeAlpha={1}
                  />
                  <TouchableOpacity style={{ position: 'absolute', right: 10, top: 20, width: 20, height: 20, zIndex: 10 }} onPress={() => this.setState({showSignatureDialog: false})}>
                    <Image 
                      style={{width: 20, height: 20}}
                        source={require('./../../assets/images/close_icon.png')}
                      />
                  </TouchableOpacity>

                  <View style={{height: 50, backgroundColor: 'white', paddingLeft: 20, paddingRight: 20}}>
                    <RoundButton style={styles.saveSignatureButton} title="Save" floatSize={true} onPress={() => this.onSaveSignature()}></RoundButton>
                  </View>
                </View>

              : <KeyboardAwareScrollView 
                  style={{backgroundColor: 'white'}} 
                  enableAutomaticScroll={false}
                  innerRef={ref => {this.scroll = ref}}
                  >
                  <View style={{flex: 1, height: win.height}}>
                    <View style={styles.headerView}>
                      <Image 
                        style={styles.headerIcon}
                        source={require('./../../assets/images/green_logo.png')}
                      />

                      <TouchableOpacity style={styles.backButton} onPress={() => this.onBack()}> 
                       <Image 
                          style={styles.backButtonIcon}
                          source={require('./../../assets/images/left_arrow_icon.png')}
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.contentView}>
                      <TextInput style={styles.activityNameText} placeholder="Activity Name" underlineColorAndroid='transparent' value={this.state.activity_name} onChangeText={(text) => this.setState({ activity_name: text })}></TextInput>
                      <TextInput 
                        style={styles.ndaText} 
                        multiline={true} 
                        value={this.state.nda} 
                        onChangeText={(text) => this.setState({ nda: text })}
                        underlineColorAndroid='transparent'
                        onFocus={(event: Event) => {
                          this.scroll.props.scrollToPosition(0, 90);
                        }}
                      >                     
                      </TextInput>
                    </View>

                    <View style={styles.bottomView}>
                      <View>
                        <TouchableOpacity style={styles.checkboxContainer} onPress={() => this.onAgree()}>
                          {
                                this.state.agree
                                ? <Image style={styles.checkmark} source={require('./../../assets/images/checkmark.png')} />
                                : <Image style={styles.checkmark} source={require('./../../assets/images/checkmark_empty.png')} />
                            }
                          <Text style={styles.checkmarkText}>Agree</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.onSignature()} style={{ flexDirection: 'row', marginTop: 8 }}>
                          <Image 
                              style={styles.uploadIcon}
                              source={require('./../../assets/images/upload_icon.png')}
                            />
                          <Text style={styles.checkmarkText}>Digital Signature</Text>
                        </TouchableOpacity>
                      </View>

                    <RoundButton style={styles.nextStepButton} title="Next Step" floatSize={true} onPress={() => this.onNextStep()}></RoundButton>
                  </View>
                </View>
              </KeyboardAwareScrollView>
            }
          </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    height: win.height,
  },

  headerView: {
    backgroundColor: '#fff',
    width: '100%',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 20,
    alignItems: 'center',
    shadowColor: '#888',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 3,
    zIndex: 2,
  },

  headerIcon: {
    width: 54,
    height: 50,
  },

  backButton: {
  	position: 'absolute',
  	left: 20,
  	top: 40,
  },

  backButtonIcon: {
  	width: 18,
  	height: 20,
  },

  contentView: {
  	padding: 15,
  	justifyContent: 'center',
  },

  activityNameText: {
  	shadowColor: '#888',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
    fontFamily: 'opensans-regular',
    fontSize: 14,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 8,
  },

  ndaText: {
  	marginTop: 10,
  	shadowColor: '#888',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
    fontFamily: 'opensans-regular',
    fontSize: 14,
    width: '100%',
    borderRadius: 5,
	  backgroundColor: '#fff',    
	  padding: 8,
	  textAlignVertical: "top",
	  paddingTop: 5,
	  paddingBottom: 5,
	  height: win.height - 240,
  },

  bottomView: { 
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#888',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 3,
    zIndex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },

  checkboxContainer: {
  	flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkmark: {
    width: 22,
    height: 22,
    marginRight: 7,
  },

  checkmarkText: {
  	color: '#494949',
    fontFamily: 'opensans-regular',
    fontSize: 13,
  },

  uploadIcon: {
  	width: 24,
  	height: 24,
  	marginRight: 10,
  },

  nextStepButton: {
  	width: '40%',
  },

  signatureContainer: {
  	position: 'absolute',
	  left: 0,
	  top: 0,  	
	  width: win.width,
	  height: win.height,
	  zIndex: 100,
    flex: 1,
  },

  signatureBottom: {
  	flexDirection: 'row',
  	justifyContent: 'space-between',
  	position: 'absolute',
  	bottom: 0,
  	width: '100%',
  	padding: 10,
  	backgroundColor: '#eee',
  },

  signatureBottomButton: {
  	width: '46%',
  },

  saveSignatureButton: {

  },

});
