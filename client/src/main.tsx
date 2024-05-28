import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Record from "./components/Record";
import RecordList from "./components/RecordList";

<BrowserRouter>
  <Routes>
    <Route path='/*' element={<App />}>
      <Route path='/' element={<RecordList />} />
    </Route>
    <Route path='/edit/:id' element={<App />}>
      <Route path='/edit/:id' element={<Record />} />
    </Route>
    <Route path='/create' element={<App />}>
      <Route path='/create' element={<Record />} />
    </Route>
  </Routes>
</BrowserRouter>;
