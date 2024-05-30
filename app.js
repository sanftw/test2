// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCrrWIIIeG3ubh1TobuIac0V-M65JvblP0",
    authDomain: "cic-form.firebaseapp.com",
    projectId: "cic-form",
    storageBucket: "cic-form.appspot.com",
    messagingSenderId: "990806380231",
    appId: "1:990806380231:web:5104661de3723d0cad38e2",
    measurementId: "G-4V8H4JK3L6"
  };
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const db = firebase.firestore();

document.getElementById('careerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const message = document.getElementById('message').value;
    const cv = document.getElementById('cv').files[0];

    try {
        // Upload CV to Firebase Storage
        const storageRef = storage.ref('cvs/' + cv.name);
        await storageRef.put(cv);
        const cvURL = await storageRef.getDownloadURL();

        // Save form data to Firestore
        await db.collection('applications').add({
            name: name,
            email: email,
            cvURL: cvURL,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        alert('Form submitted successfully!');
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting the form. Please try again.');
    }
});
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
