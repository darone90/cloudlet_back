import { createTransport } from 'nodemailer';
import { passConfig } from 'userpass.config';


const transporter = createTransport({
    service: passConfig.mailService,
    secure: true,
    auth: {
        user: passConfig.mailCli,
        pass: passConfig.mailPass
    }
})

export const sendActivationLink = async (link: string, id: string, userMail: string): Promise<void> => {
    const mail = {
        from: 'developerdariusz@gmail.com',
        to: `<${userMail}>`,
        subject: 'Aktywacja konta na portalu Chmurka',
        text: `Dziękujemy za założenie konta w naszym serwisie! Aby zalogować sie do swojego konta kliknij w poniższy link aktywacyjny
        Twoje konto przed aktywacją nie będzie dostępne. ID twojego konta to ${id}.
        link: ${link} `
    };

    try {
        await transporter.sendMail(mail)
    } catch (err) {
        console.log(err);
        throw new Error('error during mail sending')
    }
}