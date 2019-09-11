import React from 'react';
import { ScrollView, StyleSheet, Picker, Dimensions, View, RefreshControl } from 'react-native';
import { Text, Block } from '../components'
const { width } = Dimensions.get('window')
import { theme } from '../constants';
var moment = require('moment');
import apiService from '../service/apiService'
import until from '../service/until.curency'
import { connect } from 'react-redux'
import call from '../service/callback.services'

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
const date = moment().format('YYYY-MM-DD')
class StatisticScreen extends React.Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#006600',
    },
    title: 'THỐNG KÊ',
    headerTintColor: '#fff',
  };
  constructor(props) {
    super(props);
    this.ApiService = apiService()
    this.state = {
      from: date,
      to: date,
      time: 1,
      statistics: null,
      Token: null,
      refreshing: false
    }
  }

  getPhanTram(a, b) {
    return a * 100 / b
  }


  componentDidMount() {
    this.getStatistic()
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.getStatistic().then(() => {
      this.setState({ refreshing: false });
    });
  }
  getStatistic = async () => {
    call.getToken(result => {
      if (result) {
        this.ApiService.getStatisticOrder(this.state.from, this.state.to, result).then((data) => {
          this.setState({
            statistics: data,
            Token: result
          })
        })
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.time !== prevState.time) {
      this.ApiService.getStatisticOrder(this.state.from, this.state.to, this.state.Token).then((data) => {
        this.setState({
          statistics: data
        })
      })
    }
  }

  pickerActivity = () => {
    if (this.state.time === "7") {
      this.setState({
        from: moment().subtract(7, 'days')
      })
    }
    else {
      if (this.state.time === "30") {
        this.setState({
          from: moment().subtract(30, 'days')
        })
      }
      else {
        this.setState({
          from: moment()
        })
      }
    }
  }
  render() {
    const { statistics } = this.state
    let a = 0, b = 0
    if (statistics !== null) {
      a = this.getPhanTram(statistics.DeliveredBills, statistics.TotalBills)
      b = this.getPhanTram(statistics.FailedBills, statistics.TotalBills)
    } else {
      a = 0
      b = 0
    }
    return (
      <Block style={styles.container}>
        <View style={{ backgroundColor: 'white', marginTop: 5, }}>
          <Picker
            onPress={this.pickerActivity}
            selectedValue={this.state.time}
            style={{ width: 150, marginLeft: width - 150, height: 50, }}
            mode='dropdown'
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ time: itemValue })
            }>
            <Picker.Item label="Hôm nay" value="1" />
            <Picker.Item label="7 ngày qua" value="7" />
            <Picker.Item label="30 ngày qua" value="30" />
          </Picker>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <Block row center style={{ backgroundColor: 'white', marginTop: 5, height: 150 }}>
            <Block column left>
              <Text center bold style={[styles.status, { borderBottomColor: 'green', }]}>Giao thành công</Text>
              <Text center style={{ marginTop: 15 }}>{statistics ? a : 0}%</Text>
            </Block>
            <Block column left>
              <Text center bold style={[styles.status, { borderBottomColor: 'red', }]}>Giao thất bại</Text>
              <Text center style={{ marginTop: 15 }}>{statistics ? b : 0}%</Text>
            </Block>
          </Block>
          <Block style={{ backgroundColor: 'white', marginTop: 5, }}>
            <Block row space='between' style={styles.body}>
              <Text center>Khoảng cách di chuyển</Text>
              <Text center >{statistics ? statistics.TotalDistances : 0}</Text>
            </Block>
            <Block row space='between' style={styles.body}>
              <Text center>Thời gian di chuyển</Text>
              <Text>{statistics ? statistics.RealDurations : 0}</Text>
            </Block>
            <Block row space='between' style={styles.body}>
              <Text center>Số đơn hàng đã thực hiện</Text>
              <Text center>{statistics ? statistics.TotalBills : 0}</Text>
            </Block>
            <Block row space='between' style={styles.body}>
              <Text center>Doanh thu</Text>
              <Text center>{statistics ? statistics.Salary : 0} VND</Text>
            </Block>
          </Block>
        </ScrollView>
      </Block>
    );
  }
}
export default connect(mapStateToProps)(StatisticScreen)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.gray3,
  },
  body: {
    borderBottomColor: '#D8D8D8', borderBottomWidth: 1, height: 50, padding: 10
  },
  status: {
    borderBottomWidth: 5, width: width / 2 - 20, padding: 20, marginHorizontal: 10,
  }
});
