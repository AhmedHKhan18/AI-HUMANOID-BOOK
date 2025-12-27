import React, { useState } from "react";
import Layout from "@theme/Layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@site/src/components/Auth/AuthProvider";
import { authClient, signOut } from "@site/src/lib/auth-client";
import { PasswordStrength } from "@site/src/components/Auth/PasswordStrength";

const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers"),
  name: z.string().max(100, "Name must be at most 100 characters").optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be at most 128 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function ProfilePage(): JSX.Element {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [profileMessage, setProfileMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      name: user?.name || "",
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = passwordForm.watch("newPassword");

  const handleProfileUpdate = async (data: ProfileFormData) => {
    setProfileMessage(null);
    setIsUpdatingProfile(true);

    try {
      const result = await authClient.updateUser({
        username: data.username,
        name: data.name || undefined,
      });

      if (result.error) {
        setProfileMessage({
          type: "error",
          text: result.error.message || "Failed to update profile",
        });
      } else {
        setProfileMessage({
          type: "success",
          text: "Profile updated successfully!",
        });
      }
    } catch (err) {
      setProfileMessage({
        type: "error",
        text: "An unexpected error occurred",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordChange = async (data: PasswordFormData) => {
    setPasswordMessage(null);
    setIsUpdatingPassword(true);

    try {
      const result = await authClient.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (result.error) {
        setPasswordMessage({
          type: "error",
          text:
            result.error.code === "INVALID_PASSWORD"
              ? "Current password is incorrect"
              : result.error.message || "Failed to change password",
        });
      } else {
        setPasswordMessage({
          type: "success",
          text: "Password changed successfully!",
        });
        passwordForm.reset();
      }
    } catch (err) {
      setPasswordMessage({
        type: "error",
        text: "An unexpected error occurred",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setDeleteError("Please enter your password");
      return;
    }

    setDeleteError(null);
    setIsDeleting(true);

    try {
      const result = await authClient.deleteUser({
        password: deletePassword,
      });

      if (result.error) {
        setDeleteError(
          result.error.code === "INVALID_PASSWORD"
            ? "Incorrect password"
            : result.error.message || "Failed to delete account"
        );
      } else {
        await signOut();
        window.location.href = "/";
      }
    } catch (err) {
      setDeleteError("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout title="Profile" description="User profile page">
        <main className="profile-container">
          <div className="profile-loading">
            <div className="profile-spinner" />
          </div>
        </main>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout title="Profile" description="User profile page">
        <main className="profile-container">
          <div className="profile-card">
            <h1>Sign In Required</h1>
            <p>Please sign in to view your profile.</p>
            <a href="/" className="profile-button">
              Go to Homepage
            </a>
          </div>
        </main>
      </Layout>
    );
  }

  return (
    <Layout title="Profile" description="User profile page">
      <main className="profile-container">
        <div className="profile-header">
          <h1>Profile Settings</h1>
          <p>Manage your account settings and preferences</p>
        </div>

        <div className="profile-grid">
          {/* Profile Information */}
          <div className="profile-card">
            <h2>Profile Information</h2>

            {profileMessage && (
              <div className={`profile-alert ${profileMessage.type}`}>
                {profileMessage.text}
              </div>
            )}

            <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className="form-input disabled"
                  value={user?.email || ""}
                  disabled
                />
                <span className="form-hint">
                  Email cannot be changed{" "}
                  {!user?.emailVerified && "(Unverified)"}
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  className={`form-input ${profileForm.formState.errors.username ? "error" : ""}`}
                  {...profileForm.register("username")}
                />
                {profileForm.formState.errors.username && (
                  <span className="form-error">
                    {profileForm.formState.errors.username.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="name">Display Name</label>
                <input
                  id="name"
                  type="text"
                  className={`form-input ${profileForm.formState.errors.name ? "error" : ""}`}
                  placeholder="Optional"
                  {...profileForm.register("name")}
                />
                {profileForm.formState.errors.name && (
                  <span className="form-error">
                    {profileForm.formState.errors.name.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="profile-button"
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="profile-card">
            <h2>Change Password</h2>

            {passwordMessage && (
              <div className={`profile-alert ${passwordMessage.type}`}>
                {passwordMessage.text}
              </div>
            )}

            <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)}>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  id="currentPassword"
                  type="password"
                  className={`form-input ${passwordForm.formState.errors.currentPassword ? "error" : ""}`}
                  {...passwordForm.register("currentPassword")}
                />
                {passwordForm.formState.errors.currentPassword && (
                  <span className="form-error">
                    {passwordForm.formState.errors.currentPassword.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  className={`form-input ${passwordForm.formState.errors.newPassword ? "error" : ""}`}
                  {...passwordForm.register("newPassword")}
                />
                {passwordForm.formState.errors.newPassword && (
                  <span className="form-error">
                    {passwordForm.formState.errors.newPassword.message}
                  </span>
                )}
                <PasswordStrength password={newPassword || ""} />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={`form-input ${passwordForm.formState.errors.confirmPassword ? "error" : ""}`}
                  {...passwordForm.register("confirmPassword")}
                />
                {passwordForm.formState.errors.confirmPassword && (
                  <span className="form-error">
                    {passwordForm.formState.errors.confirmPassword.message}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="profile-button"
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="profile-card danger">
            <h2>Danger Zone</h2>
            <p className="danger-description">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>

            {!showDeleteConfirm ? (
              <button
                className="profile-button danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </button>
            ) : (
              <div className="delete-confirm">
                <p>Enter your password to confirm deletion:</p>

                {deleteError && (
                  <div className="profile-alert error">{deleteError}</div>
                )}

                <input
                  type="password"
                  className="form-input"
                  placeholder="Your password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                />

                <div className="delete-actions">
                  <button
                    className="profile-button secondary"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeletePassword("");
                      setDeleteError(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="profile-button danger"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Confirm Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <style>{`
          .profile-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
          }

          .profile-loading {
            display: flex;
            justify-content: center;
            padding: 4rem;
          }

          .profile-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--ifm-color-emphasis-200);
            border-top-color: var(--ifm-color-primary);
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          .profile-header {
            margin-bottom: 2rem;
          }

          .profile-header h1 {
            margin-bottom: 0.5rem;
          }

          .profile-header p {
            color: var(--ifm-font-color-secondary);
            margin: 0;
          }

          .profile-grid {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          .profile-card {
            background-color: var(--ifm-background-surface-color);
            border: 1px solid var(--ifm-color-emphasis-200);
            border-radius: 8px;
            padding: 1.5rem;
          }

          .profile-card h2 {
            font-size: 1.25rem;
            margin: 0 0 1rem 0;
          }

          .profile-card.danger {
            border-color: var(--ifm-color-danger);
          }

          .profile-card.danger h2 {
            color: var(--ifm-color-danger);
          }

          .danger-description {
            color: var(--ifm-font-color-secondary);
            margin-bottom: 1rem;
            font-size: 0.875rem;
          }

          .profile-alert {
            padding: 0.75rem 1rem;
            border-radius: 6px;
            font-size: 0.875rem;
            margin-bottom: 1rem;
          }

          .profile-alert.success {
            background-color: rgba(var(--ifm-color-success-rgb), 0.1);
            color: var(--ifm-color-success);
            border: 1px solid rgba(var(--ifm-color-success-rgb), 0.2);
          }

          .profile-alert.error {
            background-color: rgba(var(--ifm-color-danger-rgb), 0.1);
            color: var(--ifm-color-danger);
            border: 1px solid rgba(var(--ifm-color-danger-rgb), 0.2);
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
            background-color: var(--ifm-background-color);
            color: var(--ifm-font-color-base);
            transition: border-color 0.2s, box-shadow 0.2s;
          }

          .form-input:focus {
            outline: none;
            border-color: var(--ifm-color-primary);
            box-shadow: 0 0 0 3px rgba(var(--ifm-color-primary-rgb), 0.1);
          }

          .form-input.disabled {
            background-color: var(--ifm-color-emphasis-100);
            cursor: not-allowed;
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

          .form-hint {
            display: block;
            font-size: 0.75rem;
            color: var(--ifm-font-color-secondary);
            margin-top: 0.25rem;
          }

          .profile-button {
            padding: 0.75rem 1.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
            background-color: var(--ifm-color-primary);
            color: white;
          }

          .profile-button:hover:not(:disabled) {
            background-color: var(--ifm-color-primary-dark);
          }

          .profile-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .profile-button.secondary {
            background-color: var(--ifm-color-emphasis-200);
            color: var(--ifm-font-color-base);
          }

          .profile-button.secondary:hover:not(:disabled) {
            background-color: var(--ifm-color-emphasis-300);
          }

          .profile-button.danger {
            background-color: var(--ifm-color-danger);
          }

          .profile-button.danger:hover:not(:disabled) {
            background-color: var(--ifm-color-danger-dark);
          }

          .delete-confirm {
            margin-top: 1rem;
          }

          .delete-confirm p {
            margin-bottom: 0.75rem;
            font-size: 0.875rem;
          }

          .delete-confirm .form-input {
            margin-bottom: 1rem;
          }

          .delete-actions {
            display: flex;
            gap: 0.75rem;
          }
        `}</style>
      </main>
    </Layout>
  );
}
