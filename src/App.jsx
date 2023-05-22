import { Route, Routes, Navigate } from "react-router-dom";
import Chat from "./views/Chat";
import Signup from "./views/Signup";
import Signin from "./views/Signin";
import Navbar from './components/Navbar.jsx'
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <ChatContextProvider user = {user}>
    {/* <Navbar/> */}
     <Routes>
      <Route path="/" element={ user ? <Chat/> : <Signin/>}></Route>
      <Route path="/signup" element={ user ? <Chat/> : <Signup/>}></Route>
      <Route path="/signin" element={ user ? <Chat/> : <Signin/>}></Route>
      <Route path="*" element={<Navigate to="/"/>}></Route>
     </Routes>
    </ChatContextProvider>
  )
}

export default App
