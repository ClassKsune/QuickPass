import React, { useState } from "react";

const DeveloperPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdateDatabase = async () => {
  setLoading(true);
  setMessage('');

  try {
    const response = await fetch('/api/developer/update-database', {
      method: 'POST',
    });
    const result = await response.json();
    setMessage(result.message || 'Aktualizace dokončena.');
  } catch (error) {
    console.error(error);
    setMessage('Chyba při aktualizaci databáze.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Developer Database Update</h1>
      <button
        onClick={handleUpdateDatabase}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        {loading ? "Aktualizuji..." : "Aktualizovat databázi"}
      </button>
      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
};

export default DeveloperPage;
