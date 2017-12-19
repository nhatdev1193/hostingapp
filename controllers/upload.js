const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jsonfile = require('jsonfile');
const appDB = require('../DB/app.json');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({storage: storage}).any();

exports.Upload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return err
    }

    next();
  })
}

exports.afterUpload = (req, res) => {
  req.files.forEach((file) => {
    const extention = path.extname(file.filename);
    const iosPlist = (url, bundleID = 'com.test.abc', bundleVersion = '1.0.1', title = 'VBA') => `
    <?xml version="1.0"	encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD	PLIST	1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
    <dict>
    <key>items</key>
    <array>
    <dict>
    <key>assets</key>
    <array>
    <dict>
    <key>kind</key>
    <string>software-package</string>
    <key>url</key>
    <string>http://${process.env.HOST}/${url}</string>
    </dict>
    </array>
    <key>metadata</key>
    <dict>
    <key>bundle-identifier</key>
    <string>${bundleID}</string>
    <key>bundle-version</key>
    <string>${bundleVersion}</string>
    <key>kind</key>
    <string>software</string>
    <key>title</key>
    <string>${title}</string>
    </dict>
    </dict>
    </array>
    </dict>
    </plist>
    `

    if (extention === '.ipa') {
      fs.writeFile(`uploads/${file.filename}.plist`, iosPlist(`${process.env.HOST}/uploads/${file.filename}`,
                                        req.body.bundleID, req.body.bundleVersion, req.body.title), (err) => {
                                          if (err) {
                                            res.status(500).send('Please Try Again')
                                          } else {
                                            const obj = {
                                              title: req.body.title,
                                              appURL: file.filename,
                                              link: `itms-services://?action=download-manifest&url=http://${process.env.DB_HOST}/uploads/${file.filename}.plist`
                                            }
                                            res.status(201).send(obj);
                                          }
                                        })
    };

    if (extention === '.apk') {
      const obj = {
        title: req.body.title,
        appURL: file.filename,
        link: `https://${process.env.DB_HOST}/uploads/${file.filename}`
      }
      res.status(201).send(obj);
    }
  });
};
