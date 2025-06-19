# Blackjack Strategy Chrome Extension

A Chrome extension version of the Blackjack Strategy Calculator that provides real-time strategy recommendations and probability analysis.

## Features

- Real-time blackjack strategy recommendations
- Win probability and bust risk calculations
- Card selection interface
- Hand counter with local storage
- Works offline once installed

## Installation

### Method 1: Developer Mode (Recommended)

1. **Download the extension**
   - Download all files from the `extension/` folder to your computer

2. **Open Chrome Extensions**
   - Open Chrome browser
   - Go to `chrome://extensions/`
   - Or click Menu (⋮) → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle "Developer mode" in the top-right corner

4. **Load the Extension**
   - Click "Load unpacked"
   - Select the `extension` folder you downloaded
   - The extension will appear in your extensions list

5. **Pin the Extension**
   - Click the Extensions icon (puzzle piece) in Chrome toolbar
   - Find "Blackjack Strategy Calculator"
   - Click the pin icon to pin it to your toolbar

## Usage

1. **Click the extension icon** in your Chrome toolbar
2. **Select dealer's up card** - click on the dealer's visible card
3. **Select your cards** - click on your hand cards (you can select multiple)
4. **View strategy recommendation** - see the recommended action and probabilities
5. **Click "Clear"** to reset and start a new hand

## Strategy Recommendations

- **HIT** - Take another card
- **STAND** - Keep your current hand
- **DOUBLE** - Double your bet and take one more card
- **SPLIT** - Split pairs into two hands
- **BLACKJACK** - You have 21!
- **BUST** - Your hand exceeds 21

## Probability Display

- **Win Chance** - Probability of winning the hand
- **Bust Risk** - Probability of going over 21 if you hit

## Storage

The extension stores your hand count locally using Chrome's storage API. Your data stays private on your device.

## Troubleshooting

- **Extension not working**: Refresh the extension by going to chrome://extensions/, finding the extension, and clicking the refresh icon
- **Cards not responding**: Try clicking "Clear" and start over
- **Missing recommendations**: Make sure you've selected both dealer and player cards

## Privacy

This extension works completely offline and doesn't send any data to external servers. All calculations happen locally in your browser.