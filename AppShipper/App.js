import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppLoading, Asset } from 'expo';
import Navigation from './navigation'
import { Block } from './components';
import { Provider } from 'react-redux';
import { store } from './store/index'

// import all used images
const images = [
  require('./assets/icons/user-account-box.png'),
  require('./assets/icons/pin.png'),
  require('./assets/icons/loading.gif'),
  require('./assets/images/avatar.png'),
  require('./assets/images/mylocation.png'),
  require('./assets/images/no_order.png'),
  require('./assets/images/avatar2.jpg'),
  require('./assets/splash.png'),
];

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  }

  handleResourcesAsync = async () => {
    // we're caching all the images
    // for better performance on the app

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });

    return Promise.all(cacheImages);
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this.handleResourcesAsync}
          onError={error => console.warn(error)}
          onFinish={() => this.setState({ isLoadingComplete: true })}
        />
      )
    }

    return (
      <Provider store={store}>
        <Block white>
          <Navigation />
        </Block>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
});
