import * as React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {
  Padding,
  Border,
  FontFamily,
  FontSize,
  Color,
} from '../globelstyle/globelstyle';

const SplashScreen = props => {
  React.useEffect(() => {
    setTimeout(() => {
      props.navigation.replace('StackNavigation');
    }, 3000);
  }, []);
  return (
    <View style={styles.splashScreen}>
      <Image
        source={require('../../assets/Frame2.png')}
        resizeMode="contain"
        style={styles.mainImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainImage: {
    height: 180,
  },
  splashScreen: {
    backgroundColor: '#ffecd1',
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default SplashScreen;
