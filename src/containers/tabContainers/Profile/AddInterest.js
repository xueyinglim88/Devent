import _ from 'lodash';
import React, { Component } from 'react';
import {
  Alert,
  View,
  Text,
  Image,
  ListView,
  TouchableWithoutFeedback,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import * as actions from './../../../actions';

import InterestItem from './InterestItem';

import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
const computer = (<MaterialIcon name="computer" size={33} color="#aeaeae" />)
const android = (<MaterialIcon name="android" size={33} color="#aeaeae" />)
const add = (<MaterialIcon name="add" size={33} color="#aeaeae" />)

const deviceWidth = require('Dimensions').get('window').width;
const deviceHeight = require('Dimensions').get('window').height;

class AddInterest extends Component {

  constructor(props) {
    super(props)
    this.state = {
      rowStates: {

      }
    }
    this.renderRow = this.renderRow.bind(this)
    this.rowUpdated = this.rowUpdated.bind(this)
  }

  componentWillMount() {
    this.createDataSource(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.createDataSource(nextProps);

    if(nextProps.profile.message !== null) {
      Alert.alert('Message', nextProps.profile.message)
      this.props.resetMessage()
    }
  }

  createDataSource({ items }) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.dataSource = ds.cloneWithRows(items);
  }

  //return arrays of event from events
  renderRow(item) {
    return <InterestItem
              item={item}
              icon={computer}
              onPress={() => this.rowUpdated(item)} />;
  }

  rowUpdated(item){
     let rowStates = { ...this.state.rowStates }; // Make a copy of the object
     rowStates[item.uid] = !rowStates[item.uid];  // If the item is not in the object, !undefined will be evaluated, which results in true, so the operation is safe
     this.setState({rowStates});
   }

  submitItemHelper() {
    if (_.isEmpty(this.state.rowStates)) {
      Alert.alert(
        'Message',
        'Please select at least one item'
      )
    } else {
      Alert.alert(
        'Message',
        'Submit your preference?',
        [
          {text: 'Lets do this!', onPress: () => this.props.submitInterestItem(this.state.rowStates, this.props.trendingData) },
          {text: 'Hmm, let me reselect', onPress: () => console.log('cancel')}
        ]
      )
    }
  }

  render() {
    const { centerEverything, skeleton, container, textContainer, contentContainer, listViewContainer,
      titleContainer, descContainer, title, desc, submitContainer, submitTitle } = styles;
    return (
      <View style={[container]}>
        <View style={[centerEverything, textContainer]}>
          <View style={titleContainer}>
            <Text style={[title]}>What kind of events are you interest in?</Text>
          </View>
          <View style={descContainer}>
            <Text style={[desc]}>You'll see more events from the categories you choose.</Text>
          </View>
        </View>

        <View style={[contentContainer]}>
          <ListView
            enableEmptySections
            contentContainerStyle={listViewContainer}
            dataSource={this.dataSource}
            renderRow={this.renderRow}
          />
        </View>

        <View style={[centerEverything, {paddingBottom: 10}]}>
          <TouchableWithoutFeedback onPress={() => this.submitItemHelper()}>
            <View style={[centerEverything, submitContainer]}>
              <Text style={submitTitle}>Submit</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

      </View>
    )
  }
}

const styles = {
  centerEverything: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  skeleton: {
    borderWidth: 1,
    borderColor: 'red'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5F6F7',
    marginTop: 64
  },
  textContainer: {
    flex: 2
  },
  contentContainer: {
    flex: 8,
    padding: 10
  },
  listViewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  titleContainer: {
    width: deviceWidth*0.8,
  },
  descContainer: {
    width: deviceWidth*0.6,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Helvetica Neue',
    fontWeight: '400',
    textAlign: 'center'
  },
  desc: {
    color: 'grey',
    fontSize: 15,
    fontFamily: 'Helvetica Neue',
    fontWeight: '300',
    textAlign: 'center'
  },
  submitContainer: {
    height: 40,
    width: deviceWidth*0.9,
    bottom: 0,
    backgroundColor: '#4169E1',
    borderRadius: 5,
  },
  submitTitle: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  }
}

const mapStateToProps = (state) => {
  // const sortData = _.map(_.orderBy(state.api.trendingData, ['title'], ['asc']), _.values);
  const sortData = _.map(_.orderBy(state.api.trendingData), _.values);
  const items = _.map(sortData, (val, uid) => {
    return { ...val, uid };
  })
  return { items, trendingData: sortData, profile: state.profile };
}

export default connect(mapStateToProps, actions)(AddInterest);
