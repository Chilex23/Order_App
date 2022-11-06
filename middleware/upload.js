import multer from "multer";

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = file.originalname.split(".")[1]
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension);
  },
});

function fileFilter(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    const error = new Error("Please upload a valid image file");
    error.status = 400;
    return cb(error);
  }
  cb(undefined, true);
}

export let upload = multer({
  storage: storage,
  limits: 2000000,
  fileFilter: fileFilter
});
