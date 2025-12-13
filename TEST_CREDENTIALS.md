# Test Credentials for Secure Login

## Admin Accounts

### Account 1 (Primary Admin)
- **Email/Username**: `admin1@store.com`
- **Password**: `admin123`
- **Status**: Active
- **Access**: Full admin dashboard

### Account 2 (Manager)
- **Email/Username**: `admin2@store.com`
- **Password**: `admin123`
- **Status**: Active
- **Access**: Full admin dashboard

### Account 3 (Inactive)
- **Email/Username**: `admin3@store.com`
- **Password**: `admin123`
- **Status**: Inactive
- **Access**: Login will be denied

## Staff Accounts

### Account 1 (Anna Rodriguez)
- **Email/Username**: `anna@store.com`
- **Password**: `password`
- **Status**: Active
- **Access**: Staff POS only

### Account 2 (Mark Santos)
- **Email/Username**: `mark@store.com`
- **Password**: `password`
- **Status**: Active
- **Access**: Staff POS only

### Account 3 (Rico Dela Cruz)
- **Email/Username**: `rico@store.com`
- **Password**: `password`
- **Status**: Active
- **Access**: Staff POS only

### Account 4 (Lara Garcia)
- **Email/Username**: `lara@store.com`
- **Password**: `password`
- **Status**: Active
- **Access**: Staff POS only

### Account 5 (Carlos Reyes - Inactive)
- **Email/Username**: `carlos@store.com`
- **Password**: `password`
- **Status**: Inactive
- **Access**: Login will be denied

## How to Login

1. Navigate to `http://localhost:5173/login`
2. Enter the **email** as username (e.g., `admin1@store.com`)
3. Enter the **password** (e.g., `admin123`)
4. Click "Login"

### Expected Behavior:
- **Admin users**: Redirected to `/admin/dashboard`
- **Staff users**: Redirected to `/staff/pos`
- **Invalid credentials**: Error toast message
- **Inactive accounts**: "Account deactivated" message
- **Too many attempts**: Rate limit error (wait 60 seconds)

## Security Features Active

✅ Passwords are hashed with bcrypt
✅ Rate limiting: 5 attempts per minute per IP
✅ Token-based authentication (Laravel Sanctum)
✅ SessionStorage (auto-expires on tab close)
✅ Role-based access control
✅ No localStorage usage

## Testing Tips

### Test Rate Limiting:
Try logging in with wrong credentials 6 times quickly - you'll get rate limited.

### Test Role Protection:
1. Login as staff user
2. Try to access `/admin/dashboard` - you'll be redirected to `/staff/pos`

### Test Session Expiry:
1. Login successfully
2. Close the browser tab
3. Open a new tab - you'll need to login again (sessionStorage cleared)

### Test Token Security:
1. Login successfully
2. Open DevTools → Application → Session Storage
3. You'll see the token is stored securely
4. Logout - token is removed

## API Endpoints

All API calls now require authentication:

```
POST   /api/login          - Public (login)
POST   /api/logout         - Authenticated
GET    /api/me             - Authenticated (get user info)
GET    /api/dashboard      - Authenticated
GET    /api/products       - Authenticated
POST   /api/orders         - Authenticated
```

Admin-only endpoints:
```
POST/PUT/DELETE /api/products   - Admin only
POST/PUT/DELETE /api/categories - Admin only
ALL             /api/users      - Admin only
```
