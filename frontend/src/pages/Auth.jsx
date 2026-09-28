import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Phone,
  ArrowRight,
  UserPlus,
  LogIn,
} from "lucide-react";
import Logo from "../components/Logo";
import { signup, login } from "../services/auth";

export default function Auth() {

  const navigate=useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [method, setMethod] = useState("email");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (isSignup) {
      await signup(email, password);
      console.log("Account created successfully");
      showToast("Account created successfully!", "success");
      navigate("/dashboard")
    } else {
      await login(email, password);
      console.log("Login successful");
      showToast("Login successful!", "success")
      navigate("/dashboard")
    }
  } catch (error) {
    console.error(error.message);
    if (error.code === "auth/email-already-in-use") {
      showToast("This email is already registered.", "error");
    } else if (error.code === "auth/invalid-credential") {
      showToast("Incorrect email or password.", "error");
    } else if (error.code === "auth/weak-password") {
      showToast("Password must be at least 6 characters.", "error");
    } else if (error.code === "auth/invalid-email") {
      showToast("Please enter a valid email address.", "error");
    } else {
      showToast("Something went wrong. Please try again.", "error");
    }
   }
};

  return (
    <div className="min-h-screen bg-canvas dark:bg-canvas-dark">

        {toast && (
           <motion.div
          initial={{ opacity: 0, x: 50, y: -10 }}
    animate={{ opacity: 1, x: 0, y: 0 }}
    exit={{ opacity: 0, x: 50 }}
    className={`fixed right-5 top-5 z-50 flex items-center gap-3 rounded-2xl border px-5 py-4 shadow-lg backdrop-blur-md ${
      toast.type === "success"
        ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/80 dark:text-green-300"
        : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-950/80 dark:text-red-300"
    }`}
  >
    <div className="text-sm font-medium">
      {toast.message}
    </div>
  </motion.div>
)}

      <header className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
        <Link to="/">
          <Logo />
        </Link>
      </header>

      <main className="flex items-center justify-center px-5 py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="card p-7 sm:p-8">

            {/* Heading */}
            <div className="mb-7 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-forest-50 dark:bg-white/5 text-forest-600 dark:text-forest-300">
                {isSignup ? <UserPlus size={21} /> : <LogIn size={21} />}
              </div>

              <h1 className="mt-4 text-2xl font-semibold text-ink dark:text-ink-dark">
                {isSignup ? "Create your account" : "Welcome back"}
              </h1>

              <p className="mt-2 text-sm text-muted dark:text-muted-dark">
                {isSignup
                  ? "Create your Photonyx account to get started."
                  : "Login to continue to Photonyx."}
              </p>
            </div>

            {/* Login method */}
            <div className="mb-6 grid grid-cols-2 rounded-xl bg-black/5 dark:bg-white/5 p-1">
              <button
                onClick={() => setMethod("email")}
                className={`rounded-lg py-2.5 text-sm font-medium transition ${
                  method === "email"
                    ? "bg-white dark:bg-white/10 text-forest-600 dark:text-forest-300 shadow-sm"
                    : "text-muted dark:text-muted-dark"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Mail size={16} />
                  Email
                </span>
              </button>

              <button
                onClick={() => setMethod("phone")}
                className={`rounded-lg py-2.5 text-sm font-medium transition ${
                  method === "phone"
                    ? "bg-white dark:bg-white/10 text-forest-600 dark:text-forest-300 shadow-sm"
                    : "text-muted dark:text-muted-dark"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Phone size={16} />
                  Phone
                </span>
              </button>
            </div>

            {/* Name - Signup only */}
            {isSignup && (
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-ink dark:text-ink-dark">
                  Name
                </label>

                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-4 py-3 text-sm outline-none focus:border-forest-500"
                />
              </div>
            )}

            {/* Email Login */}
            {method === "email" && (
              <>
                <div className="mb-4">
                  <label className="mb-1.5 block text-sm font-medium text-ink dark:text-ink-dark">
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    />

                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent py-3 pl-11 pr-4 text-sm outline-none focus:border-forest-500"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="mb-1.5 block text-sm font-medium text-ink dark:text-ink-dark">
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                    />

                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent py-3 pl-11 pr-4 text-sm outline-none focus:border-forest-500"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Phone Login */}
            {method === "phone" && (
              <div className="mb-6">
                <label className="mb-1.5 block text-sm font-medium text-ink dark:text-ink-dark">
                  Phone Number
                </label>

                <div className="relative">
                  <Phone
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                  />

                  <input
                    type="tel"
                    placeholder="+91 9876543210"
                    className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent py-3 pl-11 pr-4 text-sm outline-none focus:border-forest-500"
                  />
                </div>

                <p className="mt-2 text-xs text-muted dark:text-muted-dark">
                  We'll send you a verification code.
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest-600 px-5 py-3 text-sm font-medium text-white hover:bg-forest-700"
            >
              {method === "phone"
                ? "Send OTP"
                : isSignup
                ? "Create Account"
                : "Login"}

              <ArrowRight size={16} />
            </button>

            {/* Switch Login / Signup */}
            <p className="mt-6 text-center text-sm text-muted dark:text-muted-dark">
              {isSignup
                ? "Already have an account?"
                : "Don't have an account?"}

              <button
                onClick={() => setIsSignup(!isSignup)}
                className="ml-1 font-medium text-forest-600 dark:text-forest-300 hover:underline"
              >
                {isSignup ? "Login" : "Sign Up"}
              </button>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}