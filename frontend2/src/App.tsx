import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [submitted, setSubmitted] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(username);
  };

  return (
    // Base container: Removed centering classes to align content to the left
    // Added padding (p-10) for overall spacing from the edges
    <div className="min-h-screen bg-gray-900 text-white p-10">
      
      {/* Title with increased size and spacing */}
      <h1 className="text-5xl font-extrabold mb-2">
        Your Frontend is ready **#Fakina**
      </h1>

      {/* Subtitle with proper spacing */}
      <p className="text-gray-400 text-lg mb-8">
        Now dont ask for anything else
      </p>

      {/* Form container */}
      <form onSubmit={handleSubmit}>
        
        {/* Label and Input/Button Group for proper spacing */}
        <div className="mb-4">
            <label className="text-gray-200 font-medium mr-4">
              Enter Username
            </label>
        </div>

        {/* This div uses flex to place the input and button horizontally with space */}
        <div className="flex items-center gap-4"> 
            <input
              type="text"
              // Adjust input styling
              className="p-2 rounded-md bg-gray-700 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Type your name..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <button
              type="submit"
              // Adjust button styling
              className="bg-black hover:bg-gray-800 transition text-white px-4 py-2 rounded-md font-semibold border border-white"
            >
              Submit
            </button>
        </div>
      </form>

      {submitted && (
        <p className="mt-8 text-lg">
          Welcome, <span className="font-semibold text-blue-400">{submitted}</span>!
        </p>
      )}
    </div>
  );
}

export default App;