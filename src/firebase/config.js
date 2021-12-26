import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCe9qq-DEWV7hFT9GdvdKEC-ZfXCL0xtX8",
  authDomain: "project-management-site-e15f2.firebaseapp.com",
  projectId: "project-management-site-e15f2",
  storageBucket: "project-management-site-e15f2.appspot.com",
  messagingSenderId: "181692565436",
  appId: "1:181692565436:web:2258b61a56693df7b54db9"
};

firebase.initializeApp(firebaseConfig)

const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()

// timestamp
const timestamp = firebase.firestore.Timestamp

export { projectFirestore, projectAuth, timestamp }