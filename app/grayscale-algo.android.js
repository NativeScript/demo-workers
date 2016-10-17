function grayScaleImage(bitmap, fileName, appDir, progressCallback) {
    var Bitmap = android.graphics.Bitmap;
    var Color = android.graphics.Color;

    var w = bitmap.getWidth();
    var h = bitmap.getHeight();

    var bitmapOut = Bitmap.createBitmap(w, h, bitmap.getConfig());

    var A, R, G, B;
    var px;

    var RedFactor = 0.299;
    var GreenFactor = 0.587;
    var BlueFactor = 0.114;

    var portion = Math.floor(w / 100);
    var currPart = 0;

    for (var x = 0; x < w; ++x) {
        for (var y = 0; y < h; ++y) {
            px = bitmap.getPixel(x, y);
            A = Color.alpha(px);

            /*
             * Apply filter contrast for every channel (R, G, B);
             */
            R = Color.red(px);
            G = Color.green(px);
            B = Color.blue(px);

            var transformedPx = Math.round(RedFactor * R + GreenFactor * G + BlueFactor * B);
            bitmapOut.setPixel(x, y, Color.argb(A, transformedPx, transformedPx, transformedPx));
        }

        if (x % portion == 0) {
            ++currPart;
            progressCallback(currPart);
        }
    }

    return saveToFile(fileName, bitmapOut, appDir);
}

function saveToFile(fileName, bmp, appDir) {
    var CompressFormat = android.graphics.Bitmap.CompressFormat;
    var FileOutputStream = java.io.FileOutputStream;
    var File = java.io.File;

    var pathOnDevice = appDir;

    var path = pathOnDevice;

    console.log('Saving file to: ' + path);

    var file = new File(path, fileName);
    var resultP = file.getAbsolutePath();

    console.log('Abs file path: ' + resultP);

    try {
        var out = new FileOutputStream(resultP);
        bmp.compress(CompressFormat.PNG, 10, out);
        out.flush();
        out.close();
    } catch (e) {
        console.log('Failed to save image to file: ' + e.toString());

        return null;
    }

    console.log('Saved image to file: ' + resultP);


    return resultP;
}

function toGrayScale(bitmapSrc, fileName, appDir, progressCallback) {
    var File = java.io.File;
    var BitmapFactory = android.graphics.BitmapFactory;

    console.log('bitmapSrc: ' + bitmapSrc);

    var f = new File(bitmapSrc);
    if (!f.exists()) { return null; }

    var bitmap = BitmapFactory.decodeFile(bitmapSrc);

    return grayScaleImage(bitmap, fileName, appDir, progressCallback);
}

module.exports.ToGrayscale = toGrayScale;