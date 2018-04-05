import firebase from 'firebase';

export const appName = 'conference-app-205fa';

export const firebaseConfig = {
  apiKey: 'AIzaSyBa1FmhMM1WKbg79C05iceZklrZ8uZnLjg',
  authDomain: `${appName}.firebaseapp.com`,
  databaseURL: `https://${appName}.firebaseio.com`,
  projectId: appName,
  storageBucket: `${appName}.appspot.com`,
  messagingSenderId: '259656323435',
};

firebase.initializeApp(firebaseConfig);
