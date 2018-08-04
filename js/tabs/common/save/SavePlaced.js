/**
 * Copyright 2016 Facebook, Inc.
 *
 * You are hereby granted a non-exclusive, worldwide, royalty-free license to
 * use, copy, modify, and distribute this software in source code or binary
 * form for use in connection with the web services and APIs provided by
 * Facebook.
 *
 * As with any software that integrates with the Facebook platform, your use
 * of this software is subject to the Facebook Developer Principles and
 * Policies [http://developers.facebook.com/policy/]. This copyright notice
 * shall be included in all copies or substantial portions of the software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE
 *
 * @flow
 */

'use strict';

// Depdencies
import React from "react"
import Realm from 'realm'
import _ from 'lodash'

// Components
import { 
  View,
} from "react-native";
import { Text, HeaderTitle } from "../../../common/GText"
import StyleSheet from "../../../common/GStyleSheet"
import GButton from "../../../common/GButton"
import GHeader from "../../../common/GHeader"
import GColors from "../../../common/GColors"
import GOffline from '../../../common/GOffline'

// Page
import GCellContainer from "../../../common/cell/GCellContainer"

type Props = {

};

class SavePlaced extends React.Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      results: []
    };

    this.close = this.close.bind(this);
    this.handleData = this.handleData.bind(this);
  }

  componentDidMount() {
    this._fetch()
  }

  _fetchRealm(responseJson) {
    const { source } = this.props
    let schemaArray = []

    source.map(data => {
      data.list.map((session, index) => {
        if (!_.find(schemaArray, function(o) { return o.name == session.place_id })) {
          schemaArray.push({
            name: session.place_id,
            properties: { name: 'string', content: 'string' }
          })
        }
      })
    })

    Realm.open({
      schema: schemaArray
    }).then(realm => {
      source.map(data => {
        data.list.map((session, index) => {
          if (realm.objects(session.place_id).length != 0) {
            const obj = JSON.parse(JSON.stringify(realm.objects(session.content)))
            this.setState({
              results: [
                ...this.state.results,
                ...obj
              ]
            })
          }
        })
      })
    })
  }

  close() {
    this.props.navigator.pop()
  }

  handleData(data) {
    this.props.navigator.push({
      detail: data
    })
  }

  render() {
    const { results } = this.state
    const backItem = {
      title: "Menu",
      layout: "icon",
      icon: require("../../../common/img/header/back.png"),
      onPress: this.close
    }

    return (
      <View style={styles.container}>
        <GHeader
          title="Save Placed"
          navItem={backItem}
          backgroundColor={GColors.main}
          titleColor={GColors.white}
        />
        {results.length > 0
          ? <GCellContainer 
              source={this.props.results}
              onPress={this.handleData}
            />
          : <GOffline modeOfflineData={true} />
        }
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GColors.silver
  },
});

module.exports = SavePlaced
