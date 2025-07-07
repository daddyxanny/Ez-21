# EZ 21 - GitHub Pages Deployment

This is the static version of the EZ 21 Blackjack Strategy Calculator, optimized for GitHub Pages hosting.

## Live Demo

Visit the live application: [EZ21.org)

## Features

- **Real-time Strategy Analysis**: Get instant Hit/Stand recommendations based on basic strategy
- **Probability Calculator**: See win and bust probabilities for any hand
- **Interactive Interface**: Click card slots to select values, auto-adding slots as needed
- **Hand Tracking**: Counts hands played with local storage persistence
- **Mobile Responsive**: Works on desktop and mobile devices
- **Offline Ready**: No server dependencies, works completely offline

## How to Deploy on GitHub Pages

1. **Fork this repository** or create a new one with this code
2. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: /docs
3. **Your site will be live at**: `https://yourusername.github.io/repository-name/`

## Local Development

To run locally, simply open `docs/index.html` in your browser. No build process required.

## Differences from Full-Stack Version

This static version:
- Uses localStorage instead of database
- All calculations run in the browser
- No PayPal integration (simplified to GitHub link)
- No server-side API calls
- Self-contained single HTML file

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Make your changes to `docs/index.html`
3. Test locally by opening the file in your browser
4. Submit a pull request

## License

MIT License - feel free to use and modify for your projects.
