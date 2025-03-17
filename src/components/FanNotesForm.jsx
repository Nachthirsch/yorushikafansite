import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
// We'll handle reCAPTCHA manually instead of using the React component

const FanNotesForm = ({ onNoteSubmitted }) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");

  // Check if the reCAPTCHA site key exists
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  // Load reCAPTCHA script manually
  useEffect(() => {
    // If site key doesn't exist, show error
    if (!recaptchaSiteKey) {
      console.error("Missing VITE_RECAPTCHA_SITE_KEY environment variable");
      setError("reCAPTCHA configuration issue. Please contact the site administrator.");
      return;
    }

    // Define callback for when grecaptcha is ready
    window.onRecaptchaLoaded = () => {
      console.log("reCAPTCHA script loaded successfully");
      setRecaptchaLoaded(true);
    };

    // Load the script if it's not already loaded
    if (!document.querySelector("script#google-recaptcha")) {
      const script = document.createElement("script");
      script.id = "google-recaptcha";
      script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}&onload=onRecaptchaLoaded`;
      script.async = true;
      script.defer = true;

      script.onerror = () => {
        console.error("Failed to load reCAPTCHA script");
        setError("Failed to load reCAPTCHA. Please refresh the page or disable ad blockers.");
      };

      document.head.appendChild(script);
    }

    // Clean up
    return () => {
      delete window.onRecaptchaLoaded;
    };
  }, [recaptchaSiteKey]);

  const resetForm = () => {
    setName("");
    setContent("");
    setRecaptchaToken("");
  };

  const executeRecaptcha = async () => {
    if (!window.grecaptcha || !recaptchaLoaded) {
      throw new Error("reCAPTCHA not loaded");
    }

    console.log("Executing reCAPTCHA verification...");
    try {
      const token = await window.grecaptcha.execute(recaptchaSiteKey, { action: "submit_fan_note" });
      console.log("reCAPTCHA token obtained:", !!token);
      return token;
    } catch (error) {
      console.error("Error executing reCAPTCHA:", error);
      throw new Error("Failed to verify you are human. Please refresh and try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Execute reCAPTCHA verification
      const token = await executeRecaptcha();

      // Make the API call to your Netlify function
      const response = await fetch("/.netlify/functions/submit-fan-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, content, recaptchaToken: token }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to submit your note");
        return;
      }

      setSuccess("Your note has been submitted!");
      resetForm();

      // Optional: Call the callback to refresh note list
      if (onNoteSubmitted && typeof onNoteSubmitted === "function") {
        onNoteSubmitted();
      }
    } catch (err) {
      console.error("Error submitting note:", err);

      if (err.message.includes("reCAPTCHA")) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 border border-neutral-200 dark:border-neutral-700">
      <h3 className="text-xl font-light mb-4 text-neutral-800 dark:text-neutral-200">Leave a Note for Other Fans</h3>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">{error}</div>}

      {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-600 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Your Name
          </label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200" placeholder="Your name (optional)" maxLength={50} />
        </div>

        <div>
          <label htmlFor="content" className="block mb-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Your Message
          </label>
          <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200" placeholder="Share your thoughts or message with other fans..." rows={4} required maxLength={500} />
          <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 flex justify-between">
            <span>Max 500 characters</span>
            <span>{content.length}/500</span>
          </div>
        </div>

        {/* reCAPTCHA badge notice */}
        <div className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
          This site is protected by reCAPTCHA and the Google
          <a href="https://policies.google.com/privacy" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
            {" "}
            Privacy Policy
          </a>{" "}
          and
          <a href="https://policies.google.com/terms" className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
            {" "}
            Terms of Service
          </a>{" "}
          apply.
        </div>

        <div className="pt-2">
          <button type="submit" disabled={isSubmitting || !content.trim() || !recaptchaLoaded} className="w-full bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 py-2 px-4 rounded-md transition-colors hover:bg-neutral-700 dark:hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? "Submitting..." : "Submit Note"}
          </button>

          {!recaptchaLoaded && (
            <div className="mt-2 flex justify-center items-center">
              <div className="animate-pulse flex space-x-1">
                <div className="h-1.5 w-1.5 bg-amber-400 dark:bg-amber-500 rounded-full"></div>
                <div className="h-1.5 w-1.5 bg-amber-400 dark:bg-amber-500 rounded-full"></div>
                <div className="h-1.5 w-1.5 bg-amber-400 dark:bg-amber-500 rounded-full"></div>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 ml-2">Loading reCAPTCHA verification...</p>
            </div>
          )}
        </div>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-2">
          Your note will be reviewed before it appears on the site.
          <br />
          Please be respectful and follow community guidelines.
        </p>
      </form>
    </motion.div>
  );
};

export default FanNotesForm;
