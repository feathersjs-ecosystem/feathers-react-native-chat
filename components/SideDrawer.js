var React = require('react-native');

var { Text, View, Image, StyleSheet, ListView, TouchableHighlight} = React;
var Drawer = require('react-native-drawer');
var baseStyles = require('../baseStyles');
var Actions = require('react-native-router-flux').Actions;
var Button = require('react-native-button');


export default class SideDrawer extends React.Component {
  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    //TODO: Load online users from service
    var users = [
      {id: 1, name: 'User 1', avatar: 'http://feathersjs.com/images/logo.png'},
      {id: 2, name: 'User 2', avatar: 'http://feathersjs.com/images/logo.png'}
    ];
    this.state = {
      dataSource: ds.cloneWithRows(users)
    }

    this.app = props.app;
    this._signOut = this._signOut.bind(this);
  }

  _pressRow(user, sectionID, rowID) {
    console.log(user);
    //TODO: Implement direct message functionality
    //Actions.directMessage({user: user, title: user.name});
    //this.openDrawer();
  }

  _signOut() {
    this.app.logout().then(() => Actions.launch());
  }

  renderDrawerContent() {
    return (
      <View style={{marginTop: 0, flex: 1}}>
        <ListView
          dataSource={this.state.dataSource}
          style={{padding:10, flex: 0.9}}
          renderRow={(user, sectionID, rowID) => (

          <TouchableHighlight onPress={() => this._pressRow(user, sectionID, rowID)}>
            <View style={styles.userContainer}>
              <Image source={{uri: user.avatar}} style={styles.avatar}/>
              <Text style={styles.username}>
                {user.name}
              </Text>
            </View>
          </TouchableHighlight>
          )}
        />

        <View style={{flex: 0.1, alignItems: 'center', justifyContent: 'center'}}>
          <TouchableHighlight style={[baseStyles.baseButton, baseStyles.buttonPrimary, {width: 120, padding: 5}]} onPress={this._signOut}>
            <Text style={[baseStyles.baseButtonText, baseStyles.buttonPrimaryText]}>Sign Out</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
// shadowColor: "#000000", shadowOpacity: 0.4, shadowRadius: 3
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
        styles={{main: {}, drawer : {backgroundColor: '#333'}}}
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
    fontSize: 16,
    fontWeight: '600',
    padding: 5,
    color: 'white',
    height: 24,
    marginLeft: 5
  }

});
