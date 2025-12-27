import React from "react";
import "./AuthModal.css";

interface PasswordStrengthProps {
  password: string;
}

type StrengthLevel = "weak" | "fair" | "good" | "strong";

function getPasswordStrength(password: string): {
  level: StrengthLevel;
  text: string;
} {
  if (!password) {
    return { level: "weak", text: "" };
  }

  let score = 0;

  // Length checks
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  // Determine strength level
  if (score <= 2) {
    return { level: "weak", text: "Weak - add more characters" };
  } else if (score <= 4) {
    return { level: "fair", text: "Fair - try adding numbers or symbols" };
  } else if (score <= 6) {
    return { level: "good", text: "Good - password is reasonably strong" };
  } else {
    return { level: "strong", text: "Strong - excellent password!" };
  }
}

export function PasswordStrength({
  password,
}: PasswordStrengthProps): JSX.Element | null {
  if (!password) {
    return null;
  }

  const { level, text } = getPasswordStrength(password);

  return (
    <div className="password-strength">
      <div className="password-strength-bar">
        <div className={`password-strength-fill ${level}`} />
      </div>
      <p className="password-strength-text">{text}</p>
    </div>
  );
}

export default PasswordStrength;
