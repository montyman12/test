import React, { useRef, useState } from "react";

const App = () => {
  const [fileInput, setFileInput] = useState(null);
  const [textareaValue, setTextareaValue] = useState("");
  const [treeData, setTreeData] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [inputMethod, setInputMethod] = useState("file"); // Added state for input method

  const fileInputRef = useRef(null);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setFileInput(file);
    setTextareaValue("");
    handleParseJson(file); // Automatically validate the file
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const file = event.dataTransfer.files[0];
    setFileInput(file);
    setTextareaValue("");
    handleParseJson(file); // Automatically validate the file
  };

  const handleParseJson = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(reader.result);
          setTreeData(jsonData);
        } catch (error) {
          setFileInput(null); // Delete the file
          setTreeData([]);
          alert(`Error: ${error.message}`);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDeleteFile = () => {
    setFileInput(null);
    setTreeData([]);
  };

  const handleTextareaChange = (event) => {
    setTextareaValue(event.target.value);
    setFileInput(null);
    setTreeData([]);
  };

  return (
    <div className="container">
      <h1 className="header">JSON Validator</h1>
      <div className="input-method-container">
        <label>
          <input
            type="radio"
            value="file"
            checked={inputMethod === "file"}
            onChange={() => setInputMethod("file")}
          />
          File Upload
        </label>
        <label>
          <input
            type="radio"
            value="textarea"
            checked={inputMethod === "textarea"}
            onChange={() => setInputMethod("textarea")}
          />
          Textarea Input
        </label>
      </div>
      {inputMethod === "file" ? (
        <div className="box">
          <h2 className="box-header">Upload JSON file</h2>
          <div
            className="drop-area"
            onDrop={handleFileDrop}
            onDragOver={(event) => event.preventDefault()}
          >
            {fileInput ? (
              <div>
                <p>File Name: {fileInput.name}</p>
                <button onClick={handleDeleteFile}>Delete</button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  className="upload-input"
                />
                <p>Drag and drop file here or click to upload</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="box">
          <h2 className="box-header">Textarea Input</h2>
          <textarea
            className="textarea"
            value={textareaValue}
            onChange={handleTextareaChange}
          ></textarea>
          <button
            onClick={() => {
              try {
                const jsonData = JSON.parse(textareaValue);
                setTreeData(jsonData);
                setFileInput(null);
              } catch (error) {
                setTextareaValue(""); // Clear textarea
                setFileInput(null);
                setTreeData([]);
                alert(`Error: ${error.message}`);
                }
                }}
                >
                Parse JSON
                </button>
                </div>
                )}
                <div className="box">
                <h2 className="box-header">Parsed JSON Tree</h2>
                {treeData && treeData.length > 0 ? (
                <pre>{JSON.stringify(treeData, null, 2)}</pre>
                ) : (
                <p>No JSON data to display</p>
                )}
                </div>
                </div>
                );
                };
                
                export default App;
                
                
                
                
                
                
                
                
