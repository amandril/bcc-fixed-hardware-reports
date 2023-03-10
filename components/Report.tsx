export default function Report ( {report} ) {
    return (
        <div className="report">
            <div>Report id: {report._id}</div>
            <div>MP climb id: {report.mp_climb_id}</div>
            <div>OB climb id: {report.ob_climb_id}</div>
            <div>Name: {report.name}</div>
            <div>Email: {report.email}</div>
            <div>Area: {report.area}</div>
            <div>Crag: {report.crag}</div>
            <div>Route: {report.route}</div>
            <div>Assessed At: {report.assessed_at}</div>
            <div>Hardware Type: {report.hardwareType || report.hardware_type}</div>
            <div>Description: {report.description}</div>
            <div>Date: {report.timestamp}</div>
        </div>
    )
}
