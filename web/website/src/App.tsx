
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./App.css"

import { PrimeReactProvider } from "primereact/api";
import Home from "./pages/home/Index";

function App() {

  return (
    <PrimeReactProvider value={{appendTo: "self"}}>
      <Home />
    </PrimeReactProvider>
  );
}

export default App;
