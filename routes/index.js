var express = require("express");
var router = express.Router();
var multer = require("multer");
var fs = require("fs");
const upload = require("../utils/Upload");
const { loadOriginals, saveOriginals } = require("../utils/data");
const Jimp = require('jimp')

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Meme Machine" });
});

router.post("/upload", function (req, res, next) {
  upload(req, res, function (err) {
    if (err) {
      return res.render("index", { title: "Meme Machine", error: err.message }); //throw the error from Upload.js
    }
    if (!req.file) {
      return res.render("index", {
        title: "Meme Machine",
        error: "File cannot be upload",
      });
    }
    console.log(req.file);
    // Jimp.read(req.file.path, (err, image) => {
    //   if (err) throw err;
    //   image
    //     .resize(800, 600) // resize
    //     .quality(60) // set JPEG quality
    //     .greyscale() // set greyscale
    //     .write(req.file.filename); // save
    // });
    const originals = loadOriginals();
    console.log("this is datalist", originals)
    const duplicateImage = originals.findIndex(
      (item) =>
        item.size === req.file.size &&
        item.originalname === req.file.originalname
    );
    if (duplicateImage !== -1) {
      console.log("This is duplicate image", duplicateImage);
      fs.unlinkSync(req.file.path);
          return res.render("original", {
            title: "Meme Machine",
            success: "Most recent file was a duplicate",
            images: originals,
            path: "/images/originals/",
          });
    } else {
      if (originals.length === 0) {
        id = 1;
      } else {
        id = originals[originals.length - 1].id + 1;
      }
      originals.push({ filename: req.file.filename, id: id, size:req.file.size, originalname:req.file.originalname });
      saveOriginals(originals);
    }
    return res.render("original", {
      title: "Meme Machine",
      success: "File successfully uploaded",
      images: originals,
      path: "/images/originals/",
    });
  });
});

router.get("/original", function (req, res, next) {
  const originals = loadOriginals();
  return res.render("original", {
    title: "Meme Machine",
    success: "See your Original Images here.",
    images: originals,
    path: "/images/originals/",
  });
});




module.exports = router;
