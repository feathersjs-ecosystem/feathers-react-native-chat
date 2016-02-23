var React = require('react-native');

var { Text, View, Image, StyleSheet } = React;

var Drawer = require('react-native-drawer');
var baseStyles = require('../baseStyles');
var Actions = require('react-native-router-flux').Actions;


var Button = require('react-native-button');

export default class SideDrawer extends React.Component {

  renderDrawerContent() {
    return (
      <View style={{marginTop: 25, marginLeft: 10, flex: 1}}>
        <View>
          <View style={styles.userContainer}>
            <Image source={{uri: 'http://feathersjs.com/images/logo.png'}} style={styles.avatar}/>
            <Text style={styles.username}>
              User 1
            </Text>
          </View>
          <View style={styles.userContainer}>
            <Image source={{uri: 'http://feathersjs.com/images/logo.png'}} style={styles.avatar}/>
            <Text style={styles.username}>
              User 2
            </Text>
          </View>
        </View>
        <View style={{flex: 1, position: 'absolute', bottom: 0, left: 0, right: 0, height: 60}}>
          <Button style={[baseStyles.baseButton, baseStyles.primaryButton, {width: 100}]} onPress={Actions.launch}>Sign
            Out</Button>
        </View>
      </View>
    )
  }

  render() {
    return (
      <Drawer
        ref="drawer"
        type="static"
        content={this.renderDrawerContent()}
        tapToClose={true}
        openDrawerOffset={0.6}
        panCloseMask={0.8}
        closedDrawerOffset={-3}
        styles={{main: {shadowColor: "#000000", shadowOpacity: 0.4, shadowRadius: 3}, drawer : {backgroundColor: '#333'}}}
        tweenHandler={Drawer.tweenPresets.parallax}
      >
        {React.Children.map(this.props.children, c => React.cloneElement(c, {
          route: this.props.route
        }))}
      </Drawer>
    )
  }

  openDrawer() {
    this.refs.drawer.toggle();
  }
}
var styles = StyleSheet.create({
  userContainer: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 3,
    alignItems: 'center'
  },
  avatar: {
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: 12
  },
  username: {
    fontSize: 18,
    fontWeight: '700',
    padding: 5,
    color: 'white'
  }

});
