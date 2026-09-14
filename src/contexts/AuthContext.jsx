// src/contexts/AuthContext.jsx

import { createContext, useContext, useState } from "react";

// create context
const AuthContext = createContext();

// custom hook with error checking
export function useAuth() {
    const context = useContext(AuthContext);
   
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// AuthProvider manages shared authentication state and provides it to child components

export function AuthProvider({ children }) {
    // State for authenticaiton
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');

    // functions will go here...

    // login function
    const login = async (userEmail, password) => {
        try {
            const options = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail, password }),
                credentials: 'include',
            };

            const res = await fetch('/api/users/logon', options);
            const data = await res.json();

            if (res.status === 200 && data.name && data.csrfToken) {
                // success: update state
                setEmail(data.name);
                setToken(data.csrfToken);
                return { success: true };
            } else {
                // failure: return error message
                return {
                    success: false,
                    error: data?.message
                        ? `Authentication failed: ${data.message}`
                        : 'Authentication failed',
                };
            }
        } catch (error) {
            return {
                success: false,
                error: 'Network error during login',
            };
        }
    };

    // Logout Function
    const logout = async () => {
        if (!token) {
            
            return {success: true };
        }
         try {
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token,
                },
                credentials: 'include',
            };

            const res = await fetch('/api/users/logoff', options)

            if (res.ok) {
                return { success: true };
            }
            const data = await res.json().catch(() => ({}));

            return {
                success: false,
                error: data?.message || 'Logout failed'
            };
         } catch (error) {
            return {
                success: false,
                error: 'Network error during logout',
            };
         } finally {
            setEmail('');
            setToken('');
         }
    };

    // context value object
    const value = {
        email,                      // current user's email
        token,                     // CSRF token for API requests
        isAuthenticated: !!token, // computed booleanb for auth status
        login,                   // function to authenticate
        logout,                 // function to clear authentication
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}