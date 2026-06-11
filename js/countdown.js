/* 
========================================================================
   AI Tools for Teachers Webinar Registration System - Countdown Timer
   Author: Senior Full Stack Developer & Conversion Rate Optimization Expert
========================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements for timer display
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    const dateLabelEl = document.getElementById('webinar-date-label');

    /**
     * Calculates the timestamp of the next upcoming Saturday at 6:00 PM.
     * If the current time is Saturday before 6:00 PM, it targets today.
     * Otherwise, it shifts forward to the next Saturday.
     */
    function getNextSaturdayTarget() {
        const now = new Date();
        const target = new Date(now.getTime());
        
        const currentDay = now.getDay(); // 0: Sunday, 1: Monday, ..., 6: Saturday
        let daysUntilSaturday = (6 - currentDay + 7) % 7;
        
        // If today is Saturday, check if 6:00 PM has already passed
        if (daysUntilSaturday === 0) {
            const sixPmToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0, 0);
            if (now.getTime() > sixPmToday.getTime()) {
                daysUntilSaturday = 7; // Target next Saturday
            }
        }
        
        target.setDate(now.getDate() + daysUntilSaturday);
        target.setHours(18, 0, 0, 0); // Set time to 6:00 PM precisely
        return target;
    }

    /**
     * Formats the target date to display nicely in the UI
     * Example: "Saturday, June 6 | 6:00 PM"
     */
    function formatWebinarDate(targetDate) {
        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        let formatted = targetDate.toLocaleDateString('en-IN', options);
        return `${formatted} | 6:00 PM (IST)`;
    }

    const targetDate = getNextSaturdayTarget();
    
    // Set dynamic date labels across the landing page if they exist
    if (dateLabelEl) {
        dateLabelEl.textContent = formatWebinarDate(targetDate);
    }
    
    const inlineDateLabel = document.getElementById('hero-inline-date');
    if (inlineDateLabel) {
        inlineDateLabel.textContent = targetDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    /**
     * Updates the countdown timer display elements
     */
    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate.getTime() - now;

        if (difference <= 0) {
            // Fallback: If timer hits zero, show active status
            if (daysEl) daysEl.textContent = '00';
            if (hoursEl) hoursEl.textContent = '00';
            if (minutesEl) minutesEl.textContent = '00';
            if (secondsEl) secondsEl.textContent = '00';
            
            const countdownTitle = document.querySelector('.countdown-title');
            if (countdownTitle) {
                countdownTitle.textContent = "Webinar is starting now!";
            }
            return;
        }

        // Time calculations
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Pad single digits with leading zeros
        if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
        if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
        if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
        if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
    }

    // Run immediately and update every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
});
