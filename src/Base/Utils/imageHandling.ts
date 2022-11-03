import { Express, Request, Response, Router } from "express";
import { Multer } from "multer";
import sharp from "sharp";

export const handleInputImage = async (req: Request, res: Response) => {
  var files = req.files as Express.Multer.File[];

  let result = await sharp(files[0].buffer)
    .metadata()
    .then((info) => {
    if ((info.width as number ) < 2000) {
        return sharp(files[0].buffer).toBuffer();
    }
      let scaleIndex = 1080 / (info.width as number);
      
      
      let width = Math.round((info.width as number) * scaleIndex);
      let height = Math.round((info.height as number) * scaleIndex);
    //   console.log(width);

      return sharp(files[0].buffer).resize(width, height).toBuffer();
    });

  res.writeHead(200, {
    "Content-Type": "image/png",
  });
  res.end(result);
};
