import Router from "./router";
import "./App.css";
import { SocketProvider } from "./socket/socketContext";

function App() {
  return (
    <>
      <SocketProvider>
        <Router />
      </SocketProvider>
    </>
  );
}

export default App;
