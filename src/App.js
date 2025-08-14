import React, { useState } from 'react';
import jsPDF from 'jspdf';

export default function App() {
  const [score, setScore] = useState(0);

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("AI Maturity Assessment Results", 10, 10);
    doc.text(`Your score: ${score}`, 10, 20);
    doc.save("AI-Maturity-Assessment.pdf");
  };

  return (
    <div style={{ fontFamily: 'Arial', padding: '20px', textAlign: 'center' }}>
      <img src="https://matchboxlms.com/payment-handler/assets/logo-3.png" alt="MatchboxLMS" style={{ width: '200px', marginBottom: '20px' }} />
      <h1>AI Implementation Maturity Assessment</h1>
      <p>Rate your organization's AI readiness:</p>
      <input
        type="number"
        value={score}
        onChange={(e) => setScore(e.target.value)}
        min="0"
        max="100"
      />
      <br /><br />
      <button onClick={exportPDF} style={{ padding: '10px 20px', fontSize: '16px' }}>Export as PDF</button>
    </div>
  );
}
