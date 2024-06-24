const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { exec } = require('child_process');
const { embedImage, extractImage } = require('./steganography');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(fileUpload());

// Embed route
app.post('/embed', (req, res) => {
    let carrierImage = req.files.carrierImage;
    let secretImage = req.files.secretImage;
    let encryptionKey = req.body.encryptionKey;
    
    if (!carrierImage || !secretImage || !encryptionKey) {
        return res.status(400).send('No files were uploaded or encryption key missing.');
    }
    
    let carrierImagePath = path.join(__dirname, 'public/uploads', 'carrier_image.png');
    let secretImagePath = path.join(__dirname, 'public/uploads', 'secret_image.png');
    let outputImagePath = path.join(__dirname, 'public/uploads', 'output_image.png');

    carrierImage.mv(carrierImagePath, err => {
        if (err) return res.status(500).send(err);

        secretImage.mv(secretImagePath, err => {
            if (err) return res.status(500).send(err);

            // Encrypt the secret image
            let secretImageBuffer = fs.readFileSync(secretImagePath);
            let cipher = crypto.createCipher('aes-256-cbc', encryptionKey);
            let encryptedImageBuffer = Buffer.concat([cipher.update(secretImageBuffer), cipher.final()]);

            let encryptedImagePath = path.join(__dirname, 'public/uploads', 'encrypted_image.enc');
            fs.writeFileSync(encryptedImagePath, encryptedImageBuffer);

            // Embed the encrypted image
            embedImage(carrierImagePath, encryptedImagePath, outputImagePath)
                .then(() => {
                    res.download(outputImagePath);
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).send('Error embedding image');
                });
        });
    });
});

// Extract route
app.post('/extract', (req, res) => {
    let stegoImage = req.files.stegoImage;
    let decryptionKey = req.body.decryptionKey;

    if (!stegoImage || !decryptionKey) {
        return res.status(400).send('No file was uploaded or decryption key missing.');
    }

    let stegoImagePath = path.join(__dirname, 'public/uploads', 'stego_image.png');
    let extractedImagePath = path.join(__dirname, 'public/uploads', 'extracted_image.enc');
    let finalImagePath = path.join(__dirname, 'public/uploads', 'final_image.png');

    stegoImage.mv(stegoImagePath, err => {
        if (err) return res.status(500).send(err);

        // Extract the image
        extractImage(stegoImagePath, extractedImagePath)
            .then(() => {
                // Decrypt the image
                let encryptedImageBuffer = fs.readFileSync(extractedImagePath);
                let decipher = crypto.createDecipher('aes-256-cbc', decryptionKey);
                let decryptedImageBuffer = Buffer.concat([decipher.update(encryptedImageBuffer), decipher.final()]);

                fs.writeFileSync(finalImagePath, decryptedImageBuffer);

                res.download(finalImagePath);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send('Error extracting image');
            });
    });
});

app.listen(PORT, () => {
    console.log();
});
