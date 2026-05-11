import { Resend } from "resend";

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY as string);

export const sendAnnouncementEmail = async (
    emails: string[],
    title: string,
    content: string
) => {
    try {
        const data = await resend.emails.send({
            from: "Synapse <onboarding@resend.dev>",
            to: emails,
            subject: `New Announcement: ${title}`,
            html: `
                <h2>${title}</h2>
                <p>${content}</p>
            `,
        });

        console.log("SUCCESS:", data);
    } catch (error) {
        console.error("Email error:", error);
    }
};