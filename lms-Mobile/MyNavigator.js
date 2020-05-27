import HomeScreen from './screens/HomeScreen';
import SignInScreen from './screens/SignInScreen';
import LoadingScreen from './screens/LoadingScreen';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

const AppSwitchNavigator = createSwitchNavigator({
  launch: LoadingScreen,
  signIn: SignInScreen,
  Home: HomeScreen,
}
);

const AppNavigator = createAppContainer(AppSwitchNavigator);

export default AppNavigator;
