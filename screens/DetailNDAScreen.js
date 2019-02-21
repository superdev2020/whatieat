import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  View,
} from 'react-native';

export default class DetailNDAScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {state} = navigation;
    return {
      title: 'Detail NDA',
      headerTintColor: 'white',
      headerTitleStyle: {
        color: 'white',
      },
      headerStyle: {
        backgroundColor: '#17cf9f',
      },
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
    }     
  }

  componentDidMount() {
    const item = this.props.navigation.getParam("item");
    const activity_name = item['activity_name'];
    const nda = item['nda'];
    const signature = item['signature'];
    const phone_number = item['phone_number'];

    this.setState({ 
    	activity_name: activity_name,
    	nda: nda,
    	signature: signature,
      phone_number: phone_number,
     });
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.contentView}>
          <Text style={styles.activityNameText}>{this.state.activity_name}</Text>

          <View style={styles.separatorLine} />

          <Text style={styles.phoneNumberText}>{this.state.phone_number}</Text>          
          <View style={styles.separatorLine} />

          <Text style={styles.ndaText}>{this.state.nda}</Text>

          <View style={styles.separatorLine} />
          <Image style={{ width: '100%', height: 300, resizeMode: 'contain' }} source={{uri: this.state.signature}} />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },

  contentView: {
    marginBottom: 30,
  },

  activityNameText: {
    fontFamily: 'opensans-regular',
    fontSize: 14,
    textTransform: 'uppercase',
  },

  phoneNumberText: {
    fontFamily: 'opensans-regular',
    fontSize: 14,
  },

  ndaText: {
    fontFamily: 'opensans-regular',
    fontSize: 14,
  },

  separatorLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 10,
    marginBottom: 10,
  },
});
