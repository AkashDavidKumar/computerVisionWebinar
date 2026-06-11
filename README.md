# Computer Vision for Beginners Webinar Registration System

A complete, production-ready, mobile-first, and highly-optimized webinar registration website designed for **TAITS TECH**. The system is built entirely with **HTML5, CSS3, and Vanilla JavaScript**—requiring zero heavy frameworks or dependencies, yielding ultra-fast page speed indices and lightweight deployment profiles.

---

## 🚀 Key Features

* **Premium SaaS Visual Aesthetics**: Built with cohesive colors (Primary Sky Blue, Secondary Deep Ocean Blue, Slate Dark, Light backgrounds), glassmorphic elements, soft drop shadows, and responsive, dynamic layout structures.
* **Light / Dark Mode Persistent Toggle**: A system that dynamically transitions between themes with a single tap, utilizing `localStorage` to preserve user preferences across different pages.
* **Evergreen Countdown Timer**: A smart timer in `js/countdown.js` that automatically calculates and targets the *upcoming Saturday at 6:00 PM (IST)*, ensuring the timer never expires or looks stale.
* **Interactive Modules & Animations**:
  * Programmatically spawned floating background particles.
  * Verified participation certificate preview card with modal zoom triggers (right-click download blocks active for security).
  * Smooth accordion-based FAQ drop-downs.
  * Auto-sliding testimonial carousel with touch swipe navigation for mobile.
  * Stats counters that count up dynamically when scrolled into view.
* **Three-Step Registration Form**:
  * **Step 1 (Details)**: Personal info collection with responsive regex validators and conditional logic that reveals "Subject Handled" and "Teaching Experience" dropdowns *only* when the "Teaching Staff" profession is selected. Includes "How familiar are you with AI?" validation.
  * **Step 2 (Secure Payment)**: Displays flat ₹49 fee tier, visual UPI QR code, copyable UPI ID, **required** Transaction ID / UTR field, and a **required** Payment Screenshot file uploader supporting real-time receipt previews.
  * **Step 3 (Confirmation)**: Verification consent radio group (Yes/No), feedback source options, and future updates preference (Yes/No).
* **Google Sheets & Google Drive Integration**: Exposes a Fetch API pipeline connecting to Google Apps Script that automatically saves entries in a sheet and uploads base64 screenshot images to a Google Drive folder.
* **Dynamic Confetti Success Animations**: Celebratory confetti simulation running on the Thank You landing page using lightweight HTML5 Canvas.

---

## 📁 File Structure

```text
/
├── index.html                  # Core Webinar landing page
├── register.html               # Multi-step registration checkout form
├── thank-you.html              # Success page with canvas confetti
├── css/
│   ├── style.css               # Central design system, theme variables & main layouts
│   ├── register.css            # Styles for multi-step structures, QR & upload zones
│   └── responsive.css          # Responsive media queries (mobile-first)
├── js/
│   ├── main.js                 # Header scroll shadows, FAQs, carousel, certificate modal & counters
│   ├── register.js             # Form navigation flow, validations & Fetch submissions
│   └── countdown.js            # Evergreen upcoming Saturday countdown logic
├── google_apps_script.js       # Apps Script backend API code
└── README.md                   # Installation & deployment instructions
```

---

## ⚙️ Google Sheets Integration Setup

Follow these simple steps to connect the registration form to a Google Sheet:

### Step 1: Create a Google Spreadsheet
1. Open [Google Sheets](https://sheets.google.com) and click **Blank Spreadsheet**.
2. Rename the spreadsheet to `Computer Vision Webinar Registrations`.
3. In the first tab (usually named `Sheet1`), you do *not* need to manually write headers. The script will automatically configure and bold them on the first registration, but for reference, the columns are:
   * *Timestamp, Name, Email, Mobile, WhatsApp, Institution, District, State, Profession, Subject, Teaching Experience, AI Familiarity, Transaction ID, Screenshot URL, Source, Future Updates, Status*

### Step 2: Open Google Apps Script
1. Inside your new Google Sheet, click **Extensions** in the top menu and select **Apps Script**.
2. Delete any default code in the editor (the empty `myFunction`).
3. Open the file `google_apps_script.js` from this project folder, copy the entire code, and paste it into the Apps Script editor.
4. Click the **Save icon** (floppy disk) or press `Ctrl + S`.

### Step 3: Deploy as a Web Application
1. Click the **Deploy** button in the top right and select **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Configure the settings:
   * **Description**: `TAITS TECH Computer Vision Webinar API`
   * **Execute as**: **Me (your-email@gmail.com)**
   * **Who has access**: **Anyone** *(Crucial: This must be "Anyone" so the website can submit data without requesting Google authentication).*
4. Click **Deploy**.
5. Google will request authorization. Click **Authorize access**, choose your Google Account, click **Advanced** (on the warning screen), and select **Go to Untitled project (unsafe)** or **Go to [Project Name] (unsafe)**. Click **Allow**.
6. Copy the generated **Web App URL** from the success screen (it ends in `/exec`).

### Step 4: Paste Web App URL in Website
1. Open the file `js/register.js` in your text editor.
2. Locate line **13**:
   ```javascript
   const APPS_SCRIPT_URL = "";
   ```
3. Paste your copied Web App URL inside the quotation marks:
   ```javascript
   const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycb...your_code.../exec";
   ```
4. Save the file. Your form is now fully connected to your Google Sheet!

---

## 🛠️ Offline testing (Mock Mode)

If you run the website locally *without* pasting a Web App URL inside `js/register.js`, the registration page will **automatically run in Mock Mode**.
* When you submit the form, it will simulate a network request with a visual loading spinner for 1.5 seconds, save the entry details inside your browser's local storage for previewing, and successfully redirect to `thank-you.html` with full confetti animations.
* This allows you to inspect the front-end validation, flows, and visuals without needing to deploy the Google Sheets backend first!

---

## 🌐 Deploying to Production (Free Hosting)

Since the website uses only pure HTML, CSS, and JS, you can host it **100% free** on any static hosting provider.

### Option A: GitHub Pages
1. Create a new repository on your GitHub account (e.g. `computerVisionWebinar`).
2. Upload all the files inside this directory (ensure `index.html` is at the root level).
3. Go to repository **Settings** -> **Pages** in the left menu.
4. Under "Build and deployment", select **Deploy from a branch** and set the branch to **main** (or `master`) and directory to `/root`. Click **Save**.
5. Your website will be live in 1-2 minutes!

### Option B: Netlify
1. Log in to [Netlify](https://www.netlify.com).
2. Go to "Sites" and drag-and-drop this entire folder into the upload box at the bottom.
3. Your site will deploy instantly!

---

## 📝 Customization Tips

* **Change UPI ID / Pricing**: If you wish to change the registration cost or the target merchant UPI ID, open `register.html` and search for `tonybaskar83@okaxis`. You can edit the text there. The pricing is hardcoded to ₹49 in `js/main.js` which automatically applies the flat fee to all elements and deep links. To change the visual QR code, you can replace the QR image inside `images/Payment_QR_Cropped-49rs.jpeg`.
* **Customize Trainer Info**: Open `index.html` and scroll to Section 6 to customize the trainer's name, biography, tags, and social media links.
* **Logo Customization**: Locate the `<a href="index.html" class="logo">` block in `index.html`, `register.html`, and `thank-you.html` to swap out or customize the brand logo image and text.
