import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  Platform,
  Image,
  Alert
} from 'react-native';
import {
  Block,
  Direction,
  Button
} from '../components'
import MapView from 'react-native-maps';
import { theme, } from '../constants';
import apiService from '../service/apiService'
import {
  Constants,
  Location,
  Permissions
} from 'expo';
import startIcon from '../assets/maps/start.png';
import finishIcon from '../assets/maps/finish.png';
import markerIcon from '../assets/maps/marker.png'
import Polyline from '@mapbox/polyline';
import { connect } from 'react-redux';
import call from '../service/callback.services'
import { HeaderBackButton } from 'react-navigation';
import { BackHandler } from 'react-native'
const orderStatus = {
  OnProcessing: 0,
  OnDelivering: 1,
  Received: 2,
  Failed: 3
}
const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
var moment = require('moment');
var shippernow = moment().format('YYYY-MM-DD HH:mm:ss')
const date = moment().format('YYYY-MM-DD')
const GoogleMapsAPIKey = 'AIzaSyB_GH9ysR_kGWF4lZkAPUUl0FBTHO_BFNw'
const { width, height } = Dimensions.get('window');
class Map extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <HeaderBackButton
          title={'Lộ trình'}
          tintColor={'white'}
          backTitleVisible={true}
          onPress={() => { navigation.goBack(), navigation.state.params.onBack() }}
        />
      ),
      headerStyle: {
        backgroundColor: '#006600',
      },
    };
  };
  constructor(props) {
    super(props)
    this.ApiService = apiService()
    const { navigation } = this.props
    // const orders = navigation.getParam('orders', '')
    this.state = {
      time: date,
      orders: [],
      orderDetails: [],
      markers: [],
      currentOrderDetail: null,
      loading: true,
      location: [],
      errorMessage: '',
      startMarker: null,
      endMarker: null,
      geo: {
        latitude: 10.762904,
        longitude: 106.682289,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backPressed);
    this.getOrder()
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  backPressed = () => {
    this.props.navigation.goBack();
    // this.props.navigation.state.params.onBack()
    return true;
  }
  async getOrder() {
    call.getToken(result => {
      if (result) {
        this.ApiService.getBillsForMap(this.state.time, result)
          .then(async (data) => {
            await this.setState({ orders: data, loading: false })
            this.getAddress()
          }).catch((e) => {
            if (e.status === 401) {
              this.props.navigation.navigate('Login');
            }
          })
      }
    })
  }


  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Quyền truy cập vị trí đã bị từ chối',
      });
    }
    Location.getProviderStatusAsync()
    let check = await Location.hasServicesEnabledAsync()
    if (check) {
      await Location.watchPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 10000,
        distanceInterval: 100,
        mayShowUserSinstallDialog: true
      }, loc => this.set(loc.coords));
    }
    else {
      alert('Không tìm thấy vị trí. Vui lòng kiểm tra lại định vị!')
    }
  };
  getcurrent = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Quyền truy cập vị trí đã bị từ chối',
      });
    }
    Location.getProviderStatusAsync()
    let check = await Location.hasServicesEnabledAsync()
    if (check) {
      let current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation })
      let location = {
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
      this.setState({ geo: location })
    }
    else {
      Alert.alert(
        'Thông báo',
        'Không tìm thấy vị trí. Vui lòng kiểm tra lại định vị!',
        [
          {
            text: 'Đóng',
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    }
  }
  set(loc) {
    call.getToken(result => {
      if (result) {
        this.ApiService.updateShipperLocation(shippernow, loc.longitude, loc.latitude, result)
          .then()
          .catch((e) => {
            if (e.status === 401) {
              this.props.navigation.navigate('Login');
            }
          })
      }
    })
  }

  async getAddress() {
    try {
      let orderDetails = []
      let markers = []
      let currentOrderDetail;
      let startMarker = null;
      let endMarker = null
      let { orders } = this.state;
      let firstCoordinates = await this.getDirections(this.props.user.RepositoryAddress, orders[0].Address)
      orderDetails.push({
        order: orders[0],
        coordinates: firstCoordinates
      })
      startMarker = firstCoordinates[0];
      markers.push(firstCoordinates[firstCoordinates.length - 1])
      for (let i = 0; i < orders.length - 1; i++) {
        let coords = await this.getDirections(orders[i].Address, orders[i + 1].Address)
        orderDetails.push({
          order: orders[i + 1],
          coordinates: coords
        })
        markers.push(coords[coords.length - 1])
      }
      endMarker = markers[markers.length - 1];
      markers.splice(markers.length - 1, 1);
      for (let i = 0; i < orders.length; i++) {
        if (orders[i].Status === orderStatus.OnDelivering ||
          orders[i].Status === orderStatus.OnProcessing) {
          currentOrderDetail = orderDetails[i];
          break;
        }
      }
      this.setState({
        startMarker,
        endMarker,
        orderDetails,
        markers,
        currentOrderDetail,
        loading: false
      })
    } catch (error) {
      return error
    }

  }
  async getDirections(startLoc, destinationLoc) {
    try {
      let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${GoogleMapsAPIKey}`)
      let respJson = await resp.json();
      let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1]
        }
      })
      return coords
    } catch (error) {
      alert('getDirections: ' + error)
      return error
    }
  }

  handleChangeOrderStatus = async (id, status, message) => {
    call.getToken(result => {
      if (result) {
        this.ApiService
          .getStatusOrder(id, status, message, result)
          .then((data) => {
            let { orderDetails } = this.state
            orderDetails.forEach((element, index) => {
              if (element.order.ID === id) {
                orderDetails[index].order.Status = status;
              }
            })
            let currentOrderDetail = null;
            if (status !== orderStatus.OnDelivering) {
              for (let i = 0; i < orderDetails.length; i++) {
                if (orderDetails[i].order.Status === orderStatus.OnProcessing) {
                  currentOrderDetail = orderDetails[i];
                  break;
                }
              }
              if (!currentOrderDetail) {

                this.ApiService.updateStatusShipper(result)
                  .then()
                  .catch((e) => {
                    if (e.status === 401) {
                      this.props.navigation.navigate('Login');
                    }
                  })

              }
            } else {
              currentOrderDetail = this.state.currentOrderDetail;
            }
            this.setState({
              orderDetails,
              currentOrderDetail
            })
          }).catch((e) => {
            if (e.status === 401) {
              this.props.navigation.navigate('Login');
            }
          })
      }
    })
  }

  getPolyLineColor = (status) => {
    switch (status) {
      case orderStatus.OnProcessing:
        return 'red';
      case orderStatus.OnDelivering:
        return 'gold';
      case orderStatus.Failed:
        return 'purple';
      case orderStatus.Received:
        return 'lightseagreen';
      default:
        return 'orange';
    }
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Image source={require('../assets/icons/loading.gif')} />
        </View>
      )
    }
    let direction = null;
    const {
      orderDetails,
      markers,
      currentOrderDetail,
      startMarker,
      endMarker
    } = this.state;
    if (currentOrderDetail) {
      let { order } = currentOrderDetail;
      direction = (
        <Direction
          order={order}
          handleChangeOrderStatus={this.handleChangeOrderStatus}
        />
      )
    } else {
      direction = (
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.white
        }}>
          <Text>Không có đơn hàng chưa giao</Text>
        </View>
      )
    }
    return (
      <Block
        column
        style={{
          backgroundColor: theme.colors.gray3, flex: 1
        }}
      >
        <View style={{ width: width, flex: 1 }}>
          <MapView style={styles.map}
            showsMyLocationButton={true}
            region={this.state.geo}
            showsUserLocation={true}
            followsUserLocation={true}
            toolbarEnabled={true}
            loadingEnabled={true}
          >
            {
              markers ?
                markers.map((item, i) => (
                  <MapView.Marker
                    key={i}
                    coordinate={item}
                  >
                    <Image source={markerIcon} style={styles.locImg}></Image>
                  </MapView.Marker>
                )) : null
            }
            {
              startMarker ?
                <MapView.Marker
                  coordinate={startMarker}
                >
                  <Image source={startIcon} style={styles.locImg}></Image>
                </MapView.Marker> : null
            }
            {
              endMarker ?
                <MapView.Marker
                  coordinate={endMarker}
                >
                  <Image source={finishIcon} style={styles.locImg}></Image>
                </MapView.Marker> : null
            }
            {/* <MapView.Marker
              coordinate={this.state.location}
            >
              <Image source={locImg} style={styles.locImg}></Image>
            </MapView.Marker> */}

            {
              orderDetails.map((item, i) => (
                <MapView.Polyline
                  key={i}
                  coordinates={item.coordinates}
                  strokeWidth={3}
                  strokeColor={this.getPolyLineColor(item.order.Status)}
                />
              ))
            }
          </MapView>
          <Button style={{ bottom: 0, right: 5, position: 'absolute', alignItems: 'center', borderRadius: 0, height: 35, width: 50, backgroundColor: 'gray' }} onPress={this.getcurrent}>
            <Image source={require('../assets/images/mylocation.png')} style={{ height: 35, width: 35 }} />
          </Button>
        </View>
        {direction}
      </Block>
    );
  }
}
export default connect(mapStateToProps)(Map)

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
  },
  locImg: {
    width: 20,
    height: 20
  }
});