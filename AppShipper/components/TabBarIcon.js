import React from 'react';
import { Icon } from 'expo';
import Colors from '../constants/Colors';
import {bindActionCreators} from 'redux';
import {authLogin} from '../actions/user-action.js'
import apiService from '../service/apiService'
import call from '../service/callback.services'
import {connect} from 'react-redux';
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ authLogin }, dispatch);
}

 class TabBarIcon extends React.Component {
  // constructor(props) {
  //   super(props)
  //   this.ApiService = apiService()
  //   this.state = {
      
  //   }
  // }

  // componentWillMount() {
  //   call.getToken(result => {
  //     if (result) {
  //           this.ApiService.getDetailUser(result).then((data) => {
  //             this.props.authLogin(data)
  //           }).catch((e) => {
  //             if (e.Status === 401) {
  //               this.props.navigation.navigate('Login');
  //             }
  //             this.props.navigation.navigate('Login');
  //           })
  //     }else{
  //       this.props.navigation.navigate('Login');
  //     }
  //   })
  // }

  
  render() {
    return (
      <Icon.Ionicons
        name={this.props.name}
        size={26}
        style={{ marginBottom: -3 }}
        color={this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
      />
    );
  }
}
export default connect(undefined, mapDispatchToProps)(TabBarIcon)