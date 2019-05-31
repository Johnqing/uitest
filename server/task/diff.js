const compareImages = require("resemblejs/compareImages");
const path = require('path');
const fs = require('fs');
module.exports = async function getDiff(uifile, screenshot) {
    const options = {
        output: {
            errorColor: {
                red: 255,
                green: 0,
                blue: 255
            },
            errorType: "movement",
            transparency: 0.3,
            largeImageThreshold: 1200,
            useCrossOrigin: false,
            outputDiff: true
        },
        scaleToSameSize: true,
        ignore: "antialiasing"
    };

    // The parameters can be Node Buffers
    // data is the same as usual with an additional getBuffer() function
    const data = await compareImages(
        await fs.readFileSync(uifile),
        await fs.readFileSync(screenshot),
        options
    );

    const filename = path.dirname(screenshot);
    await fs.writeFileSync(path.resolve(filename, 'result.png'), data.getBuffer());
    return JSON.stringify(data);
}
