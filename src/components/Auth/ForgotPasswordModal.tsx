import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@site/src/lib/auth-client";
import "./AuthModal.css";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

export function ForgotPasswordModal({
  isOpen,
  onClose,
  onBackToLogin,
}: ForgotPasswordModalProps): JSX.Element | null {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      await authClient.forgetPassword({
        email: data.email,
        redirectTo: "/reset-password",
      });
      // Always show success message to prevent email enumeration
      setSubmitted(true);
    } catch (err) {
      // Still show success to prevent enumeration
      setSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    reset();
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  if (submitted) {
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
              If an account exists with that email address, we've sent password
              reset instructions. Please check your inbox and spam folder.
            </div>
            <button
              className="auth-submit-button"
              onClick={onBackToLogin}
              style={{ width: "100%" }}
            >
              Back to Sign In
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
          <h2 className="auth-modal-title">Reset Password</h2>
          <button
            className="auth-modal-close"
            onClick={handleClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="auth-modal-body">
          <p
            style={{
              color: "var(--ifm-font-color-secondary)",
              marginBottom: "1rem",
              fontSize: "0.875rem",
            }}
          >
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="auth-form-group">
              <label className="auth-form-label" htmlFor="forgot-email">
                Email
              </label>
              <input
                id="forgot-email"
                type="email"
                className={`auth-form-input ${errors.email ? "error" : ""}`}
                placeholder="you@example.com"
                {...register("email")}
                aria-invalid={!!errors.email}
                aria-describedby={
                  errors.email ? "forgot-email-error" : undefined
                }
              />
              {errors.email && (
                <span id="forgot-email-error" className="auth-form-error">
                  {errors.email.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className={`auth-submit-button ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              Send Reset Link
            </button>
          </form>
        </div>
        <div className="auth-modal-footer">
          <span className="auth-modal-link" onClick={onBackToLogin}>
            Back to Sign In
          </span>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordModal;
