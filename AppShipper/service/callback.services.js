import { AsyncStorage } from 'react-native'
module.exports.getToken = async (callback) => {
  try {
    let Token = await AsyncStorage.getItem('Token')
    callback(Token)
  } catch (err) {
    console.log(`The error is: ${err}`)
  }
}

module.exports.getID = async (callback) => {
  try {
    let id = await AsyncStorage.getItem('ID')
    callback(id)
  } catch (err) {
    console.log(`The error is: ${err}`)
  }
}

module.exports.deleteStorage = async (name) => {
  try {
    await AsyncStorage.removeItem(name)
  } catch (err) {
    console.log(`The error is: ${err}`)
  }
}

module.exports.storeToken = async (tokenValue) => {
  AsyncStorage.setItem('Token', tokenValue, err => {
    if (err) { console.log(`The error is: ${err}`) }
  })
    .catch(err => console.log(`The error is: ${err}`))
}

module.exports.storeID = async (idValue) => {
  AsyncStorage.setItem('ID', idValue, err => {
    if (err) { console.log(`The error is: ${err}`) }
  })
    .catch(err => console.log(`The error is: ${err}`))
}