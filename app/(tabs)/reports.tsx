import { StyleSheet } from 'react-native';
import { View } from '@/components/Themed';
import ReportScreen from '../screens/ReportScreen';

export default function ReportScreenTab() {
  return (
    <View style={styles.container}>
      <ReportScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
