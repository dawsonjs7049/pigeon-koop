export async function sendEmail(data) {
    fetch('/api/bookingEmail', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
}