import Image from "next/image";
import allReports from "./allReports";
import Link from "next/link";

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
                
                <div className="pageList">
                    <Link href="./allReports">View All Reports</Link>
                    <Link href="./newReport">Create New Report</Link>
                </div>

            </header>
        </div>
    );
}

export default App;