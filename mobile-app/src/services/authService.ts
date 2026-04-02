import apiClient, { tokenStorage } from ".Client";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  avatarUrl?: string;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string>;
}

// ─── Auth Service ─────────────────────────────────────────────────────────────
export const authService = {
  /**
   * Login with email + password
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
	try {
	    const { data } = await apiClient.post<AuthResponse>(
	      "/auth/login",
	      credentials
	    );
	    await tokenStorage.setToken(data.accessToken);
	    await tokenStorage.setRefreshToken(data.refreshToken);
	    return data;
	} catch (err: any) {
	  console.log("status", err.response?.status);
	  console.log("error data", JSON.stringify(err.response?.data));  // 👈
	  console.log("message", err.message);
	  throw err;
	}
  },

  /**
   * Register new account
   */
  register: async (payload: RegisterRequest): Promise<AuthResponse> => {
	try {
	    const { data } = await apiClient.post<AuthResponse>("/auth/register", payload);
	    await tokenStorage.setToken(data.accessToken);
	    await tokenStorage.setRefreshToken(data.refreshToken);
	    return data;
	  } catch (err: any) {
	    console.log("status", err.response?.status);
	    console.log("error data", JSON.stringify(err.response?.data));  // 👈
	    console.log("message", err.message);
	    throw err;
	  }
  },

  /**
   * Logout (invalidates token on server)
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      await tokenStorage.clearTokens();
    }
  },

  /**
   * Get current authenticated user profile
   */
  getProfile: async (): Promise<User> => {
	try {
	    const { data } = await apiClient.get<User>("/users/me");
	    return data;
	} catch (err: any) {
	  console.log("status", err.response?.status);
	  console.log("error data", JSON.stringify(err.response?.data));  // 👈
	  console.log("message", err.message);
	  throw err;
	}
  },

  /**
   * Update user profile
   */
  updateProfile: async (
    payload: Partial<Pick<User, "firstName" | "lastName">>
  ): Promise<User> => {
	try {
	    const { data } = await apiClient.put<User>("/users/me", payload);
	    return data;
	} catch (err: any) {
	  console.log("status", err.response?.status);
	  console.log("error data", JSON.stringify(err.response?.data));  // 👈
	  console.log("message", err.message);
	  throw err;
	}
  },

  /**
   * Check if user has a valid token (used on app startup)
   */
  checkAuth: async (): Promise<User | null> => {
    const token = await tokenStorage.getToken();
    if (!token) return null;
    try {
      return await authService.getProfile();
    } catch {
      await tokenStorage.clearTokens();
      return null;
    }
  },
};
