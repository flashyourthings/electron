# GitHub Actions Setup Guide

This repository is now configured to automatically build and push Docker images to GitHub Container Registry (GHCR).

## 🚀 Quick Start

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Add GitHub Actions workflow for Docker builds"
   git push origin master
   ```

2. **Watch the build:**
   - Go to your repository on GitHub
   - Click the "Actions" tab
   - You'll see the "Build and Push to GHCR" workflow running

3. **Wait for completion:**
   - The workflow builds 3 images (one per architecture)
   - Total build time: ~15-30 minutes
   - All builds run in parallel

4. **Access your images:**
   ```bash
   # Pull the image for your architecture
   docker pull ghcr.io/YOUR_USERNAME/YOUR_REPO:aarch64-latest
   docker pull ghcr.io/YOUR_USERNAME/YOUR_REPO:armv7hf-latest
   docker pull ghcr.io/YOUR_USERNAME/YOUR_REPO:amd64-latest
   ```

## 📦 What Was Created

### 1. GitHub Actions Workflow
- **Location:** `.github/workflows/docker-publish.yml`
- **Triggers:** Push to main/master, version tags, PRs, manual
- **Builds:** 3 architectures in parallel
- **Pushes to:** GitHub Container Registry

### 2. Updated Dockerfile
- **Location:** `Dockerfile.template`
- **Changed:** Node.js 14.17 → Node.js 20 (required for Electron 33)
- **Base OS:** Debian Bullseye → Debian Bookworm

### 3. Enhanced .dockerignore
- **Location:** `.dockerignore`
- **Added:** Common files/folders to exclude from build context
- **Result:** Faster builds, smaller context

### 4. Updated README
- **Location:** `README.md`
- **Added:** Instructions for using images from GHCR
- **Added:** Building and usage documentation

## 🏷️ Creating Version Releases

To create a versioned release:

```bash
# Tag your release
git tag -a v1.3.0 -m "Release version 1.3.0"
git push origin v1.3.0
```

This will create images tagged with:
- `aarch64-v1.3.0`
- `aarch64-v1.3`
- `aarch64-v1`
- (same for armv7hf and amd64)

## 🔐 Making Images Public

After the first successful build:

1. Go to: `https://github.com/YOUR_USERNAME/YOUR_REPO/packages`
2. Click on your package
3. Click "Package settings"
4. Under "Danger Zone" → "Change visibility"
5. Select "Public"
6. Type the repository name to confirm

## 🛠️ Configuration

### Repository Permissions

Ensure GitHub Actions has package permissions:

1. Go to repository "Settings"
2. Click "Actions" → "General"
3. Scroll to "Workflow permissions"
4. Select "Read and write permissions"
5. Check "Allow GitHub Actions to create and approve pull requests"
6. Click "Save"

### Workflow Customization

Edit `.github/workflows/docker-publish.yml` to:

- **Change trigger branches:**
  ```yaml
  on:
    push:
      branches:
        - main  # Change this
  ```

- **Add more architectures:**
  ```yaml
  strategy:
    matrix:
      include:
        - balena_arch: riscv64
          docker_platform: linux/riscv64
  ```

- **Change registry:**
  ```yaml
  env:
    REGISTRY: docker.io  # Change from ghcr.io
  ```

## 📊 Monitoring Builds

### GitHub Actions Tab
- View build logs
- Re-run failed builds
- Download build artifacts (if configured)

### Package Page
- View all image versions
- See download statistics
- Manage package settings

## 🔄 Using Images in Your Projects

### Example Dockerfile

```dockerfile
FROM ghcr.io/YOUR_USERNAME/balena-electron-env:aarch64-latest

WORKDIR /usr/src/app

# Copy your Electron app
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    image: ghcr.io/YOUR_USERNAME/balena-electron-env:aarch64-latest
    volumes:
      - ./app:/usr/src/app
    environment:
      - DISPLAY=:0
      - BALENAELECTRONJS_WIFI_BUTTON_POSITION=114,13
    privileged: true
```

## 🐛 Troubleshooting

### Build Fails

**Check logs:**
- Go to Actions tab
- Click on the failed workflow
- Click on the failed job
- Expand the failed step

**Common issues:**
- Node modules build failures → Check Node version compatibility
- Out of disk space → Reduce build context size
- Platform-specific issues → Check QEMU compatibility

### Images Not Pushing

**Verify permissions:**
```bash
# Check workflow has write access to packages
gh api repos/OWNER/REPO/actions/permissions
```

**Manual login test:**
```bash
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
```

### Can't Pull Images

**For private images:**
```bash
# Create a PAT (Personal Access Token) with read:packages scope
# Then log in:
echo YOUR_PAT | docker login ghcr.io -u YOUR_USERNAME --password-stdin
docker pull ghcr.io/YOUR_USERNAME/YOUR_REPO:aarch64-latest
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Container Registry Docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Docker Buildx Documentation](https://docs.docker.com/buildx/working-with-buildx/)
- [Multi-platform Builds Guide](https://docs.docker.com/build/building/multi-platform/)

## ✅ Verification Checklist

- [ ] Workflow file created at `.github/workflows/docker-publish.yml`
- [ ] Dockerfile.template updated to Node 20
- [ ] Changes committed and pushed to GitHub
- [ ] Workflow ran successfully (check Actions tab)
- [ ] Images visible in Packages section
- [ ] Images set to public (if desired)
- [ ] Successfully pulled test image locally
- [ ] Documentation updated with correct repository paths

## 🎉 Success!

Once the workflow completes successfully, your multi-architecture Docker images are ready to use!

```bash
# Test pulling an image
docker pull ghcr.io/YOUR_USERNAME/YOUR_REPO:aarch64-latest

# Verify it works
docker run --rm ghcr.io/YOUR_USERNAME/YOUR_REPO:aarch64-latest node --version
# Should show: v20.x.x
```

