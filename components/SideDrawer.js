var React = require('react-native');

var { Text, View, Image, StyleSheet, ListView, TouchableHighlight, Platform} = React;
var Drawer = require('react-native-drawer');
var baseStyles = require('../baseStyles');
var Actions = require('react-native-router-flux').Actions;
var Button = require('react-native-button');


export default class SideDrawer extends React.Component {
  constructor(props) {
    super(props);
    
    this.app = props.app;
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      onlineUserCount: 0,
      users: []
    };

    this._renderDrawerContent = this._renderDrawerContent.bind(this);
  }

  componentDidMount() {
    this.app.user().then(user => {
      // Find all online users that are not me
      // TODO (EK): Maybe set a higher max limit
      const query = {
        query: {
          online: true,
          _id: { $nin: [user._id] },
          $limit: 25
        }
      };

      this.app.service('users')
        .find(query)
        .then(result => {
          this.setState({
            onlineUserCount: result.total,
            users: result.data
          });
        })
        .catch(error => {
          console.log(error);
        });
    }).catch(error => {
      console.log(error);
    });
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

  _renderDrawerContent() {
    let onlinePhrase = 'No one\'s online';

    if (this.state.onlineUserCount === 1) {
      onlinePhrase = `${this.state.onlineUserCount} person online`;
    }
    else if (this.state.onlineUserCount > 1) {
      onlinePhrase = `${this.state.onlineUserCount} people online`;
    }

    return (
      <View style={{marginTop: 0, flex: 1}}>
        <View style={styles.userCountContainer}>
          <Text style={styles.userCount}>{onlinePhrase}</Text>
        </View>
        <ListView
          dataSource={this.ds.cloneWithRows(this.state.users)}
          style={{padding:10, flex: 0.93}}
          renderRow={(user, sectionID, rowID) => (

          <TouchableHighlight onPress={() => this._pressRow(user, sectionID, rowID)}>
            <View style={styles.userContainer}>
              <Image source={{uri: user.photoURL}} style={styles.avatar}/>
              <Text style={styles.username}>
                {user.username}
              </Text>
            </View>
          </TouchableHighlight>
          )}
        />

        <View style={{flex: 0.07, alignItems: 'center', justifyContent: 'center'}}>
          <TouchableHighlight style={[baseStyles.baseButton, baseStyles.buttonPrimary, {width: 120, padding: 0}]} onPress={this._signOut.bind(this)}>
            <Text style={[baseStyles.baseButtonText, baseStyles.buttonPrimaryText, {fontSize: 14, fontWeight:'600'}]}>Sign Out</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  render() {
    const drawerStyles = {main: {shadowColor: "#000000", shadowOpacity: 0.3, shadowRadius: 2, elevation: 14, backgroundColor: '#fff'}, drawer : { backgroundColor: '#F1F1F1' }};

    return (
      <Drawer
        ref="drawer"
        type="static"
        content={this._renderDrawerContent()}
        tapToClose={true}
        openDrawerOffset={0.6}
        panCloseMask={0.8}
        closedDrawerOffset={-3}
        negotiatePan={true}
        styles={drawerStyles}
        // tweenHandler={(ratio) => ({
        //   main: { opacity: (2 - ratio) / 1.5 }
        // })}
        tweenHandler={Drawer.tweenPresets.parallax}
        tweenDuration={150}
        tweenEasing="easeInOutBounce"
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
  userCount: {
    marginTop: 5,
    marginBottom: 5,
    color: '#777',
    justifyContent: 'center'
  },
  userCountContainer : {
    marginTop: Platform.OS === 'ios' ? 25 : 0,
    alignItems: 'center'
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12
  },
  username: {
    fontSize: 16,
    fontWeight: '400',
    padding: 5,
    color: '#333',
    height: 24,
    marginLeft: 5
  },
  drawerMain: {
    shadowColor: "#000000",
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 14
  },
  drawer: {
    backgroundColor: '#F1F1F1'
  }
});
