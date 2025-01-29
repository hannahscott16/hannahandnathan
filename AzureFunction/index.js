const sendGrid = require('@sendgrid/mail');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // You'll need to set this in your Azure Function's application settings
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

    const { to, from, name, message } = req.body;

    const msg = {
        to: to,
        from: 'your-verified-sender@yourdomain.com', // You need to verify this sender in SendGrid
        subject: `New Contact Form Message from ${name}`,
        text: `
Name: ${name}
Email: ${from}

Message:
${message}
        `,
        html: `
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${from}</p>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, '<br>')}</p>
        `
    };

    try {
        await sendGrid.send(msg);
        context.res = {
            status: 200,
            body: "Message sent successfully"
        };
    } catch (error) {
        context.log.error('Error sending email:', error);
        context.res = {
            status: 500,
            body: "Error sending message"
        };
    }
}; 