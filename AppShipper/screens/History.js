import React, { Component } from 'react'
import { Dimensions, Image, StyleSheet, ScrollView, TouchableOpacity, View, RefreshControl } from 'react-native'
import { Card, Button, Block, Text } from '../components';
import { theme } from '../constants';
var moment = require('moment');
import apiService from '../service/apiService'
import { connect } from 'react-redux'
import until from '../service/until.curency'
import time from '../service/time.services'
import call from '../service/callback.services'
import check from '../service/checkStatus.services'
const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
const date = moment().format('YYYY-MM-DD')
const { width } = Dimensions.get('window');

class HistoryScreen extends Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#006600',
    },
    title: 'LỊCH SỬ GIAO HÀNG',
    headerTintColor: '#fff',
  };

  constructor(props) {
    super(props)
    this.ApiService = apiService()
    this.state = {
      time: date,
      states: 2,
      listorder: [],
      Token: null,
      refreshing: false
    }
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.getHistory().then(() => {
      this.setState({ refreshing: false });
    });
  }

  componentDidMount() {
    this.getHistory()
  }

  getHistory = async () => {
    call.getToken(result => {
      if (result) {
        this.ApiService.getHistoryOrder(this.state.states, this.state.time, result).then((data) => {
          this.setState({
            listorder: data,
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

  componentDidUpdate(prevProps, prevState) {
    if (this.state.states !== prevState.states) {
      this.ApiService.getHistoryOrder(this.state.states, this.state.time, this.state.Token).then((data) => {
        this.setState({
          listorder: data
        })
      }).catch((e) => {
        if (e.status === 401) {
          this.props.navigation.navigate('Login');
        }
      })
    }
  }

  handleSuccessChange = () => {
    this.setState({
      states: 2
    })
  }

  handleFailChange = () => {
    this.setState({
      states: 3
    })
  }

  render() {
    const { navigation } = this.props;
    const { listorder } = this.state;
    //const tabs = ['Products', 'Inspirations', 'Shop'];

    return (
      <Block style={{ backgroundColor: theme.colors.gray3 }}>
        {
          this.state.states === 2 ?
            <View style={{
              flexDirection: 'row',
              justifyContent: "space-between",
              marginHorizontal: 5,
            }}>
              <Button color='#A9F5BC' style={styles.chosed}>
                <Text bold center>HOÀN THÀNH</Text>
              </Button>
              <Button color='#E0F8E6' style={styles.unchosed} onPress={this.handleFailChange}>
                <Text bold center>THẤT BẠI</Text>
              </Button>
            </View> :
            <View style={{
              flexDirection: 'row',
              marginHorizontal: 5,
              justifyContent: "space-between",
            }}>
              <Button color='#E0F8E6' style={styles.unchosed} onPress={this.handleSuccessChange}>
                <Text bold center>HOÀN THÀNH</Text>
              </Button>
              <Button color='#A9F5BC' style={styles.chosed}>
                <Text bold center>THẤT BẠI</Text>
              </Button>
            </View>

        }
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingVertical: theme.sizes.base1 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <Block space="between" style={styles.listorder}>
            {listorder.map(listorder => (
              <TouchableOpacity
                key={listorder.ID}
                onPress={() => this.props.navigation.navigate('HistoryDetail', { id: listorder.ID })}
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
                    <Text>Thời gian giao hàng</Text>
                    <Text>{time.formatHourUTC(listorder.EndDeliveryAt)}</Text>
                  </Block>
                </Card>
              </TouchableOpacity>
            ))}
          </Block>
        </ScrollView>
      </Block>
    )
  }
}


export default connect(mapStateToProps)(HistoryScreen);

const styles = StyleSheet.create({
  listorder: {
    flexWrap: 'wrap',
    paddingHorizontal: theme.sizes.base1 * 2,
    marginHorizontal: theme.sizes.base1 * 3,
  },
  type: {
    fontWeight: 'bold',
    fontSize: theme.sizes.h3,
    color: '#1CAD4F',
  },
  chosed: {
    width: width / 2 - 5,
    height: 40,
    borderRadius: 0,
    borderBottomWidth: 5,
    borderBottomColor: 'green',
  },
  unchosed: {
    width: width / 2 - 5,
    height: 40,
    borderRadius: 0,
  },
})
