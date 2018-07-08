// Depdencies
import React from 'react'

// Components
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native'
import { Paragraph } from '../../../common/GText'
import GColors from '../../../common/GColors'
import GImage from '../../../common/GImage'
import GCell from '../../../common/cell/GCell'
import StyleSheet from '../../../common/GStyleSheet'

type Props = {
  style: any;
  dataMarker: Object;
}

class BoxMarker extends React.Component {
  props: Props

  render() {
    const { style, dataMarker, apiKeyGoogle } = this.props

    return (
      <View style={[styles.container, style]}>
        <View style={styles.boxGroup}>
          <GCell
            onPress={_ => this.props.onPress(dataMarker)}
            session={dataMarker}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: GColors.white,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 2,
    android: {
      elevation: 2,
    }
  },
  boxGroup: {
    flex: 1
  },
  top: {
    flexDirection: 'row',
    width: 100
  },
})

module.exports = BoxMarker
