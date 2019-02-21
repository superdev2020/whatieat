import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  View,
} from 'react-native';

import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";

@inject("userStore", "ndaStore")
@observer

export default class HistoryPage extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          data: [],
          editing: false,
      }
    }

    componentDidMount() {
      this.disposes = [
        reaction(
          () => this.props.ndaStore.restoreHistoryState,
          (restoreHistoryState) => {
            if (restoreHistoryState.isSuccessful()) {
              this.setState({data: this.props.ndaStore.historyList});
            }
          }
        ),

        reaction(
          () => this.props.ndaStore.getHistoryState,
          (getHistoryState) => {
            if (getHistoryState.isSuccessful()) {
              this.setState({data: this.props.ndaStore.historyList});
            }
          }
        ),
      ];

      this.props.ndaStore.restoreHistoryList();
      this.props.ndaStore.loadNDAHistory(this.props.userStore.currentUser.user_id);
    }

    componentWillUnmount() {
      this.disposes.forEach(dispose => dispose());
    }

    onClickItem(item, index) {
      this.props.onClickNDA(item);
    }

    render() {
      return (
        <View style={styles.container}>
          <FlatList
            style={{paddingTop: 20, marginBottom: 50}}
            contentContainerStyle={{ paddingBottom: 20}}
            data={this.state.data}
            extraData={this.state}
            renderItem={({item, index}) =>
            <TouchableOpacity style={styles.rowItem} onPress={() => this.onClickItem(item, index)}>
              <View>
                 <Text style={styles.activityNameText}>{item.activity_name}</Text>
                 <Text style={styles.ndaText} numberOfLines={2} ellipsizeMode='tail'>{item.nda}</Text>
                 {
                    item.status == 1
                    ? <Image 
                        style={ styles.badgeIcon }
                        source={require('./../../assets/images/accepted.png')}
                      />
                    : <Image 
                        style={ styles.badgeIcon }
                        source={require('./../../assets/images/declined.png')}
                      />
                 }
              </View>
            </TouchableOpacity>
            }
          />
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  rowItem: {
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
    borderRadius: 5,
    borderColor: '#e1e1e1',
    borderWidth: 1,
    shadowColor: '#888',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    padding: 10,
    backgroundColor: 'white',
  },

  activityNameText: {
    color: 'black',
    fontFamily: 'opensans-regular',
    fontSize: 16,
    textTransform: 'uppercase',
  },

  ndaText: {
    marginTop: 5,             
    color: 'black',
    fontFamily: 'opensans-regular',
    fontSize: 13,
  },

  badgeIcon: {
    position: 'absolute',
    width: 10,
    height: 10,
    right: 2,
    top: 2
  },

});
