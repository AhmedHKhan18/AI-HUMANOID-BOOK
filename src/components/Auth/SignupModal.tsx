import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUp } from "@site/src/lib/auth-client";
import { PasswordStrength } from "./PasswordStrength";
import "./AuthModal.css";

const signupSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(
        /^[a-zA-Z0-9]+$/,
        "Username can only contain letters and numbers"
      ),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be at most 128 characters"),
    confirmPassword: z.string(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function SignupModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: SignupModalProps): JSX.Element | null {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const password = watch("password");

  const onSubmit = async (data: SignupFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.username,
        username: data.username,
      });

      if (result.error) {
        setError(result.error.message || "Registration failed. Please try again.");
      } else {
        setSuccess(true);
        reset();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    reset();
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  if (success) {
    return (
      <div className="auth-modal-overlay" onClick={handleClose}>
        <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
          <div className="auth-modal-header">
            <h2 className="auth-modal-title">Check Your Email</h2>
            <button
              className="auth-modal-close"
              onClick={handleClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <div className="auth-modal-body">
            <div className="auth-alert success">
              Registration successful! We've sent a verification link to your
              email address. Please check your inbox and click the link to
              verify your account.
            </div>
            <button
              className="auth-submit-button"
              onClick={handleClose}
              style={{ width: "100%" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <h2 className="auth-modal-title">Create Account</h2>
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
              <label className="auth-form-label" htmlFor="signup-username">
                Username
              </label>
              <input
                id="signup-username"
                type="text"
                className={`auth-form-input ${errors.username ? "error" : ""}`}
                placeholder="johndoe"
                {...register("username")}
                aria-invalid={!!errors.username}
                aria-describedby={
                  errors.username ? "signup-username-error" : undefined
                }
              />
              {errors.username && (
                <span id="signup-username-error" className="auth-form-error">
                  {errors.username.message}
                </span>
              )}
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label" htmlFor="signup-email">
                Email
              </label>
              <input
                id="signup-email"
                type="email"
                className={`auth-form-input ${errors.email ? "error" : ""}`}
                placeholder="you@example.com"
                {...register("email")}
                aria-invalid={!!errors.email}
                aria-describedby={
                  errors.email ? "signup-email-error" : undefined
                }
              />
              {errors.email && (
                <span id="signup-email-error" className="auth-form-error">
                  {errors.email.message}
                </span>
              )}
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label" htmlFor="signup-password">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                className={`auth-form-input ${errors.password ? "error" : ""}`}
                placeholder="Min. 8 characters"
                {...register("password")}
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "signup-password-error" : undefined
                }
              />
              {errors.password && (
                <span id="signup-password-error" className="auth-form-error">
                  {errors.password.message}
                </span>
              )}
              <PasswordStrength password={password || ""} />
            </div>

            <div className="auth-form-group">
              <label
                className="auth-form-label"
                htmlFor="signup-confirm-password"
              >
                Confirm Password
              </label>
              <input
                id="signup-confirm-password"
                type="password"
                className={`auth-form-input ${errors.confirmPassword ? "error" : ""}`}
                placeholder="Repeat password"
                {...register("confirmPassword")}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword
                    ? "signup-confirm-password-error"
                    : undefined
                }
              />
              {errors.confirmPassword && (
                <span
                  id="signup-confirm-password-error"
                  className="auth-form-error"
                >
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <label className="auth-form-checkbox">
              <input type="checkbox" {...register("acceptTerms")} />
              <span>
                I agree to the{" "}
                <a href="/terms" className="auth-modal-link">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="auth-modal-link">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.acceptTerms && (
              <span className="auth-form-error">
                {errors.acceptTerms.message}
              </span>
            )}

            <button
              type="submit"
              className={`auth-submit-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              Create Account
            </button>
          </form>
        </div>
        <div className="auth-modal-footer">
          Already have an account?{" "}
          <span className="auth-modal-link" onClick={onSwitchToLogin}>
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
}

export default SignupModal;
