"use client";

// This component will render for *any* uncaught error
// inside the /interview route segment.
export default function InterviewError({ error, reset }) {
  // Log the error so you can inspect stack/message
  console.error("Error in Interview route:", error);

  return (
    <div className="max-w-xl mx-auto p-8 bg-red-50 text-red-800 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-2">Unable to Load Quiz</h2>
      <p className="mb-4">{error.message}</p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  );
}
