import React from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';

export default {
  closeButton (goBack) {
    return (
      <TouchableOpacity onPress={() => goBack()}>
        <Icon name='ios-close' style={styles.close}/>
      </TouchableOpacity>
    )
  },

  settingsButton (navigate) {
    return (<TouchableOpacity onPress={() => navigate('Settings')}>
        <Icon name='ios-settings' style={styles.settings}/>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  close: {
    marginLeft: 10,
    fontSize: 44,
    color: '#555'
  },
  settings: {
    marginRight: 10,
    fontSize: 28,
    color: '#555'
  }
});
