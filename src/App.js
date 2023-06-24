import logo from './logo.svg';
import './App.css';
import SideBar from './SideBar';
import ContactBar from './ContactBar';
import MessageTab from './MessageTab';
import firebase from 'firebase/compat/app'
const firebaseConfig = {
  apiKey: "AIzaSyDnsU3f1fH9jPcTHniNrqJJnnV4Gb9pM7U",
  authDomain: "chatvibe-ddfac.firebaseapp.com",
  projectId: "chatvibe-ddfac",
  storageBucket: "chatvibe-ddfac.appspot.com",
  messagingSenderId: "650779234388",
  appId: "1:650779234388:web:11230a932f23837908ddc1"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
function App() {
  return (
    <div className="flex bg-bgColor h-screen w-screen">
      <SideBar/>
      <ContactBar/>
      <MessageTab/>
    </div>
  );
}

export default App;
