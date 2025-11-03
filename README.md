# API Endpoints

## Authentication (Public)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/check-email` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP and get JWT token
- `POST /api/auth/resend-otp` - Resend OTP if expired
- `POST /api/auth/check-email-exists` - Check if email registered

## Profile Management (Protected)
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `GET /api/auth/validate-token` - Validate token
- `POST /api/auth/logout` - Logout

## Portal Access (Protected - Year-based)
- `GET /api/portal/year1` - Year 1 portal
- `GET /api/portal/year2` - Year 2 portal

## Health
- `GET /api/health` - Server status
