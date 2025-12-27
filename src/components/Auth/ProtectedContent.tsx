import React, { ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import "./AuthModal.css";

interface ProtectedContentProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireVerification?: boolean;
}

export function ProtectedContent({
  children,
  fallback,
  requireVerification = true,
}: ProtectedContentProps): JSX.Element {
  const { isAuthenticated, isEmailVerified, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="protected-content-loading">
        <div className="protected-spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="protected-content-prompt">
        <div className="protected-icon">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect
              x="8"
              y="16"
              width="24"
              height="18"
              rx="3"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M14 16V12C14 8.68629 16.6863 6 20 6C23.3137 6 26 8.68629 26 12V16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="20" cy="25" r="2" fill="currentColor" />
          </svg>
        </div>
        <h3 className="protected-title">Sign in Required</h3>
        <p className="protected-description">
          This content is available to registered members. Please sign in or
          create an account to access it.
        </p>
      </div>
    );
  }

  if (requireVerification && !isEmailVerified) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="protected-content-prompt verification">
        <div className="protected-icon">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect
              x="6"
              y="10"
              width="28"
              height="20"
              rx="2"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M6 14L20 23L34 14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="protected-title">Email Verification Required</h3>
        <p className="protected-description">
          Please verify your email address to access this content. Check your
          inbox for the verification link.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

// Add styles via CSS-in-JS
const styles = `
  .protected-content-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    min-height: 120px;
  }

  .protected-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid var(--ifm-color-emphasis-200);
    border-top-color: var(--ifm-color-primary);
    border-radius: 50%;
    animation: protected-spin 0.8s linear infinite;
  }

  @keyframes protected-spin {
    to {
      transform: rotate(360deg);
    }
  }

  .protected-content-prompt {
    background-color: var(--ifm-color-emphasis-100);
    border: 1px solid var(--ifm-color-emphasis-200);
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    margin: 1rem 0;
  }

  .protected-content-prompt.verification {
    background-color: rgba(var(--ifm-color-warning-rgb), 0.1);
    border-color: rgba(var(--ifm-color-warning-rgb), 0.2);
  }

  .protected-icon {
    color: var(--ifm-color-emphasis-600);
    margin-bottom: 1rem;
  }

  .protected-content-prompt.verification .protected-icon {
    color: var(--ifm-color-warning-dark);
  }

  .protected-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: var(--ifm-heading-color);
  }

  .protected-description {
    color: var(--ifm-font-color-secondary);
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.5;
    max-width: 400px;
    margin: 0 auto;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleId = "protected-content-styles";
  if (!document.getElementById(styleId)) {
    const styleElement = document.createElement("style");
    styleElement.id = styleId;
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
  }
}

export default ProtectedContent;
