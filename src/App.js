import React, { useState } from "react";
import axios from "axios";

function App() {
  const [jdText, setJdText] = useState("");
  const [skills, setSkills] = useState("");
  const [resumeFiles, setResumeFiles] = useState([]);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jdText || !skills || resumeFiles.length === 0) {
      alert("Please fill in all fields and upload resumes.");
      return;
    }

    const formData = new FormData();
    formData.append("jd_text", jdText);
    formData.append("mandatory_skills", skills);
    for (let i = 0; i < resumeFiles.length; i++) {
      formData.append("resumes", resumeFiles[i]);
    }

    try {
      const response = await axios.post("https://resume-backend-thrinesh.azurewebsites.net/docs/match_bulk", formData);
      setResult(response.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to process the resumes.");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Resume Screening Tool (Bulk Upload)</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Job Description:</label><br />
          <textarea
            rows="6"
            cols="80"
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            required
          ></textarea>
        </div>
        <br />
        <div>
          <label>Mandatory Skills (comma separated):</label><br />
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
          />
        </div>
        <br />
        <div>
          <label>Upload Resumes (PDF/DOCX):</label><br />
          <input
            type="file"
            accept=".pdf,.docx"
            multiple
            onChange={(e) => setResumeFiles(e.target.files)}
            required
          />
        </div>
        <br />
        <button type="submit">Analyze Resumes</button>
      </form>

      <br />

      {result?.results?.length > 0 && (
        <div>
          <h2>Analysis Results</h2>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Resume</th>
                <th>Match %</th>
                <th>Mandatory Skills OK?</th>
                <th>Matched Skills</th>
                <th>Missing Skills</th>
              </tr>
            </thead>
            <tbody>
              {result.results.map((res, idx) => (
                <tr key={idx}>
                  <td>{res.filename}</td>
                  <td>{res.match_percentage}%</td>
                  <td>{res.all_mandatory_skills_present ? "✅" : "❌"}</td>
                  <td>{res.matched_skills.join(", ")}</td>
                  <td>{res.missing_skills.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
