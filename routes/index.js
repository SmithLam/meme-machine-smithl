var express = require("express");
var router = express.Router();
var multer = require("multer");
var fs = require("fs");
const upload = require("../utils/Upload");
const {
  loadOriginals,
  saveOriginals,
  loadMemes,
  saveMemes,
} = require("../utils/data");
const Jimp = require("jimp");
const path = require("path");

const pathToOriginal = path.join(__dirname, "../public/images/originals/");
const pathToMeme = path.join(__dirname, "../public/images/memes/");

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
    const originals = loadOriginals();
    console.log("this is datalist", originals);
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
      originals.push({
        filename: req.file.filename,
        id: id,
        size: req.file.size,
        originalname: req.file.originalname,
        path: req.file.path,
      });
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

router.get("/meme", function (req, res, next) {
  const memes = loadMemes();
  return res.render("original", {
    title: "Meme Machine",
    success: "See your Memes here.",
    images: memes,
    path: "/images/memes/",
  });
});

router.post("/postmeme", async function (req, res, next) {
  try {
    const { id, top, bottom } = req.body;
    console.log(req.body);
    console.log(id);
    // if (!req.body) return res.send("Need send an image");
    const originals = loadOriginals();
    const selectedImageIndex = originals.findIndex(
      (item) => item.id * 1 === id * 1
    );
    console.log("what is selected Image Index", selectedImageIndex);
    let selectedImage = originals[selectedImageIndex];
    console.log("what is selected Image", selectedImage);
    let image = await Jimp.read(selectedImage.path);
    let font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    image.resize(400, 200);
    if (top) {
      image.print(
        font,
        0,
        0,
        {
          text: top,
          alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
          alignmentY: Jimp.VERTICAL_ALIGN_TOP,
        },
        400,
        200
      );
    }
    if (bottom) {
      image.print(
        font,
        0,
        0,
        {
          text: bottom,
          alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
          alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM,
        },
        400,
        200
      );
    }
    let memeName = Date.now() + "-" + selectedImage.originalname;
    await image.writeAsync(pathToMeme + memeName);
    let memes = loadMemes();
    if (memes.length === 0) {
      idNum = 1;
    } else {
      idNum = memes[memes.length - 1].id + 1;
    }
    memes.push({
      filename: memeName,
      id: idNum,
    });
    saveMemes(memes);
    return res.render("meme", {
      title: "Meme Machine",
      success: "Successfully posted Meme.",
      images: memes,
      path: "/images/memes/",
    });
  } catch (err) {
    console.log(err);
    return res.send("Not OK");
  }
});

module.exports = router;
