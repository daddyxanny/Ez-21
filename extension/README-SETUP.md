# EZ 21 Chrome Extension Setup

## Required Configuration

### PayPal Setup (Fix "Profile Not Found" Error)

1. **Create PayPal.me Account:**
   - Go to https://paypal.me/
   - Log in with your PayPal account
   - Choose a custom username (like paypal.me/YourName)

2. **Update PayPal Configuration:**
   - Open `extension/paypal-config.js`
   - Line 25: Replace `YourPayPalUsername` with your actual PayPal.me username
   - Example: Change `paypal.me/YourPayPalUsername` to `paypal.me/johnsmith`

### Crypto Wallet Setup (Fix Missing Addresses)

1. **Get Your Wallet Addresses:**
   - Bitcoin: Create a BTC wallet and get your address
   - Ethereum: Create an ETH wallet and get your address  
   - Litecoin: Create an LTC wallet and get your address

2. **Update Crypto Addresses:**
   - Open `extension/popup.html`
   - Find lines 624, 632, 640
   - Replace `REPLACE_WITH_YOUR_BTC_ADDRESS` with your Bitcoin address
   - Replace `REPLACE_WITH_YOUR_ETH_ADDRESS` with your Ethereum address
   - Replace `REPLACE_WITH_YOUR_LTC_ADDRESS` with your Litecoin address

### Current Configuration

The extension is set up with:
- Client ID: ATGwv7uaowczQmB0HvAcVYfr-FvgGbZBbXXzxAq4xgfQ6NWeDMhM-zCpJOdE1dPlsG0z4Bn_g_TmpBAp
- Crypto addresses for Bitcoin, Ethereum, and Litecoin
- Amount selection: $3, $5, $10

### Testing

After updating the PayPal configuration:
1. Reload the extension in Chrome
2. Click "Support EZ 21" button
3. Test both PayPal and crypto donation methods
4. Verify the PayPal link opens correctly

### Crypto Addresses

Current crypto addresses in the extension:
- Bitcoin: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
- Ethereum: 0x742d35Cc6634C0532925a3b8D400D628
- Litecoin: LQTpS1N7bR8GHW9vKk8ZddGnYwckk9Zr2P

Update these in `popup.html` if needed.