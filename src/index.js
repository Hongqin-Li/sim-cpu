import React from "react";
import ReactDOM from "react-dom";
import Button from "@material-ui/core/Button";
import Layout from "./layout";

import "./styles.css";

function handleUpload(event) {
  let fileReader = new FileReader();
  fileReader.onload = function(event) {
    let str = event.target.result;

    ReactDOM.render(<App />, rootElement);
  };
  fileReader.readAsText(event.target.files[0]);
}

function App() {
  return (
    <div className="App">
      <h1>Hello</h1>

      <br />

      <div>
        <Button variant="contained" component="span">
          step
        </Button>
        <input
          accept=".yo"
          id="contained-button-file"
          multiple
          type="file"
          style={{ display: "none" }}
          onChange={handleUpload}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" component="span">
            Upload
          </Button>
        </label>
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");

ReactDOM.render(<Layout />, rootElement);
