import { useState, useRef } from "react";
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";

const FanNotesForm = ({ onNoteSubmitted }) => {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const recaptchaRef = useRef();

  const resetForm = () => {
    setName("");
    setContent("");
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const recaptchaToken = await recaptchaRef.current.executeAsync();

      // Make the API call to your Netlify function
      const response = await fetch("/.netlify/functions/submit-fan-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, content, recaptchaToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to submit your note");
        return;
      }

      setSuccess("Your note has been submitted for review!");
      resetForm();

      // Optional: Call the callback to refresh note list
      if (onNoteSubmitted && typeof onNoteSubmitted === "function") {
        onNoteSubmitted();
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
      console.error("Error submitting note:", err);
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

        <div className="hidden">
          <ReCAPTCHA ref={recaptchaRef} size="invisible" sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} />
        </div>

        <div className="pt-2">
          <button type="submit" disabled={isSubmitting || !content.trim()} className="w-full bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 py-2 px-4 rounded-md transition-colors hover:bg-neutral-700 dark:hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? "Submitting..." : "Submit Note"}
          </button>
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
