import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  View,
} from 'react-native';

import { Constants } from 'expo';
import { NavigationActions, StackActions } from 'react-navigation';
import ListPage from './Home/ListPage';
import HistoryPage from './Home/HistoryPage';
import SettingsPage from './Home/SettingsPage';
import { reaction } from "mobx";
import { inject, observer } from "mobx-react/native";

const win = Dimensions.get('window');

@inject("userStore")
@observer

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)

    this.state = {
      page: 'list',
      navigation_name: '',
    }
  }

  componentDidMount() {
    const navigation_name = this.props.navigation.getParam("navigation_name");
    this.setState({ 
      navigation_name: navigation_name,
     });
  }

  changePage(page) {
    this.setState({page: page});
  }

  onClickAddButton() {
    if (this.state.page == 'list') {
      this.props.navigation.navigate('Post1', {
        home_navigation_name: this.state.navigation_name,
      });
    }
    else {
      this.setState({page: 'list'});
    }
  }

  editProfile() {
    this.props.navigation.navigate('EditProfile');
  }

  changePassword() {
    this.props.navigation.navigate('ChangePassword'); 
  }

  logout() {
    this.props.userStore.logout();
    
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Login' })],
    });
    this.props.navigation.dispatch(resetAction);
  }  

  onClickNDA(item) {
    this.props.navigation.navigate('DetailNDA', {
      item: item,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerView}>
          <Image 
            style={styles.headerIcon}
            source={require('./../assets/images/green_logo.png')}
          />
        </View>

        {
          this.state.page == 'list'
          ? <ListPage onClickNDA={(item) => this.onClickNDA(item)} />
          : null
        }

        {
          this.state.page == 'history'
          ? <HistoryPage onClickNDA={(item) => this.onClickNDA(item)} />
          : null
        }

        {
          this.state.page == 'settings'
          ? <SettingsPage onLogout={() => this.logout()} onEditProfile={() => this.editProfile()} onChangePassword={() => this.changePassword()} />
          : null
        }

        <View style={styles.bottomView}>
          <Image 
            style={styles.bottomBackgroundImage}
            source={require('./../assets/images/bottom_bar.png')}
          />

          <TouchableOpacity style={styles.addButton} onPress={() => this.onClickAddButton()}> 
          {
            this.state.page == 'list' 
            ?  <Image 
                style={{width: 70, height: 70}}
                source={require('./../assets/images/add_button.png')}
              />
            : <Image 
                style={{width: 70, height: 70}}
                source={require('./../assets/images/list_button.png')}
              />
          }
            
          </TouchableOpacity>

          <TouchableOpacity style={styles.historyButton} onPress={() => this.changePage('history')}> 
            {
              this.state.page == 'history'
              ?  <Image 
                  style={{width: 50, height: 35}}
                  source={require('./../assets/images/btn_history_active.png')}
                />

              :  <Image 
                  style={{width: 50, height: 35}}
                  source={require('./../assets/images/btn_history.png')}
                />
            }
            
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsButton} onPress={() => this.changePage('settings')}> 
            {
              this.state.page == 'settings' 
              ?  <Image 
                  style={{width: 50, height: 35}}
                  source={require('./../assets/images/btn_settings_active.png')}
                />
              :  <Image 
                  style={{width: 50, height: 35}}
                  source={require('./../assets/images/btn_settings.png')}
                />
            }
            
          </TouchableOpacity>

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  headerView: {
    backgroundColor: '#fff',
    width: '100%',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    alignItems: 'center',
    shadowColor: '#888',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,    
    zIndex: 2,
  },

  headerIcon: {
    width: 54,
    height: 50,
  },

  bottomView: { 
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#888',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
    zIndex: 2,
  },

  addButton: {
    position: 'absolute',
    top: -25,
  },

  historyButton: {
    position: 'absolute',
    left: win.width / 4 - 45,
    top: 10,
  },

  settingsButton: {
    position: 'absolute',
    left: win.width * 3 / 4,
    top: 10,
  },

  bottomBackgroundImage: {
    width: '100%',
    height: 50,
  },
});
