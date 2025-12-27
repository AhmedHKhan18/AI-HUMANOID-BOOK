import React, { useEffect, useState } from "react";
import Layout from "@theme/Layout";
import { authClient } from "@site/src/lib/auth-client";

type VerificationStatus = "loading" | "success" | "error" | "expired";

export default function VerifyEmailPage(): JSX.Element {
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const verifyEmail = async () => {
      // Extract token from URL
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");

      if (!token) {
        setStatus("error");
        setErrorMessage("No verification token found in the URL.");
        return;
      }

      try {
        const result = await authClient.verifyEmail({
          token,
        });

        if (result.error) {
          if (result.error.code === "EXPIRED_TOKEN") {
            setStatus("expired");
          } else {
            setStatus("error");
            setErrorMessage(
              result.error.message || "Email verification failed."
            );
          }
        } else {
          setStatus("success");
        }
      } catch (err) {
        setStatus("error");
        setErrorMessage("An unexpected error occurred during verification.");
      }
    };

    verifyEmail();
  }, []);

  const getContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="verify-content">
            <div className="verify-spinner" />
            <h1>Verifying your email...</h1>
            <p>Please wait while we verify your email address.</p>
          </div>
        );

      case "success":
        return (
          <div className="verify-content">
            <div className="verify-icon success">
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
            <h1>Email Verified!</h1>
            <p>
              Your email has been successfully verified. You can now sign in to
              access all features.
            </p>
            <a href="/" className="verify-button">
              Go to Homepage
            </a>
          </div>
        );

      case "expired":
        return (
          <div className="verify-content">
            <div className="verify-icon warning">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle
                  cx="24"
                  cy="24"
                  r="24"
                  fill="var(--ifm-color-warning)"
                />
                <path
                  d="M24 16V26M24 32H24.02"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h1>Link Expired</h1>
            <p>
              This verification link has expired. Please sign in and request a
              new verification email.
            </p>
            <a href="/" className="verify-button">
              Go to Homepage
            </a>
          </div>
        );

      case "error":
      default:
        return (
          <div className="verify-content">
            <div className="verify-icon error">
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
            <h1>Verification Failed</h1>
            <p>{errorMessage}</p>
            <a href="/" className="verify-button">
              Go to Homepage
            </a>
          </div>
        );
    }
  };

  return (
    <Layout title="Verify Email" description="Email verification page">
      <main className="verify-container">
        {getContent()}

        <style>{`
          .verify-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 60vh;
            padding: 2rem;
          }

          .verify-content {
            text-align: center;
            max-width: 400px;
          }

          .verify-icon {
            margin-bottom: 1.5rem;
          }

          .verify-spinner {
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

          .verify-content h1 {
            margin-bottom: 0.75rem;
            font-size: 1.75rem;
          }

          .verify-content p {
            color: var(--ifm-font-color-secondary);
            margin-bottom: 1.5rem;
            line-height: 1.6;
          }

          .verify-button {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background-color: var(--ifm-color-primary);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            transition: background-color 0.2s;
          }

          .verify-button:hover {
            background-color: var(--ifm-color-primary-dark);
            color: white;
          }
        `}</style>
      </main>
    </Layout>
  );
}
