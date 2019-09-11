import React, { Component } from 'react';
import { Alert, ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native';
import apiService from '../service/apiService'
import { Button, Block, Input, Text } from '../components';
import { theme } from '../constants';

export default class Forgot extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props)
    this.ApiService = apiService()
    this.state = {
      email: null,
      errors: [],
      isEmail: false,
      loading: false
    }
  }

  async handleForgot() {
    const { navigation } = this.props;
    const errors = [];
    this.setState({
      isEmail: false,
      loading: true
    })
    Keyboard.dismiss();

    // check with backend API or with some static data
    await this.ApiService.getEmail(this.state.email).then((data) => {
      this.setState({
        isEmail: data, loading: false
      })
      errors.push('email');
    }).catch((e) => {
      this.setState({
        errors, loading: false
      })
    })

    if (this.state.isEmail) {
      Alert.alert(
        'Mật Khẩu đã gửi!',
        'Xin hãy kiểm tra email của bạn.',
        [
          {
            text: 'OK', onPress: () => {
              navigation.navigate('Login')
            }
          }
        ],
        { cancelable: false }
      )
    } else {
      Alert.alert(
        'Lỗi',
        'Xin hãy kiểm tra địa chỉ email của bạn.',
        [
          { text: 'Thử lại', }
        ],
        { cancelable: false }
      )
    }
  }

  render() {
    const { navigation } = this.props;
    const { loading, errors } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;

    return (
      <KeyboardAvoidingView style={styles.forgot} behavior="padding">
        <Block padding={[0, theme.sizes.base * 2]}>
          {/* <Text h1 bold>Forgot</Text> */}
          <Block middle>
            <Input
              label="Email"
              error={hasErrors('email')}
              style={[styles.input, hasErrors('email')]}
              defaultValue={this.state.email}
              onChangeText={text => this.setState({ email: text })}
            />
            <Button gradient onPress={() => this.handleForgot()}>
              {loading ?
                <ActivityIndicator size="small" color="white" /> :
                <Text bold white center>Gửi</Text>
              }
            </Button>

            <Button onPress={() => navigation.navigate('Login')}>
              <Text gray caption center style={{ textDecorationLine: 'underline' }}>
                Back to Login
              </Text>
            </Button>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  forgot: {
    flex: 1,
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
