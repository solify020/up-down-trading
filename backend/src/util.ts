import axios from "axios";
import qs from 'qs';

var smsCode: { [key: string]: string } = {};

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

const generateSixDigitCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendVerificationCode = async (phoneNumber: string) => {
  const code = generateSixDigitCode();
  smsCode[phoneNumber] = code;
  console.log(smsCode);
  
  const data = qs.stringify({
    "To": phoneNumber,
    "MessagingServiceSid": '',
    "Body": `Your verification code is ${code}`
  });
  return await axios.post('https://api.twilio.com/2010-04-01/Accounts/AC556ae44a8910b175168b1f308391f669/Messages.json', data, {
    auth: {
      username: '',
      password: ''
    }
  })
};

export const checkVerificationCode = async (phoneNumber: string, code: string) => {
  if (smsCode[phoneNumber] !== code) {
    return false;
  }
  delete smsCode[phoneNumber];
  return true;
};

export default verifyCaptcha;