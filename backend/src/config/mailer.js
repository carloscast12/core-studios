const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

const sendMail = async ({ from, to, replyTo, subject, text }) => {
  const res = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(10000),
    body: JSON.stringify({
      sender: { name: "Core Studios Web", email: from },
      to: [{ email: to }],
      replyTo: { email: replyTo },
      subject,
      textContent: text,
    }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "no se pudo enviar el correo");
  }
};

export default { sendMail };
