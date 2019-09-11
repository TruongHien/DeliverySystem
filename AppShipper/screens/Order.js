import React, { Component } from 'react'
import { Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity, View, RefreshControl } from 'react-native'
import { Notifications } from 'expo';
import { Overlay } from 'react-native-elements'
import { Card, Button, Block, Text } from '../components';
import { theme } from '../constants';
import apiService from '../service/apiService'
import time from '../service/time.services'
import check from '../service/checkStatus.services'
import { authLogin, count } from '../actions/user-action.js'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import loadingIcon from '../assets/icons/loading.gif'
import call from '../service/callback.services'
var moment = require('moment');

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ authLogin, count }, dispatch);
}
const { width, height } = Dimensions.get('window');
const date = moment().format('YYYY-MM-DD')
class OrderScreen extends Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#006600',
    },
    title: 'DANH SÁCH ĐƠN HÀNG',
    headerTintColor: '#fff',
  };

  constructor(props) {
    super(props)
    this.ApiService = apiService()
    this.state = {
      time: date,
      Token: null,
      listorder: [],
      receivedNotification: null,
      lastNotificationId: null,
      isVisible: false,
      loading: true,
      refreshing: false,
    }
  }

  componentDidMount() {
    this.checkOrder()
  }

  checkOrder = async () => {
    this.checkOrderFast()
    this.checkOrderstandard()
  }
  checkOrderstandard = async () => {
    await call.getToken(result => {
      if (result) {
        this.ApiService.getOrderByShipperID(this.state.time, result)
          .then(async (data) => {
            await this.setState({
              Token: result,
              loading: false,
              listorder: data
            })
            this.props.count(this.state.listorder.length)
          }).catch((e) => {
            if (e.status === 401) {
              this.props.navigation.navigate('Login');
            }
          })
      }
    })
  }

  checkOrderFast = async () => {
    Notifications.addListener(async (receivedNotification) => {
      await this.setState({
        receivedNotification,
        lastNotificationId: receivedNotification.notificationId,
        lisorder: this.state.listorder.push(receivedNotification.data),
        isVisible: true,
      });
      this.props.count(this.state.listorder.length)
    });
  }

  onPressDismissAllNotifications = () => {
    Notifications.dismissAllNotificationsAsync();
    this.setState({
      lastNotificationId: null,
    });
  };

  onPressDismissOneNotification = () => {
    Notifications.dismissNotificationAsync(this.state.lastNotificationId);
    this.setState({
      lastNotificationId: null,
    });
  };
  setisVisible = () => {
    this.onPressDismissOneNotification()
    this.setState({
      isVisible: false
    })
  }
  onBack = async () => {
    this.ApiService.getOrderByShipperID(this.state.time, this.state.Token).then((data) => {
      this.props.count(data.length)
      this.setState({
        listorder: data,
      })
    }).catch((e) => {
      if (e.status === 401) {
        this.props.navigation.navigate('Login');
      }
    })
  }

  onNavigateToMap = () => {
    this.props.navigation.navigate('Map',
      {
        onBack: this.onBack
      })
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.checkOrder().then(() => {
      this.setState({ refreshing: false });
    });
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        >
          <Image source={loadingIcon} />
        </View>
      )
    }
    const { navigation } = this.props;
    const { listorder } = this.state;
    let len = listorder.length;
    if (len === 0) {
      return (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingVertical: theme.sizes.base, flex: 1, }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <View style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Image source={require('../assets/images/no_order.png')} style={{ width: 100, height: 100 }} />
            <Text center>Không có đơn hàng nào!</Text>
          </View>
        </ScrollView>
      )
    }
    return (
      <Block style={{ backgroundColor: theme.colors.gray3, bottom: 0, flex: 1 }}>
        <Overlay
          isVisible={this.state.isVisible}
          windowBackgroundColor="rgba(255, 255, 255, .5)"
          overlayBackgroundColor="white"
          width="auto"
          height="auto"
        >
          <View>
            <Text red h2 bold >ĐƠN HÀNG MỚI!</Text>
            <Text>Bạn vừa có 1 đơn hàng giao nhanh mới</Text>

            <TouchableOpacity
              style={{ backgroundColor: "green", height: 40 }}
              onPress={this.setisVisible}
            >
              <Text center>Đóng</Text>
            </TouchableOpacity>
          </View>
        </Overlay>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingVertical: theme.sizes.base }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <View>
            {listorder.map((listorder, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => navigation.navigate('OrderDetail', { id: listorder.ID, onBack: this.onBack })}
              >
                <Card shadow middle style={{ marginBottom: 7, }}>
                  <Block row space="between" style={{ borderBottomWidth: 1, borderBottomColor: '#D8D8D8', marginBottom: 5, }}>
                    <Text style={styles.type}>{check.checkDeliveryMethod(listorder.DeliveryMethod)}</Text>
                    <Text>{listorder.TotalPrice} VND</Text>
                  </Block>
                  <Block row left>
                    <Image source={require('../assets/icons/pin.png')} style={{ width: 20, height: 20 }} />
                    <Text>{listorder.ShipAddress}</Text>
                  </Block>
                  <Block row space="between">
                    <Text>Thời gian dự kiến</Text>
                    <Text>{time.formatHourUTC(listorder.ExpectedReceivedAt)}</Text>
                  </Block>
                  <Block row space="between">
                    <Text>Tình trạng</Text>
                    <Text style={check.checkStyle(listorder.Status)}>{check.checkStatus(listorder.Status)}</Text>
                  </Block>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <Button
          flex='1'
          flexDirection='column'
          color='#007700'
          style={{ position: 'absolute', alignSelf: 'flex-end', bottom: 0, right: 0, width: 75, height: 75, borderRadius: 75, borderColor: '#006622', borderWidth: 0.5, zIndex: 1, }}
          onPress={this.onNavigateToMap}>
          <Text bold center white>BẮT ĐẦU</Text>
        </Button>
      </Block>
    )
  }
}

export default connect(undefined, mapDispatchToProps)(OrderScreen);

const styles = StyleSheet.create({
  type: {
    fontWeight: 'bold',
    fontSize: theme.sizes.h3,
    color: '#1CAD4F',
  },
  header: {
    margin: 5,
    height: 40,
    width: width - 10,
    backgroundColor: '#A9F5BC'
  },
  button: {
    backgroundColor: 'green',
    height: 40,
    width: width,
  }
})
