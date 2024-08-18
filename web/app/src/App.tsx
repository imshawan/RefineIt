
// import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "./App.css";

import { PrimeReactProvider } from "primereact/api";
import { Provider } from "react-redux";
import Router from "./Router";
import { store } from "./store";

function App() {
    return (
        <Provider store={store}>
            <PrimeReactProvider value={{ appendTo: "self" }}>
                <Router />
            </PrimeReactProvider>
        </Provider>
    );
}

export default App;
