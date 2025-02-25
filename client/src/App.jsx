import CreateDocs from "./CreateDocs";
import TextEditor from "./TextEditor"
import { BrowserRouter, Routes, Route } from "react-router";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<CreateDocs />} />
          <Route path="/docs/:url" element={<TextEditor />} />


        </Routes>
      </BrowserRouter>

    </>

  )
}

export default App
