import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signupUser } from "../services/authService";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  password: "",
};

function Signup() {
  const { currentUser, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthLoading && currentUser) {
    return <Navigate to="/home" replace />;
  }

  const validate = () => {
    if (!formData.email.trim() || !formData.password.trim()) {
      return "Email and password are required.";
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      return "Please enter a valid email address.";
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    return "";
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await signupUser({
        email: formData.email.trim(),
        password: formData.password,
        name: formData.name,
      });
      setSuccess("Account created successfully. Redirecting to login...");
      setFormData(initialForm);
      setTimeout(() => navigate("/"), 1200);
    } catch (firebaseError) {
      setError(firebaseError.message.replace("Firebase: ", "").replace(/\(auth\/.*\)\.?/g, "").trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-layout">
      <section className="auth-card">
        <h1>Create Account</h1>
        <p className="auth-subtitle">Join VENTURES and start discovering curated products.</p>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="name">Name (optional)</label>
          <input id="name" name="name" type="text" placeholder="Your name" value={formData.name} onChange={handleChange} />

          <label htmlFor="phone">Phone Number (optional)</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+880 1XXXXXXXXX"
            value={formData.phone}
            onChange={handleChange}
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Minimum 6 characters"
            value={formData.password}
            onChange={handleChange}
          />

          {error && <p className="feedback error">{error}</p>}
          {success && <p className="feedback success">{success}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Signup"}
          </button>
        </form>

        <p className="switch-link">
          Already have an account? <Link to="/">Back to Login</Link>
        </p>
      </section>
    </main>
  );
}

export default Signup;
