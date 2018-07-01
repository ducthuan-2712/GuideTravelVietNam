// Depdencies
import React from 'react';

// Components
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import { Text } from '../../../../common/GText';
import GColors from '../../../../common/GColors';

// Config
const EMPTY_CELL_HEIGHT = Dimensions.get('window').height;
const EMPTY_CELL_WIDTH = Dimensions.get('window').width;

type Props = {
  style: any;
  routes: Object;
};

class RoutesMap extends React.Component {
  props: Props;

  render(): ReactElement {
    var { routes, style } = this.props;
    return (
      <View style={[styles.container, style]}>
        <View style={[styles.row, styles.top]}>
          <TouchableOpacity activeOpacity={0.8} style={styles.buttonTop} onPress={this.props.outLink}>
            <Image source={require('./img/show.png')} style={styles.IconBottomBtn1} />
            <Text style={[styles.textIcon, styles.text]}>Xem chỉ đường của Google ( Kết nối mạng )</Text>
          </TouchableOpacity>
        </View>
        <View style={[styles.row, styles.bottom]}>
          <View style={[styles.box, styles.left]}>
            <Image source={require('./img/direction-white.png')} style={styles.IconBottomBtn} />
          </View>
          <View style={[styles.box, styles.center]}>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>{routes.legs[0].distance.text}</Text>
            <Text style={styles.text}>{routes.legs[0].duration.text}</Text>
          </View>
          <View style={[styles.box, styles.right]}>
            <TouchableOpacity activeOpacity={0.8} style={styles.button} onPress={this.props.onClose}>
              <Image source={require('../../../../common/img/x.png')} style={styles.IconBottomBtn} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    backgroundColor: GColors.darkBackground,
    marginBottom: 10,
    marginHorizontal: 10,
    borderRadius: 20,
  },
  buttonTop: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  IconBottomBtn: {
    width: 24,
    height: 24,
  },
  IconBottomBtn1: {
    width: 16,
    height: 16,
  },
  textIcon: {
    fontSize: 12,
    lineHeight: 14,
    marginLeft: 10,
  },
  bottom: {
    // backgroundColor: GColors.darkBackground,
    backgroundColor: '#252638',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  box: {
    height: 60,
  },
  left: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  right: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  text: {
    color: 'white',
  },
});

module.exports = RoutesMap;
