import React, { useState } from "react";
import Navbar from "@theme-original/Navbar";
import type NavbarType from "@theme/Navbar";
import type { WrapperProps } from "@docusaurus/types";
import { useAuth } from "@site/src/components/Auth/AuthProvider";
import { LoginModal } from "@site/src/components/Auth/LoginModal";
import { SignupModal } from "@site/src/components/Auth/SignupModal";
import { ForgotPasswordModal } from "@site/src/components/Auth/ForgotPasswordModal";
import { UserMenu } from "@site/src/components/Auth/UserMenu";

type Props = WrapperProps<typeof NavbarType>;

type ModalState = "none" | "login" | "signup" | "forgot";

export default function NavbarWrapper(props: Props): JSX.Element {
  const { isAuthenticated, isLoading } = useAuth();
  const [modalState, setModalState] = useState<ModalState>("none");

  const openLogin = () => setModalState("login");
  const openSignup = () => setModalState("signup");
  const openForgot = () => setModalState("forgot");
  const closeModal = () => setModalState("none");

  return (
    <>
      <Navbar {...props} />

      {/* Auth buttons overlay positioned in navbar */}
      <div className="navbar-auth-container">
        {isLoading ? (
          <div className="navbar-auth-skeleton" />
        ) : isAuthenticated ? (
          <UserMenu />
        ) : (
          <>
            <button className="navbar-auth-button login" onClick={openLogin}>
              Sign In
            </button>
            <button className="navbar-auth-button signup" onClick={openSignup}>
              Sign Up
            </button>
          </>
        )}
      </div>

      {/* Modals */}
      <LoginModal
        isOpen={modalState === "login"}
        onClose={closeModal}
        onSwitchToSignup={openSignup}
        onForgotPassword={openForgot}
      />
      <SignupModal
        isOpen={modalState === "signup"}
        onClose={closeModal}
        onSwitchToLogin={openLogin}
      />
      <ForgotPasswordModal
        isOpen={modalState === "forgot"}
        onClose={closeModal}
        onBackToLogin={openLogin}
      />

      <style>{`
        .navbar-auth-container {
          position: fixed;
          top: 0;
          right: 500px;
          height: var(--ifm-navbar-height);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          z-index: 400;
          background: var(--ifm-navbar-background-color);
        }

        .navbar-auth-skeleton {
          width: 100px;
          height: 32px;
          background: linear-gradient(
            90deg,
            var(--ifm-color-emphasis-100) 0%,
            var(--ifm-color-emphasis-200) 50%,
            var(--ifm-color-emphasis-100) 100%
          );
          background-size: 200% 100%;
          animation: skeleton-pulse 1.5s infinite;
          border-radius: 6px;
        }

        @keyframes skeleton-pulse {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        .navbar-auth-button {
          padding: 0.4rem 0.875rem;
          font-size: 0.8125rem;
          font-weight: 500;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .navbar-auth-button.login {
          background: transparent;
          color: var(--ifm-font-color-base);
          border: 1px solid var(--ifm-color-emphasis-300);
        }

        .navbar-auth-button.login:hover {
          background-color: var(--ifm-color-emphasis-100);
          border-color: var(--ifm-color-emphasis-400);
        }

        .navbar-auth-button.signup {
          background-color: var(--ifm-color-primary);
          color: white;
        }

        .navbar-auth-button.signup:hover {
          background-color: var(--ifm-color-primary-dark);
        }

        /* Adjust for mobile - account for hamburger menu */
        @media (max-width: 996px) {
          .navbar-auth-container {
            right: 60px;
          }
        }

        @media (max-width: 480px) {
          .navbar-auth-container {
            right: 50px;
          }

          .navbar-auth-button.login {
            display: none;
          }

          .navbar-auth-button.signup {
            padding: 0.35rem 0.625rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </>
  );
}
