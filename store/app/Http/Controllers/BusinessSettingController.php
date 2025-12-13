<?php

namespace App\Http\Controllers;

use App\Models\BusinessSetting;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BusinessSettingController extends Controller
{
    use LogsActivity;

    public function index()
    {
        $settings = BusinessSetting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    public function update(Request $request)
    {
        // Only admin can update settings
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'business_name' => 'nullable|string|max:255',
            'contact_phone' => 'nullable|string|max:50',
            'contact_email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
        ]);

        $updated = [];

        // Update text settings
        foreach (['business_name', 'contact_phone', 'contact_email', 'address'] as $key) {
            if ($request->has($key)) {
                BusinessSetting::set($key, $request->$key);
                $updated[$key] = $request->$key;
            }
        }

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('logos', 'public');
            BusinessSetting::set('logo', $path, 'image');
            $updated['logo'] = $path;
        }

        $this->logActivity(
            'updated',
            'BusinessSetting',
            null,
            'Updated business settings: ' . implode(', ', array_keys($updated)),
            null,
            $updated
        );

        return response()->json([
            'message' => 'Settings updated successfully',
            'updated' => $updated
        ]);
    }
}
