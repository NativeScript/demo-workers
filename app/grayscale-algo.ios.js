function toGrayScale(bitmapSrc, bitmapDest, appDir, progressCallback) {
    var destinationOutputPath = NSString.stringWithString(appDir).stringByAppendingPathComponent(bitmapDest);

    var image = UIImage.imageWithContentsOfFile(bitmapSrc);
    var actualWidth = image.size.width;
    var actualHeight = image.size.height;
    var imageRect = CGRectMake(0, 0, actualWidth, actualHeight);
    var colorSpace = CGColorSpaceCreateDeviceGray();

    var context = CGBitmapContextCreate(null, actualWidth, actualHeight, 8, 0, colorSpace, kCGImageAlphaNone);
    CGContextDrawImage(context, imageRect, image.CGImage);
    var grayImage = CGBitmapContextCreateImage(context);

    var alphaContext = CGBitmapContextCreate(null, actualWidth, actualHeight, 8, 0, null, kCGImageAlphaOnly);
    CGContextDrawImage(alphaContext, imageRect, image.CGImage);
    var mask = CGBitmapContextCreateImage(alphaContext);

    var grayScaleImage = UIImage.imageWithCGImageScaleOrientation(CGImageCreateWithMask(grayImage, mask), image.scale, image.imageOrientation);
    var grayScaleImageBinary = UIImagePNGRepresentation(grayScaleImage);
    grayScaleImageBinary.writeToFileAtomically(destinationOutputPath, true);

    //CGColorSpaceRelease(colorSpace);
    //CGContextRelease(context);
    //CGContextRelease(alphaContext);
    //CGImageRelease(grayImage);
    //CGImageRelease(mask);

    return destinationOutputPath;
}

module.exports.ToGrayscale = toGrayScale;