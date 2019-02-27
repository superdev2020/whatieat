import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity, Button } from 'react-native';
import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";
import { BASE_URL } from '../constants/API';

const win = Dimensions.get('window');



@inject("userStore", "foodStore")
@observer
export default class SeeAllScreen extends React.Component {

  
  static navigationOptions = ({ navigation }) => {
    this.cat = navigation.getParam("cat");
    return {
      headerTitleStyle: {textAlign: 'center',alignSelf:'center', justifyContent: 'center', alignItems:'center', fontSize: 16},
      // headerStyle: {
      //   backgroundColor:'red',
      //   textAlign: 'center',alignItems:'center'
      // },
      right: (
        <Text onPress={() => {}}>XXX</Text>
      ),
      title: cat.cat_name.toUpperCase(),

    }
  };
  constructor(props) {
    super(props);
    this.cat = this.props.navigation.getParam("cat");
    this.state = {
      data: [],
      editing: false,
    }
  }

  _renderFood = (item, i) => {
    const uri = `${BASE_URL}images/${item.icon}`;
    return (
      <View key={item.food_id} style={[styles.foodOutWrapper]}>
        <View style={styles.foodInnerWrapper}>
          <Image style={styles.image} source={{ uri: uri }} resizeMode="cover" />
          <View style={[styles.food, { width: '100%' }]}>
            <Text style={[styles.footName]}>{item.name}</Text>
          </View>
        </View>
      </View>
    );
  }


  _ItemSeparator = () => <View style={styles.separator} />;

  render() {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
      >
        <Text style={{ fontWeight: 'normal', alignItems: 'center', marginTop: 20, textAlign: "center" }}>{this.cat.selected} Selected out of {this.cat.total} </Text>
        <View style={styles.imageGroup}>
          {
            this.cat.foods.map((source, i) => (
              this._renderFood(source, i)
            ))
          }
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#f6f6f6',
    paddingBottom: 0
  },

  foodOutWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 5,
    paddingRight: 5,
    position: 'relative',
    marginBottom: 10,
    width: '33.3333%'
  },

  foodInnerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#888',
    shadowOffset: { width: 50, height: 50 },
    shadowOpacity: 1,
    shadowRadius: 50,
    elevation: 5,
    borderWidth: 0.1,
    borderColor: '#ebebeb',
    width: '100%'
  },

  catTitle: {
    fontSize: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    paddingRight: 15
  },

  image: {
    width: '100%',
    height: ((win.width - 40) / 3 - 10),
  },

  footName: {
    width: '100%', textAlign: 'center',
    paddingTop: 3, paddingBottom: 3,
    backgroundColor: 'white',
    fontSize: 12
  },

  item: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18
  },

  imageGroup: {
    marginTop: 20,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 10,
    paddingRight: 10

  },
  row: {
    marginTop: 10,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: '#e91e63',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    color: 'white',
    fontWeight: 'bold',
  },
  details: {
    margin: 8,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 14,
    color: 'black',
  },
  number: {
    fontSize: 12,
    color: '#999',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0, 0, 0, .08)',
  },
});