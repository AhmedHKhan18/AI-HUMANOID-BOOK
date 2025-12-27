import React, { useState, useRef, useEffect } from "react";
import { signOut } from "@site/src/lib/auth-client";
import { useAuth } from "./AuthProvider";
import "./AuthModal.css";

export function UserMenu(): JSX.Element | null {
  const { user, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading || !user) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const displayName = user.username || user.name || user.email.split("@")[0];
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="user-menu-container" ref={menuRef}>
      <button
        className="user-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {user.image ? (
          <img
            src={user.image}
            alt={displayName}
            className="user-menu-avatar"
          />
        ) : (
          <span className="user-menu-avatar-placeholder">{initial}</span>
        )}
        <span className="user-menu-name">{displayName}</span>
        <svg
          className={`user-menu-chevron ${isOpen ? "open" : ""}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="user-menu-dropdown">
          <div className="user-menu-header">
            <span className="user-menu-email">{user.email}</span>
            {!user.emailVerified && (
              <span className="user-menu-unverified">Unverified</span>
            )}
          </div>
          <div className="user-menu-divider" />
          <a href="/profile" className="user-menu-item">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M13 14C13 11.2386 10.7614 9 8 9C5.23858 9 3 11.2386 3 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Profile
          </a>
          <div className="user-menu-divider" />
          <button className="user-menu-item logout" onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 14H3.5C3.10218 14 2.72064 13.842 2.43934 13.5607C2.15804 13.2794 2 12.8978 2 12.5V3.5C2 3.10218 2.15804 2.72064 2.43934 2.43934C2.72064 2.15804 3.10218 2 3.5 2H6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M11 11L14 8L11 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 8H6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Sign Out
          </button>
        </div>
      )}

      <style>{`
        .user-menu-container {
          position: relative;
        }

        .user-menu-trigger {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.375rem 0.75rem;
          background: transparent;
          border: 1px solid var(--ifm-color-emphasis-300);
          border-radius: 9999px;
          cursor: pointer;
          color: var(--ifm-font-color-base);
          font-size: 0.875rem;
          transition: border-color 0.2s, background-color 0.2s;
        }

        .user-menu-trigger:hover {
          background-color: var(--ifm-color-emphasis-100);
          border-color: var(--ifm-color-emphasis-400);
        }

        .user-menu-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-menu-avatar-placeholder {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: var(--ifm-color-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .user-menu-name {
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .user-menu-chevron {
          transition: transform 0.2s;
        }

        .user-menu-chevron.open {
          transform: rotate(180deg);
        }

        .user-menu-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          right: 0;
          min-width: 200px;
          background-color: var(--ifm-background-color);
          border: 1px solid var(--ifm-color-emphasis-200);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 100;
          animation: dropdownSlideIn 0.15s ease-out;
        }

        @keyframes dropdownSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .user-menu-header {
          padding: 0.75rem 1rem;
          font-size: 0.75rem;
          color: var(--ifm-font-color-secondary);
        }

        .user-menu-email {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .user-menu-unverified {
          display: inline-block;
          margin-top: 0.25rem;
          padding: 0.125rem 0.375rem;
          font-size: 0.625rem;
          font-weight: 500;
          color: var(--ifm-color-warning-dark);
          background-color: rgba(var(--ifm-color-warning-rgb), 0.1);
          border-radius: 4px;
        }

        .user-menu-divider {
          height: 1px;
          background-color: var(--ifm-color-emphasis-200);
        }

        .user-menu-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 1rem;
          font-size: 0.875rem;
          color: var(--ifm-font-color-base);
          text-decoration: none;
          cursor: pointer;
          transition: background-color 0.15s;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
        }

        .user-menu-item:hover {
          background-color: var(--ifm-color-emphasis-100);
        }

        .user-menu-item.logout {
          color: var(--ifm-color-danger);
        }

        [data-theme="dark"] .user-menu-dropdown {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        @media (max-width: 480px) {
          .user-menu-name {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default UserMenu;
