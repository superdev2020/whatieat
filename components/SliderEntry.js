import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from '../styles/SliderEntry.style';
import { BASE_URL } from '../constants/API';
import { Icon } from 'expo';

export default class SliderEntry extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired,
    even: PropTypes.bool,
    parallax: PropTypes.bool,
    parallaxProps: PropTypes.object
  };

  get image() {
    const { data: { icon } } = this.props;
    const uri = `${BASE_URL}images/${icon}`;
    return (
        <Image
        source={{uri: uri}} resizeMode="cover"
          style={mainStyle.image}
        />
      );
  }

  render() {
    const { data: { name, user_food_id } } = this.props;
    const backgroundColor = user_food_id != null ? '#ef9149' : 'white';
    const textColor = user_food_id != null ? 'white' : 'black';

    const uppercaseTitle = name ? (
      <Text
        style={[mainStyle.title, {color: textColor}]}
        numberOfLines={2}
      >
        {name.toUpperCase()}
      </Text>
    ) : false;
    
    return (
      <TouchableOpacity activeOpacity={0.6}
        onPress={() => { this.props.callback(this.props.data) }}
      >
        <View style={mainStyle.sliderItemContainer}>
          {this.image}
          <View style={{position: 'relative', backgroundColor: backgroundColor, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            {
              user_food_id != null 
              ? <Icon.Ionicons name="md-checkmark" size={26} color={"white"} style={{ marginBottom: -3 }} />
              : <Icon.Feather name="plus-square" size={26} color={"black"} style={{ marginBottom: -3 }} />
            }
            {uppercaseTitle}
          </View>  
        </View>
        
      </TouchableOpacity>
    );
  }
}
const mainStyle = StyleSheet.create({
  

  sliderItemContainer: {
    shadowColor: '#888',
	  shadowOffset: {width: 0, height: 10},
	  shadowOpacity: 0.9,
	  shadowRadius: 10,
    elevation: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    marginLeft: 30, marginRight: 30, marginBottom: 20,
    marginTop: 5
  },

  title: {
    color: 'black',
    textAlign: 'center',
    fontSize: 16,
    marginLeft: 10
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // right: 0,
    // backgroundColor: 'white'
  },

  image: {
    width: '100%',
    height: null,
    aspectRatio: 1,
    // borderRadius: 50,
  }
});
