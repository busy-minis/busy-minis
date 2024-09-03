"use client";
import React, { useState } from "react";

export default function SpecialDriverFormLinkGenerator() {
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);

  const handleGenerateLink = () => {
    // Simulate link generation
    const newLink = `https://yourdomain.com/driver-form/${Date.now()}`;
    setGeneratedLink(newLink);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
        Generate Special Driver Form Link
      </h1>

      <p className="text-lg text-gray-700 mb-8 text-center max-w-lg">
        Click the button below to generate a unique link for the special driver
        form. This link can be shared with drivers to access the form.
      </p>

      {!generatedLink ? (
        <button
          onClick={handleGenerateLink}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md"
        >
          Generate Link
        </button>
      ) : (
        <>
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-700 mb-4">Generated Link:</p>
            <a
              href={generatedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 underline break-all"
            >
              {generatedLink}
            </a>
            <div className="mt-4">
              <button
                onClick={() => navigator.clipboard.writeText(generatedLink)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-200 shadow-md"
              >
                Copy Link
              </button>
            </div>
          </div>

          <button
            onClick={handleGenerateLink}
            className="mt-8 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md"
          >
            Generate New Link
          </button>
        </>
      )}
    </div>
  );
}
