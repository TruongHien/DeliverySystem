import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Image, RefreshControl, BackHandler } from 'react-native';
import { theme } from '../constants';
import { Card, Block, Text } from '../components'
import apiService from '../service/apiService'
import until from '../service/until.curency'
import time from '../service/time.services'
import { HeaderBackButton } from 'react-navigation';
import check from '../service/checkStatus.services'
import { connect } from 'react-redux'
import call from '../service/callback.services'

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
const { width } = Dimensions.get('window');
class HistoryDetail extends React.Component {
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
      HistoryDetail: null,
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
        this.ApiService.getDetailOrder(this.state.orderID, result).then((data) => {
          this.setState({
            HistoryDetail: data,
            Token: result
          })
        }).catch((e) => {
          if (e.status === 401) {
            this.props.navigation.navigate('Login');
          }
        })
      } else {
        this.props.navigation.navigate('Login');
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
    const { HistoryDetail } = this.state;
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
              <Text bold h3 secondary>{HistoryDetail ? check.checkDeliveryMethod(HistoryDetail.DeliveryMethod) : null}</Text>
            </Block>
          </Card>
          <Card shadow middle style={{ borderBottomColor: '#D8D8D8', borderBottomWidth: 1, }}>
            <Block row space="between" style={{ padding: 5, }}>
              <Text bold header>Khách hàng</Text>
              <Text>{HistoryDetail ? HistoryDetail.Customer : null}</Text>
            </Block>
            <Block row space="between" style={{ padding: 5, }}>
              <Text bold header>Địa chỉ</Text>
              <Text>{HistoryDetail ? HistoryDetail.ShippAddress : null}</Text>
            </Block>
          </Card>
          <Card shadow middle style={{ borderBottomColor: '#D8D8D8', borderBottomWidth: 1, }}>
            <Block row space="between" style={{ padding: 5, }}>
              <Text bold header>Trạng Thái</Text>
              <Text>{HistoryDetail ? check.checkStatus(HistoryDetail.Status) : null}</Text>
            </Block>
            <Block row space="between" style={{ padding: 5, }}>
              <Text bold header>Tổng thu</Text>
              <Text>{HistoryDetail ? HistoryDetail.TotalPrice : null} VND</Text>
            </Block>
          </Card>
          <Card shadow middle style={{ borderBottomColor: '#D8D8D8', borderBottomWidth: 1, }}>
            <Block row space="between" style={{ padding: 5, }}>
              <Text bold header>Thời gian dự kiến</Text>
              <Text>{HistoryDetail ? time.formatUTC(HistoryDetail.ExpectedReceivedAt) : null}</Text>
            </Block>
            <Block row space="between" style={{ padding: 5, }}>
              <Text bold header>Thời gian thực tế</Text>
              <Text>{HistoryDetail ? time.formatUTC(HistoryDetail.ExpectedReceivedAt) : null}</Text>
            </Block>
          </Card>
          <Card shadow middle style={{ borderBottomColor: '#D8D8D8', borderBottomWidth: 1, }}>
            <Block row space="between" style={{ padding: 5, }}>
              <Text bold header>Ghi chú</Text>
              <Text>{HistoryDetail ? HistoryDetail.Note : null}</Text>
            </Block>
          </Card>
        </ScrollView>
      </Block>
    )
  }
}
export default connect(mapStateToProps)(HistoryDetail)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
