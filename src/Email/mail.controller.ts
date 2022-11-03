import { Sequelize } from "sequelize";
import * as nodemailer from "nodemailer";
import { Request, Response } from "express";

export default class MailerController {
  constructor(db: Sequelize) {

  }

  sendEmail = async (req: Request, res: Response) => {
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
                            <h4 style="color: #0085ff">Gửi mail với nodemailer và express</h4>
                            <span style="color: black">Đây là mail test</span>
                        </div>
                    </div>
                `;
    var mainOptions = {
      from: "RMIT CLUB APP",
      to: req.body.mail,
      subject: "MAILER",
      text: "Your text is here",
      html: content,
    };
    transporter.sendMail(mainOptions, function (err, info) {
      if (err) {
        console.log(err);
        return res.send({ err: "Lỗi gửi mail: " + err });
      } else {
        console.log("Message sent: " + info.response);
        return res.send({ message: "An email is sent to" + req.body.mail });
      }
    });
  };
}
