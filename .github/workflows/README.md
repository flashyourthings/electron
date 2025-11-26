# GitHub Actions Workflows

## Docker Build and Push Workflow

The `docker-publish.yml` workflow automatically builds multi-architecture Docker images and pushes them to GitHub Container Registry (GHCR).

### Triggers

The workflow runs on:
- **Push to main/master branch** - Builds and pushes images tagged with branch name
- **Push tags starting with `v*`** - Builds and pushes versioned images (e.g., `v1.2.3`)
- **Pull requests** - Builds images but doesn't push (for validation)
- **Manual trigger** - Can be run manually from the Actions tab

### What It Does

1. **Multi-architecture builds** for:
   - `linux/arm64` (aarch64)
   - `linux/arm/v7` (armv7hf)
   - `linux/amd64` (x86_64)

2. **Pushes images** to `ghcr.io/OWNER/REPOSITORY` with tags:
   - `aarch64-latest` / `armv7hf-latest` / `amd64-latest` - Latest main branch
   - `aarch64-v1.2.3` / `armv7hf-v1.2.3` / `amd64-v1.2.3` - Version tags
   - `aarch64-sha-abc123` - Git commit SHA
   - `aarch64-pr-123` - Pull request builds

3. **Uses GitHub Actions cache** to speed up subsequent builds

### Image Naming Convention

Images follow this pattern:
```
ghcr.io/OWNER/REPOSITORY:ARCH-TAG
```

Examples:
- `ghcr.io/balenablocks/balena-electron-env:aarch64-latest`
- `ghcr.io/balenablocks/balena-electron-env:armv7hf-v1.2.11`
- `ghcr.io/balenablocks/balena-electron-env:amd64-sha-abc1234`

### Pulling Images

Images are public by default (if repository is public). To pull:

```bash
docker pull ghcr.io/OWNER/REPOSITORY:aarch64-latest
```

### Authentication

The workflow uses the built-in `GITHUB_TOKEN` which has permissions to:
- Read repository contents
- Write to GitHub Packages (GHCR)

No additional secrets need to be configured.

### Making Images Public

After the first push, you may need to make the package public:

1. Go to your repository on GitHub
2. Click "Packages" in the right sidebar
3. Click on your package name
4. Click "Package settings"
5. Scroll down to "Danger Zone"
6. Click "Change visibility" and select "Public"

### Local Testing

To test the Docker build locally:

```bash
# Generate Dockerfile for specific architecture
sed "s/%%BALENA_ARCH%%/aarch64/g" ./Dockerfile.template > ./Dockerfile.aarch64

# Build for local platform
docker build -f Dockerfile.aarch64 -t test-image .

# Or use buildx for multi-platform
docker buildx build \
  --platform linux/arm64 \
  -f Dockerfile.aarch64 \
  -t test-image .
```

### Troubleshooting

**Build fails with "no space left on device"**
- GitHub Actions runners have limited disk space (~14GB available)
- The workflow uses layer caching to minimize disk usage

**Images not appearing in GHCR**
- Check workflow logs for push errors
- Ensure GITHUB_TOKEN has package write permissions
- Verify repository settings allow GitHub Actions to write packages

**Cross-platform build issues**
- QEMU is set up automatically for cross-architecture builds
- Some native dependencies might fail on emulated architectures
- Consider using architecture-specific build steps if needed

