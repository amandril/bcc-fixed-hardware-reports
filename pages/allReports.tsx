import Report from "../components/Report";

export default function allReports({allReports}) {
    console.log(allReports)
    return (
        <div>
            {allReports.data.map((report, i) => (
                <Report key={i} report={report} />
            ))}
        </div>
    )
}

export async function getServerSideProps(context: any) {
    let res = await fetch("http://localhost:3000/api/reports", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    let allReports = await res.json();

    return {
        props: {allReports}
    }
}