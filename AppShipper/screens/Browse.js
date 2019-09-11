import React from 'react';
import { Platform, View } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { TabBarIcon, TabBar } from '../components';
import OrderScreen from './Order';
import HistoryScreen from './History';
import SettingsScreen from './Settings';
import StatisticsScreen from './Statistics';

const OrderStack = createStackNavigator({
  Order: OrderScreen,
});

OrderStack.navigationOptions = {
  tabBarLabel: 'Đơn hàng',
  tabBarIcon: ({ focused }) => (
    <View>
      <TabBarIcon
        focused={focused}
        name={Platform.OS === 'ios' ? 'ios-list-box' : 'md-list-box'}
      />
      <TabBar />
    </View>
  ),
};

const HistoryStack = createStackNavigator({
  History: HistoryScreen,
});

HistoryStack.navigationOptions = {
  tabBarLabel: 'Lịch sử',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-timer' : 'md-timer'}
    />
  ),
};
// const NotificationStack = createStackNavigator({
//   Notification: NotificationScreen,
// });

// NotificationStack.navigationOptions = {
//   tabBarLabel: 'Thông báo',
//   tabBarIcon: ({ focused }) => (
//     <View>
//       <TabBarIcon
//         focused={focused}
//         name={Platform.OS === 'ios' ? 'ios-notifications' : 'md-notifications'}
//       />
//       {/* <TabBar/> */}
//     </View>
//   ),
// };

const StatisticsStack = createStackNavigator({
  Statistics: StatisticsScreen,
});

StatisticsStack.navigationOptions = {
  tabBarLabel: 'Thống kê',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-stats' : 'md-stats'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settiings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Tài khoản',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
    />
  ),
};

export default createBottomTabNavigator(
  {
    OrderStack,
    HistoryStack,
    // NotificationStack,
    StatisticsStack,
    SettingsStack,
  },
  {
    tabBarOptions: {
      style: {
        backgroundColor: '#006600',
      },
      // labelStyle:{
      //   color: '#2BDA8E',
      // },
      activeTintColor: '#FFFFFF',
      // inactiveBackgroundColor:'#E6E6E6',
    },
    navigationOptions: {
      header: null
    },
    defaultNavigationOptions: {
      OrderStack
    },

  }
)
