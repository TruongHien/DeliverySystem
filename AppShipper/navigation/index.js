import React from 'react';
import { Image } from 'react-native';
import { createAppContainer, createStackNavigator } from 'react-navigation';

import Login from '../screens/Login';
import Forgot from '../screens/Forgot';
import Browse from '../screens/Browse';
import OrderDetail from '../screens/OrderDetail';
import { theme } from '../constants';
import HistoryDetail from '../screens/HistoryDetail';
import Map from '../screens/Map'
import CheckLogin from '../screens/CheckLogin'
const screens = createStackNavigator({
  CheckLogin,
  Login,
  Forgot,
  Browse,
  OrderDetail,
  HistoryDetail,
  Map,
},
  {
  }, {
    defaultNavigationOptions: {
      headerStyle: {
        height: theme.sizes.base * 4,
        backgroundColor: theme.colors.white, // or 'white
        borderBottomColor: "transparent",
        elevation: 0, // for android
      },
      headerBackImage: <Image source={require('../assets/icons/back.png')} />,
      headerBackTitle: null,
      headerLeftContainerStyle: {
        alignItems: 'center',
        marginLeft: theme.sizes.base * 2,
        paddingRight: theme.sizes.base,
      },
      headerRightContainerStyle: {
        alignItems: 'center',
        paddingRight: theme.sizes.base,
      },
    }
  });

export default createAppContainer(screens);