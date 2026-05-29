import { AppRegistry } from 'react-native';
// @ts-ignore - this template is copied into the consuming app, where ../lib/App exists.
import App from '../src/App';

AppRegistry.registerComponent('App', () => App);

const root = document.getElementById('root');
if (root) {
  AppRegistry.runApplication('App', {
    rootTag: root,
  });
  console.log('App is running!');
} else {
  console.error('Root element not found!');
}
