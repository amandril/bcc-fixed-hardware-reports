import useForm from '../lib/useForm';
import styles from '../styles/formStyles.module.css';

export default function ReportForm() {
    
    const handleSubmit = (e) => {
        console.log("Event: ", e);
    };

    const { inputs, handleChange, clearForm, resetForm } = useForm({
        // Initial values we provide the form
        name: "", 
        email: "",
        reportedHardware: "",
        where: "",
        problem: "",
        description: "",
        image: ""
    });

    return (
        // <form onSubmit={handleSubmit}>
        //     <label htmlFor="name">Name</label>
        //     <input type="text" name="name" />
        //     <button type="submit" name="submit">Submit</button>
        // </form>
        
        <form className={styles.hardwareForm}
        onSubmit={async (e) => {
            e.preventDefault();
            handleSubmit(e);
        }}>
            <fieldset>
                <label htmlFor="name">
                What is your name?
                <input
                    type="text"
                    id="name"
                    name="name"
                    onChange={handleChange}
                    required
                />
                </label>
            </fieldset>
            <fieldset>

                <label htmlFor="email">
                What is your email?
                <input
                    type="email"
                    id="email"
                    name="email"
                    onChange={handleChange}
                    required
                />
                </label>

            </fieldset>
            <fieldset>

                <label htmlFor="reportedHardware">
                What type of fixed hardware is it?
                <select id="reportedHardware" name="reportedHardware" onChange={handleChange}>
                    <option value="default" hidden>
                    Choose a Use
                    </option>
                    <option value="wedge">Wedge bolt</option>
                    <option value="fivepiece">5 piece bolt</option>
                    <option value="buttonhead">Button head bolt</option>
                    <option value="gluein">Glue in bolt</option>
                    <option value="other">Other</option>
                    <option value="unknown">I don't know</option>
                </select>
                </label>

            </fieldset>
            <fieldset>
                <label htmlFor="where">
                Where is it on the climb?
                <span className={styles.caption}>Ex: 1st pitch, 3rd bolt</span>
                <input
                    type="text"
                    id="where"
                    name="where"
                    onChange={handleChange}
                />
                </label>

            </fieldset>
            <fieldset>

                <label htmlFor="problem">
                What is wrong with the fixed hardware?
                <select id="problem" name="problem" onChange={handleChange}>
                    <option value="default" hidden>
                    Select problem
                    </option>
                    <option value="rusty">Rusty</option>
                    <option value="spinner">Spinning hanger</option>
                    <option value="worn">Excessive wear</option>
                    <option value="missing">Missing (partially or fully)</option>
                    <option value="improper">Old or improper hardware</option>
                    <option value="other">Other</option>
                </select>
                </label>

            </fieldset>
            <fieldset>

                <label htmlFor="description">
                Can you describe what you saw?
                <textarea
                    name="description"
                    id="description"
                    onChange={handleChange}
                />
                </label>

            </fieldset>
            <fieldset>

                <label htmlFor="fileUpload">
                Any photos?
                <div className="fileUpload">
                    <input
                    type="file"
                    name="image"
                    id="image"
                    onChange={handleChange}
                    />
                </div>
                </label>
            </fieldset>

            <button type="submit">Submit Report</button>
        </form>
    )
}