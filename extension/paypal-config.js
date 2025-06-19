// PayPal Configuration for Chrome Extension
// This file contains the PayPal setup that works within Chrome extension constraints

class PayPalDonation {
  constructor() {
    // Using the actual PayPal client ID from your environment
    this.clientId = 'ATGwv7uaowczQmB0HvAcVYfr-FvgGbZBbXXzxAq4xgfQ6NWeDMhM-zCpJOdE1dPlsG0z4Bn_g_TmpBAp';
    this.isProduction = true; // Set to false for sandbox testing
  }

  createDonationUrl(amount, currency = 'USD') {
    // Using PayPal.me for simpler donation process
    // This works with any active PayPal account without needing business setup
    return this.createPayPalMeUrl(amount);
  }

  // PayPal.me method - works with any active PayPal account
  createPayPalMeUrl(amount) {
    // Temporary: Opens PayPal's general donation page until you set up PayPal.me
    // To fix: Go to https://paypal.me/ to create your PayPal.me link
    // Then replace 'YourPayPalUsername' with your actual username
    const hasCustomUsername = !this.isPlaceholder('@EZ21ext');
    
    if (hasCustomUsername) {
      return `https://paypal.me/EZ21ext?country.x=CA&locale.x=en_US/${amount}USD`;
    } else {
      // Fallback to PayPal's send money page
      return `https://www.paypal.com/signin?returnUri=https%3A%2F%2Fwww.paypal.com%2Fmyaccount%2Ftransfer%2Fsend`;
    }
  }
  
  isPlaceholder(username) {
    return username === 'YourPayPalUsername' || username.includes('Your') || username.includes('Example');
  }

  // Method to open donation in new tab
  openDonation(amount) {
    const donationUrl = this.createDonationUrl(amount);
    window.open(donationUrl, '_blank', 'width=600,height=700');
  }
}

// Export for use in popup.js
window.PayPalDonation = PayPalDonation;