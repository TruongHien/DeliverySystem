import React from 'react';
import { Image, Dimensions } from 'react-native'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { authLogin, count } from '../actions/user-action.js'
import apiService from '../service/apiService'
import call from '../service/callback.services'
const { width, height } = Dimensions.get('window');
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ authLogin, count }, dispatch);
}
class CheckLogin extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props)
    this.ApiService = apiService()
  }

  componentDidMount() {
    const { navigation } = this.props;
    call.getToken(result => {
      if (result) {
        this.ApiService.getDetailUser(result).then(async (data) => {
          await this.props.authLogin(data)
          navigation.navigate("Browse");
        }).catch((e) => {
          if (e.Status === 401) {
            navigation.navigate('Login');
          }
          navigation.navigate('Login');
        })
      } else {
        navigation.navigate('Login');
      }
    })
  }

  render() {
    return (
      <Image source={require('../assets/splash.png')} style={{ width: width, height: height }} />
    );
  }
}

export default connect(undefined, mapDispatchToProps)(CheckLogin)