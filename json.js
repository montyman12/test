import React, { useRef, useState } from "react";

const App = () => {
  const [fileInput, setFileInput] = useState(null);
  const [textareaValue, setTextareaValue] = useState("");
  const [treeData, setTreeData] = useState([]);

  const fileInputRef = useRef(null);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setFileInput(file);
    setTextareaValue(""); // clear textarea value
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files[0];
    setFileInput(file);
    setTextareaValue(""); // clear textarea value
  };

  const handleParseJson = () => {
    if (fileInput) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target.result);
          setTreeData(jsonData);
        } catch (error) {
          setTreeData([]);
          alert(`Error: ${error.message}`);
        }
      };
      reader.readAsText(fileInput);
    } else if (textareaValue) {
      try {
        const jsonData = JSON.parse(textareaValue);
        setTreeData(jsonData);
      } catch (error) {
        setTreeData([]);
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleDeleteFile = () => {
    setFileInput(null);
    setTreeData([]);
  };

  const handleReplaceFile = () => {
    setFileInput(null);
    setTreeData([]);
    fileInputRef.current.click();
  };

  const handleTextareaChange = (event) => {
    setTextareaValue(event.target.value);
    setFileInput(null); // clear file input
    setTreeData([]); // clear treeData
  };

  return (
    <div className="container">
      <h1 className="header">JSON Validator</h1>
      <div className="box">
        <h2 className="box-header">Upload JSON file</h2>
        {fileInput ? (
          <div>
            <p>File Name: {fileInput.name}</p>
            <button onClick={handleDeleteFile}>Delete</button>
            <button onClick={handleReplaceFile}>Replace</button>
          </div>
        ) : (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
            />
            <div
              className="drop-area"
              onDrop={handleFileDrop}
              onDragOver={(event) => event.preventDefault()}
            >
              Drag and drop file here
            </div>
          </div>
        )}
        <button
          onClick={handleParseJson}
          disabled={!fileInput}
          className="parse-button"
        >
          Parse File
        </button>
      </div>
      <div className="box">
        <h2 className="box-header">Textarea Input</h2>
        <textarea
          className="textarea"
          value={textareaValue}
          onChange={handleTextareaChange}
        ></textarea>
        <button
          onClick={handleParseJson}
          disabled={!textareaValue}
          className="parse-button"
        >
          Parse JSON in Textarea
        </button>
      </div>
      <div className="box">
        <h2 className="box-header">Parsed JSON</h2>
        <pre className="parsed-json">{JSON.stringify(treeData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default App;

