import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface Props {
  height?: number;
}

export const TopGreenWave: React.FC<Props> = ({ height = 22 }) => {
  return (
    <View style={[styles.container, { height }]} pointerEvents="none">
      <Svg width="100%" height={height} viewBox="0 0 400 22" preserveAspectRatio="none">
        <Path
          d="M 0,0 L 400,0 L 400,10 C 310,20 210,5 120,16 C 60,22 0,11 0,11 Z"
          fill="#E6F4D7"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
});

export default TopGreenWave;

