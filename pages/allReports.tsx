export default function allReports({allReports}) {
    console.log(allReports)
    return (
        allReports.data.map((report) => (
            <div>
                <div>Report id: {report._id}</div>
                <div>Name: {report.name}</div>
                <div>Email: {report.email}</div>
                <div>Area: {report.area}</div>
                <div>Crag: {report.crag}</div>
                <div>Route: {report.route}</div>
                <div>Hardware Type: {report.hardwareType}</div>
                <div>Description: {report.description}</div>
                <br />
            </div>
        ))

        
            // allReports.data.map((report) => (
            //     <div>
            //         <div>{report.name}</div>
            //         <div>{report.email}</div>
            //         <div>{report.area}</div>
            //         <div>{report.crag}</div>
            //         <div>{report.route}</div>
            //         <div>{report.hardwareType}</div>
            //         <div>{report.description}</div>
            //     </div>
            // ))
    )
}

export async function getStaticProps(context: any) {
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