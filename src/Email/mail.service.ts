import * as nodemailer from "nodemailer";
import path from "path";
import sharp from "sharp";
import CustomError from "../App/Middlewares/Errors/CustomError";
import confirmationEmailTemplate from './emailTemplate'

export default class MailService {
  sendMail = async (userEmail: string) => {
    var transporter = nodemailer.createTransport({
      // config mail server
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "rmit.clubapp@gmail.com",
        pass: "fgtbewdttzhsrpez",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    var content = "";
    content += `
                          <div style="padding: 10px; background-color: #003375">
                              <div style="padding: 10px; background-color: white;">
                                  <h4 style="color: #0085ff">Mailed with Express Application</h4>
                                  <span style="color: black">Đây là mail test</span>
                              </div>
                          </div>
                      `;
    var mainOptions = {
      from: "RMIT CLUB APP",
      to: userEmail,
      subject: "MAILER",
      text: "Your text is here",
      html: content,
    };
    transporter.sendMail(mainOptions, function (err, info) {
      if (err) {
        throw new CustomError(err.name, 400, err.message);
      } else {
        //   console.log("Message sent: " + info.response);
        return { message: "An email is sent to" + userEmail };
      }
    });
  };

  sendVerificationMail = async (userEmail: string, code: string) => {
    var transporter = nodemailer.createTransport({
      // config mail server
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "rmit.clubapp@gmail.com",
        pass: "fgtbewdttzhsrpez",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    var content = confirmationEmailTemplate(code);
    var mainOptions = {
      from: "RMIT CLUB APP",
      to: userEmail, //userEmail,
      subject: `RMIT ClubHub Account verification for ${
        userEmail.split("@")[0]
      }`,
      text: "txt",
      html: content,
    };
    transporter.sendMail(mainOptions, function (err, info) {
      if (err) {
        throw new CustomError(err.name, 400, err.message);
      } else {
        return { message: "An email is sent to" + userEmail };
      }
    });
  };
}



    // content += `
    //                       <div style="padding: 10px; background-color: #003375">
    //                           <div style="margin: 0 auto; padding: 10px; background-color: white;">
    //                             <img style="width: 200px; height: 200px; object-fit: cover" src="https://dcmp4zikxcg13.cloudfront.net/TuanVutru.png">
    //                               <h2 style="color: #0085ff">RMIT ClubHub Account verification</h2>
    //                               <p> 
    //                                 Dear <b>${userEmail.split("@")[0]}</b>, <br>
    //                                 Please verify your email address to complete your RMIT ClubHub account. <br>
    //                                 Your verification code is: <b>${code}</b> <br>

    //                                 Thank you, <br>
    //                                 The RMIT ClubHub Team
    //                                 </p>
    //                           </div>
    //                       </div>
    //                   `;
