import { useState } from "react";
import "./App.css"; // Your styles

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [captions, setCaptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Add error state to display errors

  const generateCaptions = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null); // reset errors before request

    try {
      const res = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        // handle non-200 responses gracefully
        const errData = await res.json();
        throw new Error(errData.error || "Failed to generate captions");
      }

      const data = await res.json();
      setCaptions(data.captions || []);
    } catch (err) {
      console.error("Error connecting to backend:", err);
      setError(err.message || "Something went wrong");
      setCaptions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-100 via-pink-100 to-yellow-100 flex flex-col">
      {/* Header */}
      <header className="bg-white bg-opacity-90 backdrop-blur-sm shadow-md p-6">
        <h1 className="text-4xl font-extrabold text-center text-purple-700 drop-shadow-lg">
          AI Social Caption Generator
        </h1>
        <p className="text-center mt-2 text-purple-500 italic max-w-xl mx-auto">
          Create catchy captions effortlessly with AI
        </p>
      </header>

      {/* Main content */}
      <main className="flex-grow container mx-auto px-6 py-10 max-w-3xl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <label
            htmlFor="prompt"
            className="block mb-3 font-semibold text-gray-700 text-lg"
          >
            Describe your photo or theme
          </label>
          <textarea
            id="prompt"
            rows="5"
            className="w-full border border-gray-300 rounded-lg p-4 text-gray-800 text-lg resize-none focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
            placeholder="E.g. a sunny beach day with friends"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            onClick={generateCaptions}
            disabled={loading || !prompt.trim()}
            className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Generating..." : "Generate Captions"}
          </button>

          {error && (
            <p className="mt-4 text-red-600 font-semibold text-center">
              {error}
            </p>
          )}
        </div>

        {captions.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold mb-5 text-purple-700 text-center">
              Your Captions
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {captions.map((caption, i) => (
                <div
                  key={i}
                  className="bg-purple-100 text-purple-800 px-5 py-3 rounded-full shadow-md cursor-pointer select-none hover:bg-purple-200 transition"
                  onClick={() => navigator.clipboard.writeText(caption)}
                  title="Click to copy"
                >
                  {caption}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className="bg-white bg-opacity-90 backdrop-blur-sm text-center text-purple-600 py-5 mt-12 shadow-inner">
        &copy; 2025 AI Social Caption Generator — Crafted with Tailwind CSS
      </footer>
    </div>
  );
}
