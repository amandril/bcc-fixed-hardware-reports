import ReportForm from "../components/ReportForm"

export default function newReportPage() {
    return (
        <ReportForm reportMethod={postReport} />
    )
}

export async function postReport(data = {}) {
    const baseURL = process.env.BASE_URL || "http://localhost:3000"
    await fetch(`${baseURL}/api/reports`, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((data) => { console.log('Success: ', data)})
    .catch((error:any) => console.error('Error: ', error))
}