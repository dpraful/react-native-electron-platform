import { AppRegistry } from 'react-native';
import App from '../src/App';

console.log('Registering App with AppRegistry...');

AppRegistry.registerComponent('App', () => App);

console.log('Running App...');

const root = document.getElementById('root');
if (root) {
  AppRegistry.runApplication('App', {
    rootTag: root,
  });
  console.log('App is running!');
} else {
  console.error('Root element not found!');
}
