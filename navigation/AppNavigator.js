import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';

import Login from '../screens/LoginScreen';
import SignUp from '../screens/SignUpScreen';
import Forgot from '../screens/ForgotScreen';
import ResetPassword from '../screens/ResetPasswordScreen';
import ChangePassword from '../screens/ChangePasswordScreen';
import Terms from '../screens/TermsScreen';
import Home from '../screens/HomeScreen';
import DetailNDA from '../screens/DetailNDAScreen';
import Post1 from '../screens/Post/Post1Screen';
import Post2 from '../screens/Post/Post2Screen';
import EditProfile from '../screens/EditProfileScreen';
import Preference from '../screens/Home/Preference';
import Profile from '../screens/Home/Profile';
import SettingsScreen from '../screens/SettingsScreen';
import SelectFoods from '../screens/SelectScreen';
import SeeAll from '../screens/SeeAllScreen';
import SendProfile from '../screens/SendProfileScreen';



const AppNavigator = createStackNavigator({
  Login: { screen: Login },
  SignUp: { screen: SignUp },
  Forgot: { screen: Forgot },
  ResetPassword: { screen: ResetPassword},
  ChangePassword: { screen: ChangePassword},
  Terms: { screen: Terms },
  Home: {screen: Home}, 
  Home_noTransition: { screen: Home },
  DetailNDA: {screen: DetailNDA},
  Post1: {screen: Post1},
  Post2: {screen: Post2},
  EditProfile: {screen: EditProfile},
  Preference: {screen: Preference},
  Profile: {screen: Profile},
  Settings: {screen: SettingsScreen},
  SelectFoods: {screen: SelectFoods},
  SeeAll: {screen: SeeAll},
  SendProfile: {screen: SendProfile}
}, {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
      //headerTintColor: '#a0a0a0',
      headerStyle: {
      	// elevation: 0,
      	// shadowOpacity: 0,
      	// borderBottomWidth: 0,
      },
      headerTitleStyle: {
        fontFamily: 'opensans-regular',
        fontSize: 16,
        color: 'black',
        textAlign: 'center',
      },
    },

    transitionConfig: (sceneProps) => ({
      transitionSpec: {
        duration: sceneProps.scene.route.routeName.endsWith('_noTransition') ? 0 : 260,
      },
    }),
  });

export default AppNavigator;

