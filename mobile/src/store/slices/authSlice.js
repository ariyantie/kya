import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import authService from '../../services/authService';

// Initial state
const initialState = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  user: null,
  loading: false,
  error: null,
  biometricEnabled: false,
  pinEnabled: false,
  loginAttempts: 0,
  lockoutTime: null,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, deviceInfo }, { rejectWithValue }) => {
    try {
      const response = await authService.login(email, password, deviceInfo);
      
      // Store tokens securely
      await SecureStore.setItemAsync('authToken', response.token);
      await SecureStore.setItemAsync('refreshToken', response.refreshToken);
      
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      
      // Clear stored tokens
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('refreshToken');
      
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const response = await authService.refreshToken(auth.refreshToken);
      
      // Update stored token
      await SecureStore.setItemAsync('authToken', response.token);
      
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ phone, otp }, { rejectWithValue }) => {
    try {
      const response = await authService.verifyOTP(phone, otp);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.requestPasswordReset(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(token, newPassword);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const enableBiometric = createAsyncThunk(
  'auth/enableBiometric',
  async (biometricData, { rejectWithValue }) => {
    try {
      const response = await authService.enableBiometric(biometricData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const loginWithBiometric = createAsyncThunk(
  'auth/loginWithBiometric',
  async (biometricData, { rejectWithValue }) => {
    try {
      const response = await authService.loginWithBiometric(biometricData);
      
      // Store tokens securely
      await SecureStore.setItemAsync('authToken', response.token);
      await SecureStore.setItemAsync('refreshToken', response.refreshToken);
      
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const setPin = createAsyncThunk(
  'auth/setPin',
  async (pin, { rejectWithValue }) => {
    try {
      const response = await authService.setPin(pin);
      
      // Store PIN securely (hashed)
      await SecureStore.setItemAsync('userPin', pin);
      
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const loginWithPin = createAsyncThunk(
  'auth/loginWithPin',
  async (pin, { rejectWithValue }) => {
    try {
      const response = await authService.loginWithPin(pin);
      
      // Store tokens securely
      await SecureStore.setItemAsync('authToken', response.token);
      await SecureStore.setItemAsync('refreshToken', response.refreshToken);
      
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setBiometricEnabled: (state, action) => {
      state.biometricEnabled = action.payload;
    },
    
    setPinEnabled: (state, action) => {
      state.pinEnabled = action.payload;
    },
    
    incrementLoginAttempts: (state) => {
      state.loginAttempts += 1;
      
      // Lock account after 5 failed attempts
      if (state.loginAttempts >= 5) {
        state.lockoutTime = Date.now() + 30 * 60 * 1000; // 30 minutes lockout
      }
    },
    
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
      state.lockoutTime = null;
    },
    
    checkLockoutStatus: (state) => {
      if (state.lockoutTime && Date.now() > state.lockoutTime) {
        state.lockoutTime = null;
        state.loginAttempts = 0;
      }
    },
    
    updateUserData: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    
    clearAuthData: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.error = null;
      state.loginAttempts = 0;
      state.lockoutTime = null;
    },
  },
  
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.error = null;
      state.loginAttempts = 0;
      state.lockoutTime = null;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.loginAttempts += 1;
      
      // Lock account after 5 failed attempts
      if (state.loginAttempts >= 5) {
        state.lockoutTime = Date.now() + 30 * 60 * 1000; // 30 minutes lockout
      }
    });
    
    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      // Don't auto-login after registration, require verification
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Logout
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.error = null;
      state.loginAttempts = 0;
      state.lockoutTime = null;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      // Still clear auth data even if logout fails
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.user = null;
    });
    
    // Refresh Token
    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.token = action.payload.token;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    });
    builder.addCase(refreshToken.rejected, (state) => {
      // Clear auth data if refresh fails
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.user = null;
    });
    
    // OTP Verification
    builder.addCase(verifyOTP.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(verifyOTP.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      // Update user verification status
      if (state.user) {
        state.user.verification = {
          ...state.user.verification,
          phone: true,
        };
      }
    });
    builder.addCase(verifyOTP.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Password Reset Request
    builder.addCase(requestPasswordReset.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(requestPasswordReset.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(requestPasswordReset.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Password Reset
    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    
    // Biometric Login
    builder.addCase(enableBiometric.fulfilled, (state) => {
      state.biometricEnabled = true;
    });
    builder.addCase(loginWithBiometric.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.error = null;
      state.loginAttempts = 0;
      state.lockoutTime = null;
    });
    
    // PIN Login
    builder.addCase(setPin.fulfilled, (state) => {
      state.pinEnabled = true;
    });
    builder.addCase(loginWithPin.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.error = null;
      state.loginAttempts = 0;
      state.lockoutTime = null;
    });
  },
});

export const {
  clearError,
  setLoading,
  setBiometricEnabled,
  setPinEnabled,
  incrementLoginAttempts,
  resetLoginAttempts,
  checkLockoutStatus,
  updateUserData,
  clearAuthData,
} = authSlice.actions;

export default authSlice.reducer;