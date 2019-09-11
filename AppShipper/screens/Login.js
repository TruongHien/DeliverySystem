import React, { Component } from 'react'
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet, View, BackHandler, Alert } from 'react-native'
import { Button, Block, Input, Text, Logo } from '../components';
import { Permissions, Notifications } from 'expo';
import { theme } from '../constants';
import apiService from '../service/apiService'
import call from '../service/callback.services'
import { bindActionCreators } from 'redux';
import { authLogin } from '../actions/user-action.js'
import { connect } from 'react-redux';
import { NavigationActions, StackActions } from 'react-navigation'
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ authLogin }, dispatch);
}
class Login extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props)
    this.ApiService = apiService()
    this.state = {
      username: '',
      password: '',
      errors: [],
      loading: false,
      timeout: false
    }
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    BackHandler.exitApp();
    return true;
  };

  async handleLogin() {
    const { navigation } = this.props;
    const { username, password } = this.state;
    const errors = [];
    Keyboard.dismiss();
    this.setState({ errors, loading: true, timeout: false });

    if (username === '') {
      errors.push('username');
      this.setState({ errors, loading: false });
    }
    if (password === '') {
      errors.push('password');
      this.setState({ errors, loading: false });
    }

    if (!errors.length) {
      this.ApiService.emailLogin(this.state.username, this.state.password)
        .then((response) => response.json())
        .then(async (user) => {
          this.props.authLogin(user)
          await call.storeToken(user.access_token)
          await call.storeID(user.ID)
          await this.registerForPushNotifications(user.ID, user.access_token)
          this.setState({
            loading: false,
          })
          this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: 'Browse' })]
          }))
        })
        .catch((e) => {
          if (e.status === 400) {
            errors.push('Tài khoản hoặc mật khẩu không đúng');
            this.setState({ errors, loading: false });
          }
          this.setState({ errors, loading: false });
        })

    }
  }

  async registerForPushNotifications(ID, usertoken) {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== 'granted') {
        return;
      }
    }
    const token = await Notifications.getExpoPushTokenAsync();
    await this.ApiService.pushTokenNotification({ shipperID: ID, notificationToken: token }, usertoken)
      .then((data) => {
      })
      .catch((e) => {
        alert('Lỗi!')
      })
  }

  render() {
    const { navigation } = this.props;
    const { loading, errors, timeout } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;
    return (
      <View style={styles.container}>
        <Logo></Logo>
        <KeyboardAvoidingView style={styles.login} behavior="padding">
          <Block padding={[0, theme.sizes.base * 2]}>
            <Block middle>
              <Input
                label="Email"
                error={hasErrors('username') || hasErrors('Tài khoản hoặc mật khẩu không đúng')}
                style={[styles.input, hasErrors('username')]}
                defaultValue={this.state.username}
                onChangeText={text => this.setState({ username: text })}
              />
              <Input
                secure
                label="Mật khẩu"
                error={hasErrors('password') || hasErrors('Tài khoản hoặc mật khẩu không đúng')}
                style={[styles.input, hasErrors('password')]}
                defaultValue={this.state.password}
                onChangeText={text => this.setState({ password: text })}
              />
              {hasErrors('Tài khoản hoặc mật khẩu không đúng') ?
                <Text red italic>Tài khoản không chính xác</Text> : null}
              {this.state.timeout ?
                <Text red italic>Time_out</Text> : null}
              <Button gradient onPress={() => this.handleLogin()}>
                {loading ?
                  <ActivityIndicator size="small" color="white" /> :
                  <Text bold white center>Đăng nhập</Text>
                }
              </Button>

              <Button onPress={() => navigation.navigate('Forgot')}>
                <Text gray caption center style={{ textDecorationLine: 'underline' }}>
                  Forgot your password?
              </Text>
              </Button>
            </Block>
          </Block>
        </KeyboardAvoidingView>
      </View>
    )
  }
}
export default connect(undefined, mapDispatchToProps)(Login)
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  login: {
    flex: 4,
    justifyContent: 'center',
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  hasErrors: {
    borderBottomColor: theme.colors.accent,
  }
})
