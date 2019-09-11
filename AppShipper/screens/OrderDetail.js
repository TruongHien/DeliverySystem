import React from 'react';
import { ScrollView, StyleSheet, Dimensions, AsyncStorage, BackHandler, RefreshControl } from 'react-native';
import apiService from '../service/apiService'
import until from '../service/until.curency'
import time from '../service/time.services'
import { Card, Block, Text, } from '../components';
import { theme } from '../constants';
import { HeaderBackButton } from 'react-navigation';
import call from '../service/callback.services'
import check from '../service/checkStatus.services'

const { width } = Dimensions.get('window');
export default class OrderDetail extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderBackButton
          title={'Chi tiết'}
          tintColor={'white'}
          backTitleVisible={true}
          onPress={() => { navigation.goBack() }}
        />
      ),
      headerStyle: {
        backgroundColor: '#006600',
      },
    };
  };

  constructor(props) {
    super(props);
    this.ApiService = apiService()
    this.state = {
      detail: null,
      orderID: null,
      Token: null,
      refreshing: false
    }
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.getDetail().then(() => {
      this.setState({ refreshing: false });
    });
  }

  componentWillMount() {
    const { navigation } = this.props
    const orderID = navigation.getParam('id', 'no-id')
    this.setState({
      orderID: orderID
    })
    BackHandler.addEventListener('hardwareBackPress', this.backPressed);
  }

  componentDidMount() {
    this.getDetail()
  }
  getDetail = async () => {
    call.getToken(result => {
      if (result) {
        this.ApiService.getDetailOrder(this.state.orderID, result)
          .then((data) => {
            this.setState({
              detail: data,
              Token: result
            })
          }).catch((e) => {
            alert('Lỗi!')
            if (e.status === 401) {
              this.props.navigation.navigate('Login');
            }
          })
      }
    })
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backPressed);
  }

  backPressed = () => {
    this.props.navigation.goBack();
    return true;
  }

  render() {
    const { detail } = this.state;
    return (
      <Block style={{ backgroundColor: theme.colors.gray3 }}>
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
          <Card shadow middle style={{ borderBottomColor: '#D8D8D8', borderBottomWidth: 1, }}>
            <Block>
              <Text bold h3 secondary>{detail ? check.checkDeliveryMethod(detail.DeliveryMethod) : null}</Text>
            </Block>
          </Card>
          <Card shadow middle style={{ borderBottomColor: '#D8D8D8', borderBottomWidth: 1, }}>
            <Block row space="between" style={{ padding: 5, }}>
              <Text bold header>Khách hàng</Text>
              <Text>{detail ? detail.Customer : null}</Text>
            </Block>
            <Block row space="between" style={{ padding: 5, }}>
              <Text bold header>Số điện thoại</Text>
              <Text>{detail ? detail.CustomerPhone : null}</Text>
            </Block>
          </Card>
          <Card shadow middle style={{ borderBottomColor: '#D8D8D8', borderBottomWidth: 1, }}>
            <Block row space="between" style={{ padding: 5, }}>
              <Text bold header>Địa chỉ</Text>
              <Text>{detail ? detail.ShippAddress : null}</Text>
            </Block>
            <Block row space="between" style={{ padding: 5, }}>
              <Text bold header>Tổng thu</Text>
              <Text>{detail ? detail.TotalPrice : 0} VND</Text>
            </Block>
          </Card>
          <Card shadow middle style={{ borderBottomColor: '#D8D8D8', borderBottomWidth: 1, }}>
            <Block row space="between" style={{ padding: 5, }}>
              <Text bold header>Thời gian dự kiến</Text>
              <Text>{detail ? time.formatUTC(detail.ExpectedReceivedAt) : null}</Text>
            </Block>
            <Block row space="between" style={{ padding: 5, }}>
              <Text bold header>Ghi chú</Text>
              <Text>{detail ? detail.Note : null}</Text>
            </Block>
          </Card>
        </ScrollView>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  status: {
    width: width / 2,
    height: 40,
    borderRadius: 0,
  }
});
