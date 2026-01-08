# Web Push Notifications

This document describes how to set up and configure native Web Push notifications in podverse-web.

## Overview

podverse-web uses the W3C Push API for native browser push notifications.

## Configuration

### Environment Variables

The Web Push VAPID public key is configured differently depending on your environment:

```env
# Web Push VAPID Public Key (required for push subscriptions)
NEXT_PUBLIC_WEBPUSH_VAPID_PUBLIC_KEY=your-vapid-public-key-here
```

> **Note:** Only the public key is needed in the frontend. The private key stays on the server (in podverse-notifications).

### Environment-Specific Configuration

#### Local Development (without Docker)

For running `npm run dev` locally, add to `.env.local`:

```env
NEXT_PUBLIC_WEBPUSH_VAPID_PUBLIC_KEY=your-dev-vapid-public-key
```

The `.env.local` file is gitignored and only used for local development.

#### Local Docker Development

For running podverse-web in a local Docker container, add to `env/local.env`:

```env
NEXT_PUBLIC_WEBPUSH_VAPID_PUBLIC_KEY=your-dev-vapid-public-key
```

This file is used by `Dockerfile.build.local` which copies it to `.env.production` during the build.

#### Alpha Environment (Docker)

For the alpha environment, add to `env/alpha.env`:

```env
NEXT_PUBLIC_WEBPUSH_VAPID_PUBLIC_KEY=your-alpha-vapid-public-key
```

This file is used by `Dockerfile.build.alpha` which copies it to `.env.production` during the build.

#### Beta Environment (Docker)

For the beta environment, add to `env/beta.env`:

```env
NEXT_PUBLIC_WEBPUSH_VAPID_PUBLIC_KEY=your-beta-vapid-public-key
```

#### Production Environment

For production, the `env/production.env` file is typically empty, with secrets managed through:
- Runtime environment variables injected by the orchestration system
- Secrets management (e.g., Kubernetes secrets, Docker secrets)

```env
NEXT_PUBLIC_WEBPUSH_VAPID_PUBLIC_KEY=your-production-vapid-public-key
```

### Environment Files Summary

| Environment | File | Used By |
|-------------|------|---------|
| Local dev (no Docker) | `.env.local` | `npm run dev` |
| Local Docker | `env/local.env` | `Dockerfile.build.local` |
| Alpha | `env/alpha.env` | `Dockerfile.build.alpha` |
| Beta | `env/beta.env` | Docker builds |
| Production | `env/production.env` or runtime injection | Docker builds |

### VAPID Key Management by Environment

You can use different VAPID key pairs per environment, or share them:

| Approach | Pros | Cons |
|----------|------|------|
| **Same keys everywhere** | Simpler setup | Risk if dev key leaks |
| **Different keys per env** | Better security isolation | More keys to manage |

**Recommendation:** Use different VAPID key pairs for production vs development/alpha. Subscriptions are environment-specific anyway (different databases).

### Config Location

The VAPID public key is accessed in code via:

```typescript
import { config } from '@/config';

const vapidPublicKey = config.public.notifications.webpush.vapidPublicKey;
```

## Generating VAPID Keys

VAPID (Voluntary Application Server Identification) keys are required for Web Push notifications.

### Method 1: Using web-push CLI (Recommended)

```bash
# Install web-push globally
npm install -g web-push

# Generate VAPID keys
web-push generate-vapid-keys
```

Output:
```
=======================================

Public Key:
BNxIq7...your-public-key...

Private Key:
AkT3Xy...your-private-key...

=======================================
```

### Method 2: Using npx (No Install)

```bash
npx web-push generate-vapid-keys
```

### Method 3: Using Node.js Script

```javascript
const webpush = require('web-push');
const keys = webpush.generateVAPIDKeys();
console.log('Public Key:', keys.publicKey);
console.log('Private Key:', keys.privateKey);
```

## Key Distribution

After generating keys:

| Key | Where to Use | Environment Variable |
|-----|--------------|---------------------|
| **Public Key** | podverse-web | `NEXT_PUBLIC_WEBPUSH_VAPID_PUBLIC_KEY` |
| **Public Key** | podverse-notifications | `WEBPUSH_VAPID_PUBLIC_KEY` |
| **Private Key** | podverse-notifications | `WEBPUSH_VAPID_PRIVATE_KEY` |

## Architecture

### Files

```
src/
├── config/
│   └── index.ts                    # VAPID public key config
├── contexts/
│   └── Notifications.tsx           # Notification state management
├── lib/
│   └── notifications/
│       └── webpush/
│           ├── requestNotificationPermission.ts  # Subscribe to push
│           ├── disableNotificationPermission.ts  # Unsubscribe
│           └── index.ts
└── components/
    ├── Settings/
    │   └── Panels/
    │       └── SettingsNotifications.tsx   # Settings UI
    └── Media/
        └── Header/
            └── NotificationIconButton.tsx  # Per-channel subscribe
```

### Service Worker

The Web Push service worker is located at:

```
public/webpush-sw.js
```

This handles:
- Background push events
- Notification display
- Notification click handling

### Flow

1. **User enables notifications** → `requestNotificationPermission()`
2. **Browser prompts for permission** → User grants
3. **Service worker registers** → `/webpush-sw.js`
4. **Push subscription created** → Using VAPID public key
5. **Subscription sent to API** → `POST /account/webpush-device/create`
6. **Server sends push** → podverse-notifications uses private key
7. **Browser receives push** → Service worker shows notification

## API Endpoints

The following API endpoints are used:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/account/webpush-device/create` | Register new subscription |
| PUT | `/account/webpush-device/update` | Update existing subscription |
| DELETE | `/account/webpush-device/delete` | Remove subscription |
| GET | `/account/webpush-device/all-for-account` | List subscriptions |

## Database

Subscriptions are stored in the `account_webpush_device` table:

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| account_id | INTEGER | Foreign key to account |
| endpoint | VARCHAR | Push service endpoint URL |
| p256dh | VARCHAR | Public key from subscription |
| auth | VARCHAR | Auth secret from subscription |
| locale | VARCHAR | User's locale for i18n |
| created_at | TIMESTAMP | Created timestamp |
| updated_at | TIMESTAMP | Updated timestamp |

## Important Notes

1. **HTTPS Required** - Web Push only works on HTTPS (except localhost)
2. **Same Key Pair** - Frontend and backend must use the same VAPID key pair
3. **Don't Regenerate Keys** - Changing keys invalidates all existing subscriptions
4. **Browser Support** - Supported in Chrome, Firefox, Edge, Safari 16+

## Localhost Development

### HTTPS Exception

Web Push requires HTTPS in production, but browsers make an exception for `localhost` during development. This means:

- ✅ `http://localhost:3000` - Works for testing
- ✅ `https://localhost:3000` - Works (if you set up local SSL)
- ❌ `http://192.168.x.x:3000` - Won't work (not localhost)
- ❌ `http://my-machine.local:3000` - Won't work (not localhost)

### Testing Web Push Locally

1. **Start the backend services** - Ensure `podverse-api` and `podverse-notifications` are running
2. **Configure VAPID keys** - Both services need matching keys
3. **Run podverse-web** - `npm run dev` serves on `http://localhost:3000`
4. **Test in browser** - Enable notifications and verify subscription is created

### Local Docker Development

When running podverse-web in Docker locally:

- The container needs access to `podverse-api` and `podverse-notifications`
- Use `host.docker.internal` to access services running on the host machine
- Ensure VAPID keys match across all services

Example `env/local.env` for Docker:

```env
NEXT_PUBLIC_API_HOST=localhost
NEXT_PUBLIC_SSR_API_HOST=host.docker.internal
NEXT_PUBLIC_WEBPUSH_VAPID_PUBLIC_KEY=your-dev-vapid-public-key
```

### Verifying Local Setup

1. **Check browser console** - Look for service worker registration logs
2. **Check Network tab** - Verify `/account/webpush-device/create` request succeeds
3. **Check database** - Subscription should appear in `account_webpush_device` table
4. **Test notification** - Trigger a notification and verify it appears

## Troubleshooting

### "No VAPID public key available"

- Check that `NEXT_PUBLIC_WEBPUSH_VAPID_PUBLIC_KEY` is set
- Restart the dev server after adding env vars

### Service Worker Not Registering

- Ensure you're on HTTPS (or localhost)
- Check browser console for errors
- Verify `/webpush-sw.js` is accessible

### Notifications Not Showing

- Check notification permissions in browser settings
- Verify the subscription was saved to the database
- Check server logs for push send errors

### Push Subscription Fails

- Verify VAPID keys match between frontend and backend
- Check that keys haven't been regenerated
