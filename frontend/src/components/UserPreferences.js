import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserPreferences = () => {
    const [preferences, setPreferences] = useState({
        preferred_system: '',
        notification_settings: {
            email_notifications: true,
            push_notifications: false
        },
        theme_preferences: {
            dark_mode: false,
            font_size: 'medium'
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `/users/${userId}/preferences/`,
                preferences,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            // Handle success
        } catch (error) {
            // Handle error
        }
    };

    return (
        <div className="preferences-container">
            <h2>User Preferences</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Preferred System</label>
                    <select
                        value={preferences.preferred_system}
                        onChange={(e) => setPreferences({
                            ...preferences,
                            preferred_system: e.target.value
                        })}
                    >
                        <option value="vedic">Vedic</option>
                        <option value="western">Western</option>
                        <option value="chinese">Chinese</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={preferences.notification_settings.email_notifications}
                            onChange={(e) => setPreferences({
                                ...preferences,
                                notification_settings: {
                                    ...preferences.notification_settings,
                                    email_notifications: e.target.checked
                                }
                            })}
                        />
                        Email Notifications
                    </label>
                </div>

                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={preferences.theme_preferences.dark_mode}
                            onChange={(e) => setPreferences({
                                ...preferences,
                                theme_preferences: {
                                    ...preferences.theme_preferences,
                                    dark_mode: e.target.checked
                                }
                            })}
                        />
                        Dark Mode
                    </label>
                </div>

                <button type="submit">Save Preferences</button>
            </form>
        </div>
    );
};

export default UserPreferences;