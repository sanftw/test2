const navbar = document.querySelector("[data-navbar]");
const navToggler = document.querySelectorAll("[data-nav-toggler]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

for (let i = 0; i < navToggler.length; i++) {
  navToggler[i].addEventListener("click", function () {
    navbar.classList.toggle("active");
    overlay.classList.toggle("active");
  });
}

for (let i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener("click", function () {
    navbar.classList.remove("active");
    overlay.classList.remove("active");
  });
}

// script.js
document.addEventListener("DOMContentLoaded", function() {
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
      link.addEventListener('click', function(event) {
          event.preventDefault();
          const targetUrl = this.href;

          document.body.classList.add('fade-out');

          setTimeout(function() {
              window.location.href = targetUrl;
          }, 500); // Match the timeout duration with the CSS transition duration
      });
  });
});




/**
 * header
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

window.addEventListener("scroll", function () {
  if (window.scrollY >= 100) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
});

/**Horizontal animation scroll */

// script.js
document.addEventListener("DOMContentLoaded", function() {
  const container = document.querySelector('.scroll-container');
  const projectList = document.querySelector('.project-list');
  const items = Array.from(projectList.children);

  // Clone items to create a seamless loop
  items.forEach(item => {
      const clone = item.cloneNode(true);
      projectList.appendChild(clone);
  });

  // Pause animation on hover
  projectList.addEventListener('mouseover', function() {
      projectList.style.animationPlayState = 'paused';
  });

  // Resume animation when not hovering
  projectList.addEventListener('mouseout', function() {
      projectList.style.animationPlayState = 'running';
  });

  // Synchronize manual scrolling with animation
  container.addEventListener('scroll', function() {
      projectList.style.animationPlayState = 'paused';
      clearTimeout(container.scrollTimeout);

      container.scrollTimeout = setTimeout(function() {
          projectList.style.animationPlayState = 'running';
      }, 1000); // Adjust the delay as needed
  });
});

const CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
const API_KEY = 'YOUR_API_KEY';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
const SCOPES = 'https://www.googleapis.com/auth/gmail.send';

let authorizeButton = document.getElementById('authorize_button');
let signoutButton = document.getElementById('signout_button');
let content = document.getElementById('content');
let emailForm = document.getElementById('emailForm');

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(() => {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
        emailForm.onsubmit = handleEmailSubmit;
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        content.style.display = 'block';
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        content.style.display = 'none';
    }
}

function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

function handleEmailSubmit(event) {
    event.preventDefault();
    let to = document.getElementById('to').value;
    let subject = document.getElementById('subject').value;
    let message = document.getElementById('message').value;
    sendEmail(to, subject, message);
}

function sendEmail(to, subject, message) {
    let email = `To: ${to}\r\nSubject: ${subject}\r\n\r\n${message}`;
    let base64EncodedEmail = btoa(unescape(encodeURIComponent(email))).replace(/\+/g, '-').replace(/\//g, '_');
    
    gapi.client.gmail.users.messages.send({
        'userId': 'me',
        'resource': {
            'raw': base64EncodedEmail
        }
    }).then((response) => {
        console.log("Email sent", response);
        alert('Email sent!');
    }).catch((error) => {
        console.error("Error sending email", error);
    });
}

document.addEventListener("DOMContentLoaded", handleClientLoad);

const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const closeBtn = document.querySelector(".close");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let currentIndex = 0;

galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => {
        const img = item.querySelector("img");
        lightbox.style.display = "block";
        lightboxImg.src = img.src;
        currentIndex = index;
    });
});

closeBtn.addEventListener("click", () => {
    lightbox.style.display = "none";
});

prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : galleryItems.length - 1;
    lightboxImg.src = galleryItems[currentIndex].querySelector("img").src;
});

nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex < galleryItems.length - 1) ? currentIndex + 1 : 0;
    lightboxImg.src = galleryItems[currentIndex].querySelector("img").src;
});

lightbox.addEventListener("click", (e) => {
    if (e.target !== lightboxImg && e.target !== prevBtn && e.target !== nextBtn) {
        lightbox.style.display = "none";
    }
});

const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Route to handle form submission
app.post('/submit', upload.single('cv'), (req, res) => {
    const { name, email, phone, message } = req.body;
    const cv = req.file;

    // Set up Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com',
            pass: 'your-email-password'
        }
    });

    const mailOptions = {
        from: 'your-email@gmail.com',
        to: 'client-email@example.com',
        subject: 'New Career Submission',
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
        attachments: [
            {
                filename: cv.filename,
                path: cv.path
            }
        ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            // Delete the uploaded file after sending the email
            fs.unlink(cv.path, (err) => {
                if (err) {
                    console.error(err);
                }
            });
            res.send('Form submitted successfully');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});







