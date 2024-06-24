const fs = require('fs');
const Jimp = require('jimp');

// Function to embed an image
async function embedImage(carrierImagePath, secretImagePath, outputImagePath) {
    const carrierImage = await Jimp.read(carrierImagePath);
    const secretImage = await fs.promises.readFile(secretImagePath);

    let secretBits = secretImage.toString('binary').split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join('');
    let pixelIndex = 0;

    carrierImage.scan(0, 0, carrierImage.bitmap.width, carrierImage.bitmap.height, function (x, y, idx) {
        if (pixelIndex < secretBits.length) {
            this.bitmap.data[idx] = (this.bitmap.data[idx] & 254) | parseInt(secretBits[pixelIndex++], 2);
        }
    });

    await carrierImage.writeAsync(outputImagePath);
}

// Function to extract an image
async function extractImage(stegoImagePath, extractedImagePath) {
    const stegoImage = await Jimp.read(stegoImagePath);
    let secretBits = [];

    stegoImage.scan(0, 0, stegoImage.bitmap.width, stegoImage.bitmap.height, function (x, y, idx) {
        secretBits.push((this.bitmap.data[idx] & 1).toString(2));
    });

    let secretBytes = [];
    for (let i = 0; i < secretBits.length; i += 8) {
        secretBytes.push(parseInt(secretBits.slice(i, i + 8).join(''), 2));
    }

    await fs.promises.writeFile(extractedImagePath, Buffer.from(secretBytes));
}

module.exports = { embedImage, extractImage };
