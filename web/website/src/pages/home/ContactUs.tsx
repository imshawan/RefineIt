import React, { useState } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

interface ContactFormData {
    name: string;
    email: string;
    message: string;
}


const ContactUs: React.FC = () => {
    const [formData, setFormData] = useState<ContactFormData>({
        name: "",
        email: "",
        message: "",
    });

    const toast = React.useRef<Toast>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.current?.show({ severity: "success", summary: "Success", detail: "Message sent successfully!", life: 3000 });
        setFormData({ name: "", email: "", message: "" });
    };
    return (
        <div className="flex justify-content-center surface-ground">
            <div style={styles.container} id="contactus" className="px-4 py-8 md:px-6 lg:px-8">
                <div className="text-center mb-6">
                    <h2 style={styles.heading}>Contact us</h2>
                </div>
                <div className="grid px-0">
                    <div className="col-12 md:col-4 bg-no-repeat bg-right-bottom flex flex-column justify-content-center">
                        <div className="text-600 text-4xl lg:text-5xl p-2">
                            Have questions or need more details? <br />Reach out to us, <br/>let's discuss.
                        </div>
                    </div>
                    <div style={styles.formContainer} className="col-12 md:col-8 p-4 shadow-1 surface-card">
                        <form onSubmit={handleSubmit} className="p-fluid">
                            <div className="field">
                                <label htmlFor="name" className="font-medium">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    className="p-inputtext p-component py-3 px-2 p-inputtext-sm"
                                    name="name" value={formData.name} onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="email-address" className="font-medium">
                                    Email
                                </label>
                                <input
                                    id="email-address"
                                    className="p-inputtext p-component py-3 px-2 p-inputtext-sm"
                                    name="email" value={formData.email} onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="message" className="font-medium">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    className="p-inputtextarea p-inputtext p-component p-inputtextarea-resizable py-3 px-2"
                                    name="message" value={formData.message} onChange={handleInputChange}
                                    required
                                ></textarea>
                            </div>
                            <div className="">
                                <Button type="submit" className="button-dark p-button-secondary w-auto" icon="pi pi-send" iconPos="right" label="Send Message" />
                            </div>
                        </form>
                    </div>
            
                </div>
                <Toast ref={toast} />
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "1160px"
    },
    heading: {
        textAlign: "center" as "center", // Type assertion
        fontSize: "2.5rem"
    },
    formContainer: {
        borderRadius: "10px",
    }
}

export default ContactUs;