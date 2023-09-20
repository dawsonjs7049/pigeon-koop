import nodemailer from "nodemailer";

// const allEmails = ['jake906@charter.net', 'kaydee906@gmail.com'];
const allEmails = ['dawson9060@gmail.com', 'jake906@charter.net'];

const handler = async (req, res) => {
    if (req.method === 'POST') {
        
        const data = req.body;
        
        if (data.from) {
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.NEXT_PUBLIC_EMAIL,
                        pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD
                    }
                });

                await transporter.sendMail({
                    from: process.env.NEXT_PUBLIC_EMAIL,
                    to: allEmails.filter((email) => email !== data.from),
                    subject: 'Pigeon Koop Booking',
                    text: '',
                    html: `<div>
                                <div>
                                    <h2>This is a notification that ${data.user} has booked the Pigeon Koop</h2>
                                </div>
                                <div style="margin-top: 3rem;">
                                    <h3>Date(s): ${data.date}</h3>
                                <div>
                                <div>
                                    <h3>People: ${data.people}
                                </div>
                           </div>`
                });

                return res.status(200);

            } catch (error) {
                return res.status(400).json({ message: error.message });
            }
        }
    }

    return res.status(400).json({ message: "Bad Request" });
};

export default handler;

