import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Homepage } from "../../pages/Homepage";
import Login from "../../pages/Login";
import MessagingApp from "../../pages/MessagingApp";
import Register from "../../pages/Register";
import { Header } from "../Header/Header";
import ProtectedRoute from "./ProtectedRoute";

const MyRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Header />}>
          <Route path="/home" element={<Homepage />} />
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<MessagingApp />}></Route>
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default MyRouter;
