<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Handle login request with rate limiting and secure authentication
     */
    public function login(Request $request): JsonResponse
    {
        // Rate limiting: 5 attempts per minute per IP
        $key = 'login.' . $request->ip();
        
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            throw ValidationException::withMessages([
                'email' => ["Too many login attempts. Please try again in {$seconds} seconds."],
            ]);
        }

        // Validate input
        $credentials = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // Find user by email OR username (check both fields)
        $user = User::where('email', $credentials['username'])
                    ->orWhere('name', $credentials['username'])
                    ->first();

        // Enhanced debug logging
        \Log::info('=== Login Attempt ===', [
            'username_input' => $credentials['username'],
            'password_input' => substr($credentials['password'], 0, 3) . '***',
            'user_found' => $user ? 'YES' : 'NO',
            'user_id' => $user ? $user->id : 'n/a',
            'user_name' => $user ? $user->name : 'n/a',
            'user_email' => $user ? $user->email : 'n/a',
            'user_active' => $user ? ($user->is_active ? 'YES' : 'NO') : 'n/a',
            'password_hash_preview' => $user ? substr($user->password, 0, 20) . '...' : 'n/a',
            'password_matches' => $user ? (Hash::check($credentials['password'], $user->password) ? 'YES' : 'NO') : 'n/a',
        ]);

        // Check if user exists and password is correct
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            RateLimiter::hit($key, 60);
            
            \Log::warning('Login failed: Invalid credentials', [
                'username' => $credentials['username'],
                'reason' => !$user ? 'user_not_found' : 'password_mismatch'
            ]);
            
            throw ValidationException::withMessages([
                'username' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check if user is active
        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'username' => ['Your account has been deactivated.'],
            ]);
        }

        // Clear rate limiter on successful login
        RateLimiter::clear($key);

        // Create token (Sanctum will handle secure cookie storage)
        $token = $user->createToken('auth-token', [$user->role])->plainTextToken;

        // Return user data without sensitive information
        return response()->json([
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'token' => $token,
        ], 200);
    }

    /**
     * Handle logout request
     */
    public function logout(Request $request): JsonResponse
    {
        // Revoke all tokens for the authenticated user
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);
    }

    /**
     * Get authenticated user information
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated'
            ], 401);
        }

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ]
        ], 200);
    }
}
