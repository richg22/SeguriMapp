import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GREEN = '#C7F1D1';

export default function TopBar(){
    const insets = useSafeAreaInsets();
    return(

        <View
          style={[styles.bar,{ top: 0, height: 10 + insets.top }
          ]}
        />
    )
}

const styles = StyleSheet.create({
 bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: GREEN,
    opacity: 1,
    zIndex: 2,
  },

});