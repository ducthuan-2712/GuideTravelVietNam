// Depdencies
import React from "react";

// Components
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { Paragraph } from '../../../../common/GText';
import GColors from '../../../../common/GColors';
import GImage from '../../../../common/GImage';
import GCell from '../../../../common/cell/GCell';
import StyleSheet from "../../../../common/GStyleSheet";

type Props = {
  style: any;
  dataMarker: Object;
  onClose: ?() => void;
};

class BoxMarker extends React.Component {
  props: Props;

  render() {
    const { style, dataMarker, apiKeyGoogle, types } = this.props;

    return (
      <View style={[styles.container, style]}>
        <View style={styles.boxGroup}>
          <GCell
            onPress={_ => this.props.onPress(dataMarker)}
            session={dataMarker}
          />
        </View>
        {types &&
          <View style={styles.top}>
            <TouchableOpacity activeOpacity={0.8} style={styles.box} onPress={_ => this.props.onClose(dataMarker)}>
              <View style={styles.circle}>
                <Image source={require('../../../../common/img/x-white.png')} style={styles.IconBottomBtn} />
              </View>
              <Text style={[styles.textIcon, styles.text]}>Đóng</Text>
            </TouchableOpacity>
          </View>
        }
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
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
  },
  circle: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  IconBottomBtn: {
    width: 24,
    height: 24,
  },
  textIcon: {
    fontSize: 12,
    lineHeight: 14,
  },
});

module.exports = BoxMarker;
