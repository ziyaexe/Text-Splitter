import { useState, useCallback } from 'react';
import { Copy, FileText, Split, Code, Eraser } from 'lucide-react';

// Main App component
export default function App() {
  const [code, setCode] = useState('');
  const [chunkSize, setChunkSize] = useState(2000);
  const [splitMethod, setSplitMethod] = useState('characters');
  const [customDelimiter, setCustomDelimiter] = useState('---');
  const [chunks, setChunks] = useState([]);
  const [showNotification, setShowNotification] = useState(false);

  // Function to copy text to clipboard
  const copyToClipboard = useCallback((text) => {
    try {
      // Create a temporary textarea to hold the text
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      // Show a temporary notification
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, []);

  // Function to split the code based on selected method
  const handleSplit = useCallback(() => {
    if (!code) {
      setChunks([]);
      return;
    }

    const newChunks = [];
    if (splitMethod === 'characters') {
      for (let i = 0; i < code.length; i += chunkSize) {
        newChunks.push(code.substring(i, i + chunkSize));
      }
    } else if (splitMethod === 'lines') {
      const lines = code.split('\n');
      let currentChunk = '';
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (currentChunk.split('\n').length < chunkSize) {
          currentChunk += (currentChunk ? '\n' : '') + line;
        } else {
          newChunks.push(currentChunk);
          currentChunk = line;
        }
      }
      if (currentChunk) {
        newChunks.push(currentChunk);
      }
    } else if (splitMethod === 'delimiter' && customDelimiter) {
      const parts = code.split(customDelimiter);
      let currentChunk = '';
      for (const part of parts) {
        // Prevent adding empty strings from trailing delimiters
        if (!part.trim()) continue;

        if (currentChunk.length + part.length + customDelimiter.length <= chunkSize) {
          currentChunk += part + customDelimiter;
        } else {
          newChunks.push(currentChunk);
          currentChunk = part + customDelimiter;
        }
      }
      if (currentChunk) {
        newChunks.push(currentChunk);
      }
    }
    setChunks(newChunks);
  }, [code, chunkSize, splitMethod, customDelimiter]);

  // Function to clear all input and output
  const handleClear = useCallback(() => {
    setCode('');
    setChunks([]);
    setChunkSize(2000);
    setSplitMethod('characters');
    setCustomDelimiter('---');
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-8 font-sans flex flex-col items-center">
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-white mb-6 animate-pulse">
        Code Splitter Tool
      </h1>
      
      {/* Main container with rounded corners and shadow */}
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-4xl space-y-6">

        {/* Input area for the code */}
        <div className="flex flex-col">
          <label htmlFor="code-input" className="text-gray-400 mb-2 flex items-center justify-between">
            <span className="flex items-center">
              <Code className="mr-2" size={16} /> Paste Your Code Here
            </span>
            <span className="text-sm text-gray-500">
              {code.length} characters
            </span>
          </label>
          <textarea
            id="code-input"
            className="w-full h-80 bg-gray-900 text-gray-300 p-4 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-all duration-300 resize-y"
            placeholder="e.g., Paste your JavaScript, Python, or HTML code..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
          ></textarea>
        </div>

        {/* Controls section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          
          {/* Chunk size input */}
          <div className="flex-1">
            <label htmlFor="chunk-size" className="text-gray-400 mb-2 block">Max Chunk Size</label>
            <input
              id="chunk-size"
              type="number"
              min="1"
              className="w-full bg-gray-900 text-gray-300 p-2 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-all duration-300"
              value={chunkSize}
              onChange={(e) => setChunkSize(parseInt(e.target.value) || 0)}
            />
          </div>

          {/* Splitting method dropdown */}
          <div className="flex-1">
            <label htmlFor="split-method" className="text-gray-400 mb-2 block">Split By</label>
            <select
              id="split-method"
              className="w-full bg-gray-900 text-gray-300 p-2 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-all duration-300"
              value={splitMethod}
              onChange={(e) => setSplitMethod(e.target.value)}
            >
              <option value="characters">Characters</option>
              <option value="lines">Lines</option>
              <option value="delimiter">Custom Delimiter</option>
            </select>
          </div>

          {/* Custom Delimiter Input (conditionally rendered) */}
          {splitMethod === 'delimiter' && (
            <div className="flex-1">
              <label htmlFor="custom-delimiter" className="text-gray-400 mb-2 block">Delimiter</label>
              <input
                id="custom-delimiter"
                type="text"
                className="w-full bg-gray-900 text-gray-300 p-2 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-all duration-300"
                value={customDelimiter}
                onChange={(e) => setCustomDelimiter(e.target.value)}
              />
            </div>
          )}
          
          {/* Action buttons */}
          <div className="flex justify-between space-x-2 w-full md:w-auto mt-6 md:mt-0">
            <button
              onClick={handleClear}
              className="flex-1 flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <Eraser className="mr-2" size={20} /> Clear
            </button>
            <button
              onClick={handleSplit}
              className="flex-1 flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <Split className="mr-2" size={20} /> Split
            </button>
          </div>
        </div>
        
        {/* Output area for the chunks */}
        {chunks.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <FileText className="mr-2" size={24} /> Split Chunks
            </h2>

            {/* "Copy All" button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => copyToClipboard(chunks.join('\n\n' + '-'.repeat(30) + '\n\n'))}
                className="flex items-center text-gray-400 hover:text-purple-500 transition-all duration-300"
              >
                <Copy className="mr-2" size={16} /> Copy All Chunks
              </button>
            </div>
            
            {/* List of chunks */}
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {chunks.map((chunk, index) => (
                <div key={index} className="bg-gray-900 p-4 rounded-xl border border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500 text-sm">Chunk {index + 1}</span>
                    <button
                      onClick={() => copyToClipboard(chunk)}
                      className="text-gray-400 hover:text-purple-500 transition-all duration-300 flex items-center"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-300">
                    {chunk}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Copy notification */}
      {showNotification && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg transition-transform duration-300 transform animate-bounce-in">
          Copied to clipboard!
        </div>
      )}
    </div>
  );
}
