import React, { Component } from 'react';
import {
    View,
    Image,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Alert
} from 'react-native';
import {
    Input,
    Overlay,
} from 'react-native-elements'
import Button from './Button'
import Text from './Text'
import call from 'react-native-phone-call';
import { theme } from '../constants';
import { Icon } from 'expo';
import Block from './Block'
const orderStatus = {
    OnProcessing: 0,
    OnDelivering: 1,
    Received: 2,
    Failed: 3
}
const { width, height } = Dimensions.get('window');

export default class Direction extends Component {
    constructor(props) {
        super(props)
        let { order } = this.props
        this.state = {
            order,
            reason: '',
            visibleModel: false
        }
    }

    componentWillReceiveProps(nextProps, prevState) {
        if (nextProps && nextProps.order) {
            let { order } = nextProps
            this.setState({
                order
            })
        }
    }

    componentWillUnmount() {
        this.setState({
            visibleModel: false
        })
    }
    call = () => {
        const args = {
            number: this.state.order.Phone,
            prompt: false,
        };
        call(args).catch(console.error);
    };
  
 
    handleSuccessChange = () => {
        Alert.alert(
            'Thông báo',
            'Cập nhật đơn hàng thành công!',
            [
              {
                text: 'Đóng',
                style: 'cancel',
              },
            ],
            {cancelable: false},
          );
        this.props.handleChangeOrderStatus(this.state.order.ID, orderStatus.Received, '')
    }

    handleFailChange() {
        Alert.alert(
            'Thông báo',
            'Cập nhật đơn hàng thành công!',
            [
              {
                text: 'Đóng',
                style: 'cancel',
              },
            ],
            {cancelable: false},
          );
        this.props.handleChangeOrderStatus(this.state.order.ID, orderStatus.Failed, this.state.reason)
        this.setState({
            visibleModel: false
        })
    }

    cancelClick = () => {
        this.setState({
            visibleModel: true
        })
    }

    handleStartOrdering = () => {
        this.props.handleChangeOrderStatus(this.state.order.ID, orderStatus.OnDelivering, '')
    }

    handleChangeReason = (text) => {
        this.setState({
            reason: text
        })
    }

    render() {
        let { order } = this.state;
        let status = order.Status;
        let buttons = null;
        if (status === orderStatus.OnProcessing) {
            buttons = (
                <View style={{
                    flexDirection: 'row',
                    justifyContent: "space-between",
                    flex: 2
                }}
                >
                    <Button
                        onPress={this.handleStartOrdering}
                        style={{borderRadius: 0, width:width }}
                        color='#008B45'
                    >
                        <Text white center>BẮT ĐẦU GIAO ĐƠN HÀNG</Text>
                    </Button>
                </View>
            )
        } else if (status == orderStatus.OnDelivering) {
            buttons = (
                <View style={{
                    flexDirection: 'row',
                    justifyContent: "center",
                    flex: 2
                }}
                >
                    <Button
                        onPress={this.cancelClick}
                        style={{ width: width / 2, borderRadius: 0 }}
                        color='#990000'
                    >
                        <Text white center>THẤT BẠI</Text>
                    </Button>
                    <Button
                        onPress={this.handleSuccessChange}
                        style={{ width: width / 2, borderRadius: 0 }}
                        color='green'
                    >
                        <Text white center>THÀNH CÔNG</Text>
                    </Button>
                </View>
            )
        } else if (status === orderStatus.Received) {
            buttons = (
                <View>
                    <Text>Đã giao</Text>
                </View>
            )
        } else {
            buttons = (
                <View>
                    <Text>Đã hủy</Text>
                    <Text>Lý do: {order.Reason}</Text>
                </View>
            )
        }
        return (
            <View style={{
                flex: 1
            }}
            >
                <View>
                    <Overlay
                        animationType='slide'
                        height='auto'
                        isVisible={this.state.visibleModel}
                        onBackdropPress={() => this.setState({ visibleModel: false })}
                    >
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Input
                                label='Lý do'
                                multiline={true}
                                value={this.state.reason}
                                onChangeText={this.handleChangeReason}
                            />
                            <View style={{
                                justifyContent: 'center',
                                flexDirection: 'row',
                            }}
                            >
                                <TouchableOpacity
                                    onPress={() => { this.setState({ visibleModel: false }) }}
                                    style={{ backgroundColor: '#BBBBBB', height: 40, flex: 1, borderRadius: 0 }}
                                >
                                    <Text white center>ĐÓNG</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    disabled={this.state.reason ? false : true}
                                    onPress={() => this.handleFailChange()}
                                    style={{ height: 40, backgroundColor: this.state.reason ? '#006600' : 'gray', flex: 1, borderRadius: 0 }}
                                >
                                    <Text white center>GỬI</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Overlay>
                </View>

                <View style={{
                    backgroundColor: theme.colors.white,
                    alignItems: 'center',
                    marginTop: 3,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    flex: 3
                }}
                >
                    <Text h3 bold center>GIAO HÀNG ĐẾN</Text>
                    <Text center>{order.Address}</Text>
                    <Text center gray>Hồ Chí Minh, Việt Nam</Text>
                </View>

                <View style={{
                    backgroundColor: theme.colors.white,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 3,
                    flex: 3
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                        <Image
                            source={require('../assets/icons/user-account-box.png')}
                            style={{ width: 50, height: 50, marginHorizontal: 10 }} />
                        <View>
                            <Text>Người nhận</Text>
                            <Text bold>{order.Customer}</Text>
                        </View>
                    </View>
                    <Button
                        style={{ height: 50, width: 50, borderRadius: 50, alignItems: 'center', marginHorizontal: 10 }}
                        onPress={this.call}
                        color='#009900'
                    >
                        <Icon.FontAwesome
                            name={'phone'}
                            size={40}
                            color={'white'} />
                    </Button>
                </View>

                <View style={{
                    backgroundColor: theme.colors.white,
                    justifyContent: 'flex-start',
                    marginTop: 3,
                    flexDirection: 'column',
                    flex: 3

                }}
                >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
                        <Text bold header>Tổng thu</Text>
                        <Text>{order.TotalPrice} VND</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 10 }}>
                        <Text bold header>Ghi chú</Text>
                        <Text>{order.Note}</Text>
                    </View>
                </View>
                {buttons}
            </View>
        )
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