import React, { Component } from 'react';
import { Platform, View, ScrollView, Text, StatusBar, SafeAreaView, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from '../styles/SliderEntry.style';
import SliderEntry from '../components/SliderEntry';
import styles, { colors } from '../styles/index.style';
import { ENTRIES1, ENTRIES2, PREFERENCES } from '../constants/Mockup';
import { scrollInterpolators, animatedStyles } from '../utils/animations';
import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";
import { BASE_URL } from '../constants/API';

const IS_ANDROID = Platform.OS === 'android';
const SLIDER_1_FIRST_ITEM = 0;


@inject("userStore", "foodStore")
@observer

export default class SelectScreen extends Component {

  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.cat = this.props.navigation.getParam("cat");
    this.state = {
      slider1ActiveSlide: SLIDER_1_FIRST_ITEM,
      data: []
    };
  }


  componentDidMount() {
    this.disposes = [
     	reaction(
				() => this.props.foodStore.getFoodListByCategoryState,
				(getFoodListByCategoryState) => {
					if (getFoodListByCategoryState.isSuccessful()) {
						this.setState({data: this.props.foodStore.foodsByCategory});
					}
				}
			),
    ];
		this.props.foodStore.loadFoodListByCategory(this.props.userStore.currentUser.user_id, this.cat.category_id);
  }

  componentWillUnmount() {
    this.disposes.forEach(dispose => dispose());
  }

  _clickFood(food) {

    this.props.foodStore.setFood(food.user_food_id, this.props.userStore.currentUser.user_id, food.food_id, this.cat.category_id);
    
  }
  _renderItem({ item, index }) {
    return <SliderEntry data={item} even={(index + 1) % 2 === 0} callback={this._clickFood.bind(this)}/>;
  }

  _renderLightItem({ item, index }) {
    return <SliderEntry data={item} even={false} />;
  }

  _renderDarkItem({ item, index }) {
    return <SliderEntry data={item} even={true} />;
  }

  _render(cat) {
    const { slider1ActiveSlide } = this.state;
    const uri = `${BASE_URL}images/${cat.icon}`;
    return (
      <View style={mainStyle.wrapper}>
        <Image source={{uri: uri}} style={mainStyle.image} resizeMode="contain" />
        <Text style={[mainStyle.title]}>{cat.name.toUpperCase()}</Text>
        <Text style={[mainStyle.subtitle]}>What type of food do you prefer?</Text>

        <Carousel
          data={this.state.data}
          ref={c => this._slider1Ref = c}
          renderItem={this._renderItem.bind(this)}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          containerCustomStyle={[styles.slider, mainStyle.carousel]}
          contentContainerCustomStyle={styles.sliderContentContainer}
          layout={'stack'}
          loop={false}
          onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index })}
        />

        <Pagination
          dotsLength={this.state.data.length}
          activeDotIndex={slider1ActiveSlide}
          containerStyle={styles.paginationContainer}
          dotStyle={styles.paginationDot}
          inactiveDotStyle = {styles.paginationInactivityDot}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.8}
          carouselRef={this._slider1Ref}
          tappableDots={!!this._slider1Ref}
        />

      </View>
    );

  }


  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <StatusBar
            translucent={true}
            backgroundColor={'rgba(0, 0, 0, 0.3)'}
            barStyle={'light-content'}
          />
          <ScrollView
            style={mainStyle.container}
            scrollEventThrottle={200}
            directionalLockEnabled={true}
          >
            {this._render(this.cat)}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}



const mainStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },

  wrapper: {
    paddingVertical: 30,
    paddingTop: 50,
    alignItems: 'center'
  },

  image: {
    width: '44%',
    height: null,
    aspectRatio: 1,
    marginBottom: 20
  },

  title: {
    color: 'black',
    textAlign: 'center',
    marginBottom: 40
  },

  subtitle: {
    color: 'black',
    textAlign: 'center',
    marginBottom: 0
  },

  
});
