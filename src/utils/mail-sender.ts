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
        Twoje konto przed aktywacją nie będzie dostępne. Link aktywacyjny jest ważny do godziny 2.00. Po tym czasie nieaktywne konta
        zostają usuwane z bazy.
         ID twojego konta to ${id}.
        link: ${link} `
    };

    try {
        await transporter.sendMail(mail)
    } catch (err) {
        console.log(err);
        throw new Error('error during mail sending')
    }
}

export const sendResetLink = async (userMail: string, link: string): Promise<void> => {
    const mail = {
        from: 'developerdariusz@gmail.com',
        to: `<${userMail}>`,
        subject: 'Reset hasła do konta na portalu Chmurka',
        text: `Link do resetu hasła: ${link} `
    };
    try {
        await transporter.sendMail(mail)
    } catch (err) {
        console.log(err);
        throw new Error('error during mail sending')
    }
}

export const sendEventReminder = async (userMail: string, name: string, event: string): Promise<void> => {
    const mail = {
        from: 'developerdariusz@gmail.com',
        to: `<${userMail}>`,
        subject: 'Przypomnienie o nadchodzącym wydarzeniu',
        text: `Witaj ${name}, 
        Przypominamy że dzisiaj masz wydarzenie zapisane w twoim Chmurkowym kalendarzu
        Nie zapomnij że dziś: ${event}, jeśli chcesz więcej szczegółów zaloguj się do chmurki i sprawdź co Cię dziś czeka.`
    };
    try {
        await transporter.sendMail(mail)
    } catch (err) {
        console.log(err);
        throw new Error('error during mail sending')
    }
}