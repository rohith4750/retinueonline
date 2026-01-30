/** Session key used to mark user as logged in (set after login/signup, cleared on logout). */
export const LOGGED_IN_KEY = "logged_in";

/** Customer JWT for "My Bookings" / booking history (Bearer token). Stored in localStorage. */
export const CUSTOMER_TOKEN_KEY = "customer_token";

/** Customer email (priority for booking history). Stored in localStorage, cleared on logout. */
export const CUSTOMER_EMAIL_KEY = "customer_email";

export function setLoggedIn(): void {
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(LOGGED_IN_KEY, "1");
    } catch (_) {}
  }
}

export function clearLoggedIn(): void {
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.removeItem(LOGGED_IN_KEY);
      window.localStorage.removeItem(CUSTOMER_TOKEN_KEY);
      window.localStorage.removeItem(CUSTOMER_EMAIL_KEY);
    } catch (_) {}
  }
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(LOGGED_IN_KEY) === "1";
  } catch (_) {
    return false;
  }
}

export function setCustomerToken(token: string): void {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(CUSTOMER_TOKEN_KEY, token);
    } catch (_) {}
  }
}

export function getCustomerToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(CUSTOMER_TOKEN_KEY);
  } catch (_) {
    return null;
  }
}

export function clearCustomerToken(): void {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(CUSTOMER_TOKEN_KEY);
    } catch (_) {}
  }
}

export function setCustomerEmail(email: string): void {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(CUSTOMER_EMAIL_KEY, email.trim().toLowerCase());
    } catch (_) {}
  }
}

export function getCustomerEmail(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(CUSTOMER_EMAIL_KEY);
  } catch (_) {
    return null;
  }
}
