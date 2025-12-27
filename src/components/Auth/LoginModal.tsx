import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn, storeAuthData } from "@site/src/lib/auth-client";
import "./AuthModal.css";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignup: () => void;
  onForgotPassword: () => void;
}

export function LoginModal({
  isOpen,
  onClose,
  onSwitchToSignup,
  onForgotPassword,
}: LoginModalProps): JSX.Element | null {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn.email({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      if (result.error) {
        // Handle rate limiting
        if (result.error.code === "RATE_LIMITED") {
          setError(
            "Too many login attempts. Please try again in a few minutes."
          );
        } else if (result.error.code === "INVALID_CREDENTIALS") {
          setError("Invalid email or password.");
        } else if (result.error.code === "EMAIL_NOT_VERIFIED") {
          setError(
            "Please verify your email address before signing in. Check your inbox for the verification link."
          );
        } else {
          setError(result.error.message || "Login failed. Please try again.");
        }
      } else if (result.data) {
        // Store auth data in localStorage for cross-origin support
        if (result.data.token && result.data.user) {
          storeAuthData(result.data.token, result.data.user);
        }
        // Success - close modal
        reset();
        onClose();
        // Trigger page refresh to update auth state
        window.location.reload();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    reset();
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2 className="auth-modal-title">Sign In</h2>
          <button
            className="auth-modal-close"
            onClick={handleClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="auth-modal-body">
          {error && <div className="auth-alert error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="auth-form-group">
              <label className="auth-form-label" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                className={`auth-form-input ${errors.email ? "error" : ""}`}
                placeholder="you@example.com"
                {...register("email")}
                aria-invalid={!!errors.email}
                aria-describedby={
                  errors.email ? "login-email-error" : undefined
                }
              />
              {errors.email && (
                <span id="login-email-error" className="auth-form-error">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label" htmlFor="login-password">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                className={`auth-form-input ${errors.password ? "error" : ""}`}
                placeholder="Your password"
                {...register("password")}
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "login-password-error" : undefined
                }
              />
              {errors.password && (
                <span id="login-password-error" className="auth-form-error">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <label className="auth-form-checkbox">
                <input type="checkbox" {...register("rememberMe")} />
                <span>Remember me</span>
              </label>
              <span className="auth-modal-link" onClick={onForgotPassword}>
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              className={`auth-submit-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              Sign In
            </button>
          </form>
        </div>
        <div className="auth-modal-footer">
          Don't have an account?{" "}
          <span className="auth-modal-link" onClick={onSwitchToSignup}>
            Create one
          </span>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
