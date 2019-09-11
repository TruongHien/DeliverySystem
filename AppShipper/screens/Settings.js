import React, { Component } from 'react'
import { Image, StyleSheet, ScrollView, TextInput, AsyncStorage, RefreshControl } from 'react-native'
import { Divider, Button, Block, Text } from '../components';
import { theme } from '../constants';
import apiService from '../service/apiService'
import { connect } from 'react-redux';
import { logout } from '../actions/user-action.js'
import call from '../service/callback.services'
import { bindActionCreators } from 'redux';
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ logout }, dispatch);
}
const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}
class Settings extends Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: '#006600',
    },
    title: 'CÀI ĐẶT',
    headerTintColor: '#fff',
  };

  constructor(props) {
    super(props)
    this.ApiService = apiService()
    this.state = {
      editing: null,
      profile: {},
      flag: false,
      refreshing: false
    }
  }

  componentDidMount() {
    this.getUser()
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.getUser().then(() => {
      this.setState({ refreshing: false });
    });
  }
  getUser = async () => {
    call.getToken(result => {
      if (result) {
        this.ApiService.getDetailUser(result).then((data) => {
          this.setState({
            profile: data
          })
        }).catch((e) => {
          if (e.status === 401) {
            this.props.navigation.navigate('Login');
          }
          this.props.navigation.navigate('Login');
        })
      } else {
        this.props.navigation.navigate('Login');
      }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.flag !== prevState.flag) {
      call.getToken(result => {
        if (result) {
          this.ApiService.putDetailUser(this.state.profile, result).then(() => {
            this.setState({
              flag: false
            })
          }).catch((e) => {
            if (e.status === 401) {
              this.props.navigation.navigate('Login');
            }
            this.props.navigation.navigate('Login');
          })
        } else {
          this.props.navigation.navigate('Login');
        }
      })
    }
  }

  handleEdit(name, text) {
    const { profile } = this.state;
    profile[name] = text;

    this.setState({ profile, flag: true });
  }

  toggleEdit(name) {
    const { editing } = this.state;
    this.setState({ editing: !editing ? name : null });
    this.renderEdit(name)
  }

  renderEdit(name) {
    const { profile, editing } = this.state;

    if (editing === name) {
      return (
        <TextInput
          defaultValue={profile[name]}
          onChangeText={text => this.handleEdit([name], text)}
        />
      )
    }

    return <Text bold>{profile[name]}</Text>
  }

  handleLogout = async () => {
    try {
      await call.deleteStorage('Token')
      await call.deleteStorage('ID')
      AsyncStorage.getItem('ID').then((value) => {
        AsyncStorage.getItem('Token').then((token) => {
        })
      })
      this.props.navigation.navigate('Login');
    } catch (error) {
      // Error saving data
    }
  }

  render() {
    const { profile, editing } = this.state;

    return (
      <Block>
        <Block flex={false} row center space="between" style={styles.header}>
          {/* <Text h1 bold>Cài Đặt</Text> */}
          <Button>
            <Image
              source={require('../assets/images/avatar2.jpg')}
              style={styles.avatar}
            />
          </Button>
        </Block>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <Block style={styles.inputs}>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray2 style={{ marginBottom: 10 }}>Họ và Tên</Text>
                <Text bold>{profile.FullName}</Text>
              </Block>
            </Block>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray2 style={{ marginBottom: 10 }}>Số Điện Thoại</Text>
                <Text bold>{profile.Phone}</Text>
              </Block>
            </Block>
            <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray2 style={{ marginBottom: 10 }}>Địa Chỉ</Text>
                <Text bold>{profile.Address}</Text>
              </Block>
            </Block>
            <Block password row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray2 style={{ marginBottom: 10 }}>Email</Text>
                <Text bold>{profile.Username}</Text>
              </Block>
            </Block>
            {/* <Block row space="between" margin={[10, 0]} style={styles.inputRow}>
              <Block>
                <Text gray2 style={{ marginBottom: 10 }}>Mật Khẩu</Text>
                {this.renderEdit('Password')}
              </Block>
              <Text medium secondary onPress={() => this.toggleEdit('Password')}>
                {editing === 'Password' ? 'Lưu' : 'Sửa'}
              </Text>
            </Block> */}

          </Block>

          <Divider margin={[theme.sizes.base, theme.sizes.base * 2]} />

          <Block style={styles.toggles}>
            <Block row center space="between" style={{ marginBottom: theme.sizes.base * 2 }}>
              <Button style={{ borderColor: "#006622", borderWidth: 0.5, width: 100, height: 32, backgroundColor: '#006600' }}>
                <Text white center onPress={this.handleLogout}>Đăng xuất</Text>
              </Button>
            </Block>
          </Block>

        </ScrollView>
      </Block>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: theme.sizes.base * 2,
  },
  avatar: {
    height: theme.sizes.base * 2.2,
    width: theme.sizes.base * 2.2,
  },
  inputs: {
    marginTop: theme.sizes.base * 0.7,
    paddingHorizontal: theme.sizes.base * 2,
  },
  inputRow: {
    alignItems: 'flex-end'
  },
  sliders: {
    marginTop: theme.sizes.base * 0.7,
    paddingHorizontal: theme.sizes.base * 2,
  },
  thumb: {
    width: theme.sizes.base,
    height: theme.sizes.base,
    borderRadius: theme.sizes.base,
    borderColor: 'white',
    borderWidth: 3,
    backgroundColor: theme.colors.secondary,
  },
  toggles: {
    paddingHorizontal: theme.sizes.base * 2,
  }
})
