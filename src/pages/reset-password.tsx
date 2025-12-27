import React, { useState, useEffect } from "react";
import Layout from "@theme/Layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@site/src/lib/auth-client";
import { PasswordStrength } from "@site/src/components/Auth/PasswordStrength";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be at most 128 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

type ResetStatus = "form" | "loading" | "success" | "error" | "invalid";

export default function ResetPasswordPage(): JSX.Element {
  const [status, setStatus] = useState<ResetStatus>("form");
  const [token, setToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");

    if (!tokenParam) {
      setStatus("invalid");
      setErrorMessage("No reset token found in the URL.");
    } else {
      setToken(tokenParam);
    }
  }, []);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    setStatus("loading");

    try {
      const result = await authClient.resetPassword({
        token,
        newPassword: data.password,
      });

      if (result.error) {
        setStatus("error");
        if (result.error.code === "EXPIRED_TOKEN") {
          setErrorMessage(
            "This reset link has expired. Please request a new password reset."
          );
        } else {
          setErrorMessage(
            result.error.message || "Failed to reset password. Please try again."
          );
        }
      } else {
        setStatus("success");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  const getContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="reset-content">
            <div className="reset-spinner" />
            <h1>Resetting your password...</h1>
            <p>Please wait while we update your password.</p>
          </div>
        );

      case "success":
        return (
          <div className="reset-content">
            <div className="reset-icon success">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="var(--ifm-color-success)" />
                <path
                  d="M14 24L21 31L34 18"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1>Password Reset!</h1>
            <p>
              Your password has been successfully updated. You can now sign in
              with your new password.
            </p>
            <a href="/" className="reset-button">
              Go to Homepage
            </a>
          </div>
        );

      case "invalid":
      case "error":
        return (
          <div className="reset-content">
            <div className="reset-icon error">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="var(--ifm-color-danger)" />
                <path
                  d="M16 16L32 32M32 16L16 32"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h1>Reset Failed</h1>
            <p>{errorMessage}</p>
            <a href="/" className="reset-button">
              Go to Homepage
            </a>
          </div>
        );

      case "form":
      default:
        return (
          <div className="reset-content">
            <h1>Set New Password</h1>
            <p className="reset-subtitle">
              Enter your new password below. Make sure it's strong and unique.
            </p>

            <form className="reset-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input
                  id="password"
                  type="password"
                  className={`form-input ${errors.password ? "error" : ""}`}
                  placeholder="Min. 8 characters"
                  {...register("password")}
                />
                {errors.password && (
                  <span className="form-error">{errors.password.message}</span>
                )}
                <PasswordStrength password={password || ""} />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={`form-input ${errors.confirmPassword ? "error" : ""}`}
                  placeholder="Repeat password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <span className="form-error">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>

              <button type="submit" className="reset-button submit">
                Reset Password
              </button>
            </form>
          </div>
        );
    }
  };

  return (
    <Layout title="Reset Password" description="Password reset page">
      <main className="reset-container">
        {getContent()}

        <style>{`
          .reset-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            padding: 2rem;
          }

          .reset-content {
            text-align: center;
            max-width: 400px;
            width: 100%;
          }

          .reset-icon {
            margin-bottom: 1.5rem;
          }

          .reset-spinner {
            width: 48px;
            height: 48px;
            border: 3px solid var(--ifm-color-emphasis-200);
            border-top-color: var(--ifm-color-primary);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto 1.5rem;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          .reset-content h1 {
            margin-bottom: 0.75rem;
            font-size: 1.75rem;
          }

          .reset-subtitle {
            color: var(--ifm-font-color-secondary);
            margin-bottom: 1.5rem;
            line-height: 1.6;
          }

          .reset-form {
            text-align: left;
          }

          .form-group {
            margin-bottom: 1rem;
          }

          .form-group label {
            display: block;
            margin-bottom: 0.375rem;
            font-size: 0.875rem;
            font-weight: 500;
          }

          .form-input {
            width: 100%;
            padding: 0.625rem 0.875rem;
            font-size: 1rem;
            border: 1px solid var(--ifm-color-emphasis-300);
            border-radius: 6px;
            background-color: var(--ifm-background-surface-color);
            color: var(--ifm-font-color-base);
            transition: border-color 0.2s, box-shadow 0.2s;
          }

          .form-input:focus {
            outline: none;
            border-color: var(--ifm-color-primary);
            box-shadow: 0 0 0 3px rgba(var(--ifm-color-primary-rgb), 0.1);
          }

          .form-input.error {
            border-color: var(--ifm-color-danger);
          }

          .form-error {
            display: block;
            font-size: 0.75rem;
            color: var(--ifm-color-danger);
            margin-top: 0.25rem;
          }

          .reset-button {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background-color: var(--ifm-color-primary);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s;
          }

          .reset-button.submit {
            width: 100%;
            margin-top: 0.5rem;
          }

          .reset-button:hover {
            background-color: var(--ifm-color-primary-dark);
            color: white;
          }
        `}</style>
      </main>
    </Layout>
  );
}
