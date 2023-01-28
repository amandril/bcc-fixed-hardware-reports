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
    const baseURL = process.env.BASE_URL || "http://localhost:3000"
    let res = await fetch(`${baseURL}/api/v1/reports`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    console.log(res)
    let allReports = await res.json();

    return {
        props: {allReports}
    }
}