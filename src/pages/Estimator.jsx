import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// This pulls the key from your .env file automatically
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export default function GeminiChat() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setLoading(true);
    try {
      const result = await model.generateContent(input);
      setResponse(result.response.text());
    } catch (error) {
      console.error(error);
      setResponse("Error: Could not connect to the AI tool.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <div style={{ border: '1px solid #ddd', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0 }}>Custom AI Workspace</h3>
        
        <form onSubmit={handleSubmit}>
          <textarea 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter your query here..."
            style={{ width: '100%', height: '120px', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '15px', 
              padding: '10px 25px', 
              backgroundColor: loading ? '#ccc' : '#007bff', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Processing...' : 'Execute Tool'}
          </button>
        </form>

        {response && (
          <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', borderLeft: '5px solid #007bff' }}>
            <h4 style={{ marginTop: 0 }}>Output:</h4>
            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{response}</p>
          </div>
        )}
      </div>
    </div>
  );
}