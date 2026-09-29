import { useRef, useState } from "react";
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
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";
import { saveUserProfile } from "../services/firestone";

const parseCrops = (value) => value.split(",").map((crop) => crop.trim()).filter(Boolean);

export default function Auth() {

  const navigate=useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [method, setMethod] = useState("email");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const recaptchaVerifier = useRef(null);

  const [toast, setToast] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [farmName, setFarmName] = useState("");
  const [farmLocation, setFarmLocation] = useState("");
  const [farmSize, setFarmSize] = useState("");
  const [crops, setCrops] = useState("");

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const sendPhoneOtp = async () => {
    const normalizedPhone = phoneNumber.replace(/\s/g, "");
    if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone)) {
      showToast("Enter a valid phone number with country code, e.g. +919876543210.", "error");
      return;
    }

    try {
      if (!recaptchaVerifier.current) {
        recaptchaVerifier.current = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
        });
      }

      const result = await signInWithPhoneNumber(
        auth,
        normalizedPhone,
        recaptchaVerifier.current,
      );
      setConfirmationResult(result);
      showToast("OTP sent. Check your phone.", "success");
    } catch (error) {
      recaptchaVerifier.current?.clear();
      recaptchaVerifier.current = null;
      showToast(error.message || "Could not send the OTP. Please try again.", "error");
    }
  };

  const verifyPhoneOtp = async () => {
    if (!otp.trim()) {
      showToast("Enter the OTP you received.", "error");
      return;
    }

    try {
      const credential = await confirmationResult.confirm(otp.trim());
      if (isSignup) {
        await saveUserProfile(credential.user.uid, {
          personal: { name: name.trim(), phone: credential.user.phoneNumber || phoneNumber, address: address.trim() },
          farm: { farmName: farmName.trim(), location: farmLocation.trim(), size: farmSize.trim(), crops: parseCrops(crops) },
          createdAt: new Date().toISOString(),
        });
      }
      navigate("/dashboard");
    } catch (error) {
      showToast(error.code === "auth/invalid-verification-code"
        ? "That OTP is incorrect. Check it and try again."
        : error.message || "Could not verify the OTP.", "error");
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (method === "phone") {
    if (confirmationResult) await verifyPhoneOtp();
    else await sendPhoneOtp();
    return;
  }

  try {
    if (isSignup) {
      await signup(email, password);
      // Email signup signs out before verification; keep the details until verified login.
      localStorage.setItem("photonyx_pending_profile", JSON.stringify({
        personal: { name: name.trim(), phone: phone.trim(), address: address.trim(), email: email.trim() },
        farm: { farmName: farmName.trim(), location: farmLocation.trim(), size: farmSize.trim(), crops: parseCrops(crops) },
        createdAt: new Date().toISOString(),
      }));
      setIsSignup(false);
      showToast("Verification email sent. Verify it, then log in. Check spam folder if not found.", "success");
    } else {
      const userCredential = await login(email, password);
      const pendingProfile = localStorage.getItem("photonyx_pending_profile");
      if (pendingProfile) {
        await saveUserProfile(userCredential.user.uid, JSON.parse(pendingProfile));
        localStorage.removeItem("photonyx_pending_profile");
      }
      console.log("Login successful");
      showToast("Login successful!", "success")
      navigate("/dashboard")
    }
  } catch (error) {
    console.error(error.message);
    if (error.code === "auth/email-already-in-use") {
      showToast("This email is already registered.", "error");
    } else if (error.code === "auth/email-not-verified") {
      showToast("Verification link sent again. Verify your email, then log in.", "error");
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
                onClick={() => {
                  recaptchaVerifier.current?.clear();
                  recaptchaVerifier.current = null;
                  setMethod("email");
                  setConfirmationResult(null);
                }}
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
                onClick={() => {
                  recaptchaVerifier.current?.clear();
                  recaptchaVerifier.current = null;
                  setMethod("phone");
                  setConfirmationResult(null);
                }}
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
              <div className="mb-4 space-y-3">
                <label className="mb-1.5 block text-sm font-medium text-ink dark:text-ink-dark">
                  Name
                </label>

                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm"
                />
                <input type="tel" placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm" />
                <input type="text" placeholder="Home address / village" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm" />
                <p className="pt-2 text-sm font-semibold text-ink dark:text-ink-dark">Farm details</p>
                <input type="text" placeholder="Farm name" value={farmName} onChange={(e) => setFarmName(e.target.value)} className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm" />
                <input type="text" placeholder="Farm location / village" value={farmLocation} onChange={(e) => setFarmLocation(e.target.value)} className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm" />
                <input type="text" placeholder="Farm size (e.g. 2 acres)" value={farmSize} onChange={(e) => setFarmSize(e.target.value)} className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm" />
                <input type="text" placeholder="Crops, comma separated (e.g. wheat, rice)" value={crops} onChange={(e) => setCrops(e.target.value)} className="w-full rounded-xl border border-black/10 bg-transparent px-4 py-3 text-sm" />
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
            {method === "phone" && !confirmationResult && (
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
                    placeholder="+919876543210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent py-3 pl-11 pr-4 text-sm outline-none focus:border-forest-500"
                  />
                </div>

                <p className="mt-2 text-xs text-muted dark:text-muted-dark">
                  We'll send you a verification code.
                </p>
              </div>
            )}

            {method === "phone" && confirmationResult && (
              <div className="mb-6">
                <label className="mb-1.5 block text-sm font-medium text-ink dark:text-ink-dark">
                  Verification code
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Enter the OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-transparent px-4 py-3 text-sm outline-none focus:border-forest-500"
                />
              </div>
            )}

            {method === "phone" && <div id="recaptcha-container" />}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest-600 px-5 py-3 text-sm font-medium text-white hover:bg-forest-700"
            >
              {method === "phone"
                ? confirmationResult ? "Verify & Continue" : "Send OTP"
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
