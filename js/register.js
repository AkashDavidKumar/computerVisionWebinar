/* 
========================================================================
   AI Tools for Teachers Webinar Registration System - Multi-Step Logic
   Author: Senior Full Stack Developer & Conversion Rate Optimization Specialist
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- Google Apps Script Web App URL ---
    // IMPORTANT: Paste your deployed Google Apps Script Web App URL here!
    // If left empty, it will gracefully run in Mock Mode for testing.
    const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxUnEqv465IpzCKalyVa7y14xLgeVqX_tlA1LcWJtAYbcgKGLvudBaA9fVJF0ehbeuXow/exec"; 

    // --- DOM Elements ---
    const form = document.getElementById('registration-form');
    const steps = Array.from(document.querySelectorAll('.form-step'));
    const stepNodes = Array.from(document.querySelectorAll('.step-node'));
    const fillBar = document.getElementById('progress-bar-fill');
    
    // Navigation Buttons
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnSubmit = document.getElementById('btn-submit');
    
    // Same as Mobile Number elements
    const sameAsMobileCheckbox = document.getElementById('same-as-mobile');
    const mobileNumberInput = document.getElementById('mobile-number');
    const whatsappNumberInput = document.getElementById('whatsapp-number');

    // Drag and Drop Screenshot Upload elements
    const dragDropZone = document.getElementById('drag-drop-zone');
    const screenshotInput = document.getElementById('payment-screenshot');
    const previewContainer = document.getElementById('screenshot-preview-container');
    const previewImg = document.getElementById('screenshot-preview-img');
    const removeScreenshotBtn = document.getElementById('remove-screenshot-btn');
    
    // Base64 storage for screenshot file upload
    let screenshotBase64 = "";
    let screenshotFileName = "";
    
    // Active step state tracking (0-indexed: 0 = Step 1, 1 = Step 2, 2 = Step 3)
    let currentStepIndex = 0;

    // ========================================================================
    // 1. DYNAMIC STEP TRANSITIONS AND PROGRESS BAR
    // ========================================================================
    function updateFormSteps() {
        steps.forEach((step, idx) => {
            if (idx === currentStepIndex) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });

        // Update progress nodes
        stepNodes.forEach((node, idx) => {
            if (idx < currentStepIndex) {
                node.className = 'step-node completed';
            } else if (idx === currentStepIndex) {
                node.className = 'step-node active';
            } else {
                node.className = 'step-node';
            }
        });

        // Update fill bar width percentage
        const progressPercent = (currentStepIndex / (steps.length - 1)) * 100;
        if (fillBar) fillBar.style.width = progressPercent + '%';

        // Set Navigation Buttons visibility
        if (currentStepIndex === 0) {
            btnPrev.style.display = 'none';
            btnNext.style.display = 'inline-flex';
            btnSubmit.style.display = 'none';
        } else if (currentStepIndex === steps.length - 1) {
            btnPrev.style.display = 'inline-flex';
            btnNext.style.display = 'none';
            btnSubmit.style.display = 'inline-flex';
        } else {
            btnPrev.style.display = 'inline-flex';
            btnNext.style.display = 'inline-flex';
            btnSubmit.style.display = 'none';
        }

        // Scroll back to form top on step change for comfortable mobile UX
        const formTop = document.querySelector('.form-wrapper');
        if (formTop) {
            formTop.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Initialize display steps
    updateFormSteps();

    btnNext.addEventListener('click', () => {
        if (validateStep(currentStepIndex)) {
            currentStepIndex++;
            updateFormSteps();
        }
    });

    btnPrev.addEventListener('click', () => {
        currentStepIndex--;
        updateFormSteps();
    });



    // ========================================================================
    // 3. PAYMENT SCREENSHOT FILE UPLOAD & PREVIEW LOGICS
    // ========================================================================
    
    // Drag & Drop listeners
    ['dragenter', 'dragover'].forEach(eventName => {
        dragDropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragDropZone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dragDropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dragDropZone.classList.remove('dragover');
        }, false);
    });

    dragDropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            screenshotInput.files = files;
            handleFileSelect(files[0]);
        }
    });

    screenshotInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleFileSelect(files[0]);
        }
    });

    removeScreenshotBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        resetScreenshot();
    });

    function handleFileSelect(file) {
        // Validate File Type (must be image)
        if (!file.type.match('image.*')) {
            showError(screenshotInput, "Please upload a valid image file (PNG, JPG, or JPEG).");
            resetScreenshot();
            return;
        }

        // Validate File Size (must be < 5MB)
        const maxLimit = 5 * 1024 * 1024; // 5MB
        if (file.size > maxLimit) {
            showError(screenshotInput, "File size exceeds the 5MB limit. Please upload a smaller image.");
            resetScreenshot();
            return;
        }

        clearError(screenshotInput);

        // Convert image file to Base64 data string for upload
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            screenshotBase64 = reader.result;
            screenshotFileName = file.name;
            
            // Show preview thumbnail in UI
            previewImg.src = reader.result;
            previewContainer.classList.add('active');
            dragDropZone.style.display = 'none';
        };
        reader.onerror = (error) => {
            console.error("FileReader Error: ", error);
            showError(screenshotInput, "Error reading image file. Please try again.");
        };
    }

    function resetScreenshot() {
        screenshotInput.value = "";
        screenshotBase64 = "";
        screenshotFileName = "";
        previewImg.src = "";
        previewContainer.classList.remove('active');
        dragDropZone.style.display = 'block';
    }

    // Clipboard copy payment UPI ID
    const copyBtn = document.getElementById('copy-upi-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const upiIdText = document.querySelector('.upi-id').textContent;
            navigator.clipboard.writeText(upiIdText).then(() => {
                const icon = copyBtn.querySelector('i');
                icon.className = 'fas fa-check';
                copyBtn.style.color = 'var(--success)';
                
                setTimeout(() => {
                    icon.className = 'fas fa-copy';
                    copyBtn.style.color = '';
                }, 2000);
            }).catch(err => {
                console.error("Failed to copy UPI ID: ", err);
            });
        });
    }

    // ========================================================================
    // 4. REAL-TIME INPUT VALIDATION FUNCTIONS
    // ========================================================================
    
    function showError(element, message) {
        // Find parent form group
        const group = element.closest('.form-group');
        if (group) {
            group.classList.add('invalid');
            const errorLabel = group.querySelector('.error-msg');
            if (errorLabel) {
                errorLabel.textContent = message;
            }
        }
    }

    function clearError(element) {
        const group = element.closest('.form-group');
        if (group) {
            group.classList.remove('invalid');
        }
    }

    // Setup input listeners to clear errors on typing
    const inputsToWatch = document.querySelectorAll('.input-control, input[type="checkbox"], input[type="radio"]');
    inputsToWatch.forEach(input => {
        input.addEventListener('input', () => {
            clearError(input);
        });
        input.addEventListener('change', () => {
            clearError(input);
        });
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        // Assumes standard 10 digit Indian numbers
        const re = /^[6-9]\d{9}$/;
        return re.test(phone);
    }

    /**
     * Complete step specific inputs validator
     * @param {number} stepIndex - Current step identifier
     */
    function validateStep(stepIndex) {
        let isValid = true;

        if (stepIndex === 0) {
            // STEP 1 VALIDATIONS (Personal Details)
            const name = document.getElementById('full-name');
            const email = document.getElementById('email-address');
            const mobile = document.getElementById('mobile-number');
            const whatsapp = document.getElementById('whatsapp-number');
            const institution = document.getElementById('college-school-name');
            const district = document.getElementById('district');
            const state = document.getElementById('state');
            
            // Name Check
            if (name.value.trim().length < 3) {
                showError(name, "Full Name must be at least 3 characters long.");
                isValid = false;
            } else {
                clearError(name);
            }

            // Email Check
            if (!validateEmail(email.value.trim())) {
                showError(email, "Please enter a valid email address.");
                isValid = false;
            } else {
                clearError(email);
            }

            // Mobile Check
            if (!validatePhone(mobile.value.trim())) {
                showError(mobile, "Please enter a valid 10-digit mobile number starting with 6-9.");
                isValid = false;
            } else {
                clearError(mobile);
            }

            // WhatsApp Check
            if (!validatePhone(whatsapp.value.trim())) {
                showError(whatsapp, "Please enter a valid 10-digit WhatsApp number.");
                isValid = false;
            } else {
                clearError(whatsapp);
            }

            // School/College Name Check
            if (institution.value.trim().length === 0) {
                showError(institution, "Institution/School name is required.");
                isValid = false;
            } else {
                clearError(institution);
            }

            // District Check
            if (district.value.trim().length === 0) {
                showError(district, "District field is required.");
                isValid = false;
            } else {
                clearError(district);
            }

            // State Check
            if (state.value === "") {
                showError(state, "Please select your state.");
                isValid = false;
            } else {
                clearError(state);
            }



            // AI experience validation
            const aiExpSelected = document.getElementById('ai-experience');
            if (aiExpSelected.value === "") {
                showError(aiExpSelected, "Please select your AI experience level.");
                isValid = false;
            } else {
                clearError(aiExpSelected);
            }
        } 
        
        else if (stepIndex === 1) {
            // STEP 2 VALIDATIONS (Payment) - Screenshot is optional and Transaction ID is removed
            clearError(screenshotInput);
        } 
        
        else if (stepIndex === 2) {
            // STEP 3 VALIDATIONS (Confirmation)
            const confirmYes = document.getElementById('confirm-yes');
            
            // Details check confirmation
            if (!confirmYes || !confirmYes.checked) {
                showError(document.getElementById('confirm-yes'), "You must confirm that all details entered are correct.");
                isValid = false;
            } else {
                clearError(document.getElementById('confirm-yes'));
            }

            // Referral source checklist validation
            const referralRadios = document.getElementsByName('referral-source');
            let referralSelected = false;
            for (const radio of referralRadios) {
                if (radio.checked) {
                    referralSelected = true;
                    break;
                }
            }

            if (!referralSelected) {
                showError(document.getElementById('ref-whatsapp'), "Please let us know how you heard about this webinar.");
                isValid = false;
            } else {
                clearError(document.getElementById('ref-whatsapp'));
            }
        }

        return isValid;
    }

    // ========================================================================
    // 5. GOOGLE SHEET INTEGRATION SUBMIT FLOW
    // ========================================================================
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Halt default HTML form redirection
        
        // Run safety check validation on final step
        if (!validateStep(currentStepIndex)) {
            return;
        }

        // Set Loading state visual triggers
        btnSubmit.classList.add('btn-loading');
        btnSubmit.disabled = true;
        btnPrev.disabled = true;

        // Compile payload details
        const formData = new FormData(form);
        const payload = {
            timestamp: new Date().toISOString(),
            name: formData.get('full-name'),
            email: formData.get('email-address'),
            mobile: formData.get('mobile-number'),
            whatsapp: formData.get('whatsapp-number'),
            institution: formData.get('college-school-name'),
            district: formData.get('district'),
            state: formData.get('state'),
            profession: "N/A",
            subject: "N/A",
            experience: "N/A",
            aiExperience: formData.get('ai-experience'),
            transactionId: "N/A",
            // Screenshot files passed as base64 string directly
            screenshotBase64: screenshotBase64,
            screenshotName: screenshotFileName,
            source: formData.get('referral-source'),
            updates: formData.get('receive-updates') || "No",
            status: "Pending Verification"
        };

        // --- SUBMISSION POST ENGINE ---
        if (APPS_SCRIPT_URL !== "") {
            // Live Apps Script Endpoint configured -> Dispatch request
            fetch(APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Bypasses the redirect CORS block
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8' // Sent as plain/text to avoid preflight CORS blocks in Google Apps Script
                },
                body: JSON.stringify(payload)
            })
            .then(response => {
                // Since mode is 'no-cors', the response is opaque (meaning we cannot read the body or status code),
                // but because the server completed execution successfully, the Google Sheet is updated, and we proceed to success page.
                window.location.href = "thank-you.html";
            })
            .catch(error => {
                console.error("Apps Script Submission Network Error: ", error);
                alert("Network error occurred while submitting registration details.\nPlease check your connection or contact support.");
                resetSubmitButton();
            });
        } else {
            // --- GRACEFUL TEST FALLBACK (MOCK SUBMISSION MODE) ---
            console.warn("Google Apps Script URL is empty. Running form submission in simulation Mock Mode.");
            
            // Simulate network transport delay (1.5 seconds) for premium visual loading feel
            setTimeout(() => {
                // Store test payload in local storage for developer reference
                localStorage.setItem('latest_webinar_registration', JSON.stringify(payload));
                
                // Redirect on simulation success
                window.location.href = "thank-you.html";
            }, 1500);
        }
    });

    function resetSubmitButton() {
        btnSubmit.classList.remove('btn-loading');
        btnSubmit.disabled = false;
        btnPrev.disabled = false;
    }

    // "Same as Mobile Number" sync handler
    if (sameAsMobileCheckbox && mobileNumberInput && whatsappNumberInput) {
        sameAsMobileCheckbox.addEventListener('change', () => {
            if (sameAsMobileCheckbox.checked) {
                whatsappNumberInput.value = mobileNumberInput.value;
                whatsappNumberInput.setAttribute('readonly', 'true');
                whatsappNumberInput.style.opacity = '0.7';
                clearError(whatsappNumberInput);
            } else {
                whatsappNumberInput.removeAttribute('readonly');
                whatsappNumberInput.style.opacity = '1';
            }
        });

        mobileNumberInput.addEventListener('input', () => {
            if (sameAsMobileCheckbox.checked) {
                whatsappNumberInput.value = mobileNumberInput.value;
            }
        });
    }
});
