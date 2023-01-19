import Image from "next/image";
import allReports from "./allReports";

function App() {
    return (
        <div className="App">
            <header className="App-header">
                {/* <Image
                    src={logo}
                    className="App-logo"
                    width={200}
                    height={200}
                    alt="logo"
                /> */}
                

                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;