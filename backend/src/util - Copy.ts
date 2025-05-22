import axios from "axios";
import { Twilio } from 'twilio';

const client = new Twilio('ACbc363b69be5a1a9ee31a31265fd6cffd', '71f5a84559f599e367d21fe0bfb3bb59');


const verifyCaptcha = async (token: string) => {
  const secretKey = '6LdN8DwrAAAAADO31guQ-lwz-5qXUZbUrUyTe9sP'; // Store in .env

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
    );
    console.log(response.data);

    return response.data.success;
  } catch (err) {
    console.error('CAPTCHA verification failed:', err);
    return false;
  }
};

export const sendVerificationCode = async (phoneNumber: string) => {
  return await client.verify.v2.services('VA3225d5a82fcd2044df660a1e49e44e27')
    .verifications
    .create({ to: phoneNumber, channel: 'sms' });
};

export const checkVerificationCode = async (phoneNumber: string, code: string) => {
  return await client.verify.v2.services('VA3225d5a82fcd2044df660a1e49e44e27')
    .verificationChecks
    .create({ to: phoneNumber, code });
};

export default verifyCaptcha;