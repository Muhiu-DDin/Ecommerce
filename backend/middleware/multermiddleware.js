import fs from "fs";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "./Public/Temp";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

export const upload = multer({storage})

export const deleteUploadedFiles = (files)=>{
    if(!files) return 

    // files is an object created by multer , in which there are fileds i.e image1 , image2 which are arays having fields like destination , finename

    // EXAMPLE 
    //     const files = {
    //   image1: [
    //     { destination: "./Public/Temp", filename: "pic1.png" }
    //   ],
    //  image2: [
    //     { destination: "./Public/Temp", filename: "doc1.pdf" },
    //     { destination: "./Public/Temp", filename: "doc2.pdf" }
    //   ]
    // };


    for (let field in files){
          for(let file of files[field]){
            const filePath = path.join(file.destination , file.filename)
            fs.unlink(filePath , (err)=>{
                if (err) console.error("Error deleting file:", err);
            })
          }
    }
}

