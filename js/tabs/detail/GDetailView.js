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
import React from "react";
import Realm from 'realm';

// Components
import { 
  View,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
  ActionSheetIOS,
  Share,
  Alert
} from "react-native";
import GColors from '../../common/GColors';
import GButton from '../../common/GButton';
import ListContainer from "../../common/ListContainer";
import GActivityIndicator from "../../common/GActivityIndicator";
import { Text } from '../../common/GText';

// Pages
import Info from "./component/info/Info"
import Gallery from "./component/gallery/Gallery"
import Review from "./component/review/Review"

// Config
import { API_KEY_GOOGLE, API_GOOGLE } from "../../env";

class GDetailView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detailsJson: {},
      realmIcon: false
    };

    this.close = this.close.bind(this);
    this.handleGallery = this.handleGallery.bind(this);
    this.handleShare = this.handleShare.bind(this);
    this.handleSavedPlaced = this.handleSavedPlaced.bind(this);
    this.handleOpenMap = this.handleOpenMap.bind(this);
  }

  componentDidMount() {
    this._fetchRealm()
  }

  showAlertOffline() {
    Alert.alert(
      'Không có kết nối internet',
      'Vui lòng di chuyển đến vùng sóng tốt hơn và thử lại !',
      [
        {text: 'Đồng ý', onPress: () => this.close()},
      ]
    )
  }

  _fetch() {
    const { detail } = this.props
    
    fetch(`${API_GOOGLE}/details/json?placeid=${detail.place_id}&key=${API_KEY_GOOGLE}`)
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          detailsJson: responseJson
        })
      })
      .catch((error) => {
        this.showAlertOffline()
      });
  }

  _fetchRealm(responseJson) {
    const { detail } = this.props

    Realm.open({
      schema: [{name: detail.place_id, properties: {name: 'string', content: 'string'}}]
    }).then(realm => {
      // realm.write(() => {
      //   let removeIndex = realm.objects(detail.place_id);
      //   Promise.resolve(
      //     realm.delete(removeIndex)
      //   ).then(() => {
      //     this.setState({
      //       realmIcon: false
      //     })
      //   })
      // })

      if(realm.objects(detail.place_id).length != 0) {
        this.setState({
          realmIcon: true,
          detailsJson: {
            result: JSON.parse(JSON.stringify(realm.objects(detail.content)))
          }
        })
      } else {
        this._fetch()
      }
    });
  }

  close() {
    this.props.navigator.pop()
  }

  handleGallery(synsData) {
    this.props.navigator.push({
      gallery: synsData,
      types: false
    });
  }

  handleShare() {
    let { detailsJson } = this.state
    let url = detailsJson.result.website
    if (Platform.OS === "ios") {
      ActionSheetIOS.showShareActionSheetWithOptions({
        message: detailsJson.result.name,
        url
      }, e => {

      });
    } else {
      Share.share({
        // content
        title: detailsJson.result.name,
        message: url
      }, {
        // options
        dialogTitle: "Share Link to " + detailsJson.result.name // droid-only share option
      }).then(
        // callback
      );
    }
  }

  handleSavedPlaced() {
    const { detailsJson, realmIcon } = this.state
    Realm.open({
      schema: [{name: detailsJson.result.place_id, properties: {name: 'string', content: 'string'}}]
    }).then(realm => {
      realm.write(() => {
        if(realm.objects(detailsJson.result.place_id).length == 0) {
          Promise.resolve(
            realm.create(detailsJson.result.place_id, {
              name: detailsJson.result.place_id,
              content: JSON.stringify(detailsJson)
            })
          ).then(() => {
            this.setState({
              realmIcon: true
            })
          })
        } else {
          // Delete multiple by passing in a `Results`, `List` or JavaScript `Array`
          let removeIndex = realm.objects(detailsJson.result.place_id);
          Promise.resolve(
            realm.delete(removeIndex)
          ).then(() => {
            this.setState({
              realmIcon: false
            })
          })
        }
      })
    })
  }

  handleOpenMap(session) {
    this.props.navigator.push({
      map: session,
      types: false
    })
  }

  render() {
    const { detailsJson } = this.state
    if(Object.keys(detailsJson).length == 0) {
      return <GActivityIndicator />
    }
    
    const backItem = {
      title: "Menu",
      layout: "icon",
      icon: require("../../common/img/header/back.png"),
      onPress: this.close
    }

    let leftItem
    if(detailsJson.result.website) {
      leftItem = {
        title: "Share",
        layout: "icon",
        icon: require("../../common/img/header/share.png"),
        onPress: this.handleShare
      }
    }

    const rightItem = {
      title: "Save",
      layout: "icon",
      icon: this.state.realmIcon ? require("../../common/img/header/star-active.png") : require("../../common/img/header/star.png"),
      onPress: this.handleSavedPlaced
    }

    return (
      <ListContainer
        title={detailsJson.result.name}
        headerBackgroundColor={GColors.main}
        headerTitleColor={GColors.white}
        navItem={backItem}
        leftItem={leftItem}
        rightItem={rightItem}
      >
        <ScrollView
          style={styles.container}
          directionalLockEnabled={false}
          scrollEventThrottle={100}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <Info
            source={detailsJson}
            apiKeyGoogle={API_KEY_GOOGLE}
          />
          <Gallery
            source={detailsJson}
            apiKeyGoogle={API_KEY_GOOGLE}
            onPress={this.handleGallery}
          />
          <Info
            source={detailsJson}
            apiKeyGoogle={API_KEY_GOOGLE}
            bottom={true}
            onMap={this.handleOpenMap}
          />
          <Review
            title="Review"
            source={detailsJson}
          />
        </ScrollView>
      </ListContainer>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GColors.white
  },
})

module.exports = GDetailView
