"use client";
import React, { useState } from "react";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !subject || !message) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, subject, message }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        setSubmitSuccess(false);
      }
    } catch (error) {
      setSubmitSuccess(false);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-teal-50">
      <section className="relative flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        {/* Decorative Background Elements */}
        <div className="absolute z-20 top-0 left-0 w-1/4 h-1/4 bg-gradient-to-r from-teal-400 to-teal-600 rounded-full blur-2xl opacity-20 "></div>
        <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-gradient-to-r from-orange-300 to-yellow-500 rounded-full blur-3xl opacity-20 z-20"></div>

        <div className="w-full max-w-lg bg-white p-10 rounded-lg shadow-xl border border-zinc-300 relative z-20">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
            Contact Us
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Have questions? We’d love to hear from you. Please send us a message
            below.
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-2 block w-full p-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="mt-2 block w-full p-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                placeholder="Subject"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="mt-2 block w-full p-3 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                placeholder="Write your message..."
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            <button
              type="submit"
              className={`w-full py-3 text-white font-semibold rounded-lg shadow-lg ${
                isSubmitting
                  ? "bg-teal-400 cursor-not-allowed"
                  : "bg-teal-500 hover:bg-teal-600 transition duration-300"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
            {submitSuccess === true && (
              <p className="text-green-600 text-center mt-4">
                Message sent successfully!
              </p>
            )}
            {submitSuccess === false && (
              <p className="text-red-600 text-center mt-4">
                Failed to send message. Please try again.
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
