# GitHub Pages 404 Troubleshooting Guide

## Common Causes and Solutions

### 1. Repository Name Issues
- **Issue**: Repository must be named correctly for GitHub Pages
- **Solution**: Repository should be named `username.github.io` OR any name with proper Pages settings

### 2. Branch Configuration
- **Check**: Go to Settings → Pages in your GitHub repository
- **Required Settings**:
  - Source: "Deploy from a branch"
  - Branch: `main` (or `master`)
  - Folder: `/ (root)`

### 3. File Location
- **Required**: `index.html` must be in the root directory of your repository
- **Check**: Verify the file exists at the top level, not in subfolders

### 4. Repository Visibility
- **Issue**: Private repositories need GitHub Pro/paid plan for Pages
- **Solution**: Make repository public OR upgrade to paid plan

### 5. Build Status
- **Check**: Go to repository → Actions tab
- **Look for**: Pages build and deployment workflow
- **Status**: Should show green checkmarks, not red X's

### 6. DNS Propagation (if using custom domain)
- **Wait**: Can take up to 24 hours for DNS changes
- **Check**: Try accessing without custom domain first

### 7. Cache Issues
- **Solution**: Try accessing in incognito/private browser mode
- **Clear**: Browser cache and cookies

## Step-by-Step Verification

1. **Confirm file structure**:
   ```
   your-repository/
   ├── index.html (✓ This must exist in root)
   ├── README.md
   └── other files...
   ```

2. **Check GitHub Pages settings**:
   - Repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)

3. **Verify build logs**:
   - Repository → Actions
   - Look for "pages build and deployment"
   - Check for any error messages

4. **Test URL format**:
   - Standard: `https://username.github.io/repository-name/`
   - User site: `https://username.github.io/` (if repo named username.github.io)

## Alternative: Use docs folder

If root deployment isn't working:

1. Move `index.html` to `docs/` folder
2. Update Pages settings to use `docs` folder instead of root
3. This keeps your source code separate from the website

## Quick Test

Create a simple test file to verify Pages is working:

```html
<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body><h1>GitHub Pages is working!</h1></body>
</html>
```

Replace your index.html temporarily with this content to test if the issue is with Pages configuration or the HTML content itself.