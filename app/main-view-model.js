'use strict'

var Observable = require("data/observable").Observable;
var Image = require("ui/image");
var fs = require("file-system");

var frame = require("ui/frame");
var page = require("ui/page");
var animation = require("ui/animation");
var enums = require("ui/enums");

function createViewModel() {
    var viewModel = new Observable();
    var pathToBW = "";
    var appDir = fs.knownFolders.currentApp().path;
    var originalImage = appDir + "/zenyatta.jpg"
    viewModel.image = originalImage;
    viewModel.indicator = appDir + "/activity_indicator.png";

    var anim;
    var lbl1Anim;

    viewModel.reset = function () {
        viewModel.set("image", originalImage);
    }

    viewModel.animateLbl = function () {
        if (lbl1Anim && lbl1Anim.isPlaying) {
            lbl1Anim.cancel();

            return;
        }

        let lbl1 = getViewById("lbl1");
        lbl1Anim = new animation.Animation([{
            target: lbl1,
            rotate: 720,
            translate: { x: 100, y: 100 },
            opacity: 0.5,
            iterations: Number.POSITIVE_INFINITY,
            duration: 2000
        }, {
                target: lbl1,
                scale: { x: 3, y: 3 },
                duration: 2000,
                iterations: Number.POSITIVE_INFINITY
            }]);

        lbl1Anim.play().catch(function (e) {
            console.log('Animation failed: ' + e);
        });
    }

    viewModel.percents = 0;

    viewModel.hideLoader = true;
    viewModel.grayscaleOnWorker = function () {
        var w = new Worker("./workers/grayscaler.js");

        anim = new animation.Animation([{
            target: getViewById("img2"),
            rotate: 360,
            iterations: Number.POSITIVE_INFINITY,
            duration: 2000
        }]);

        anim.play().catch(function (e) {
            console.log('Animation failed: ' + e);
        });

        viewModel.set("percents", 0);

        w.postMessage({ src: originalImage, fileName: "zenyatta-bw.jpg", appDir: appDir });
        viewModel.set("hideLoader", false);

        w.onmessage = function (msg) {
            if (msg.data.res == "progress") {
                viewModel.set("percents", msg.data.value);
                return;
            }

            if (msg.data.res == "success") {
                pathToBW = msg.data.src;
                console.log("Inside success callback of grayscaleOnWorker : " + pathToBW);
                // w.postMessage("close");
                w.terminate();
                viewModel.set("hideLoader", true);
                viewModel.set("image", pathToBW);
                viewModel.set("percents", 100);

                anim.cancel();
            }
        }

        w.onerror = function (e) {
            console.log('Error from worker: ' + e.message);
            console.dir(e);
            anim.cancel();
            viewModel.set("percents", "Error");
        }
    }

    return viewModel;
}

function getViewById(viewId) {
    let currentPage;
    let topFrame = frame.topmost();
    currentPage = topFrame.currentPage;

    let v = currentPage.getViewById(viewId);
    return v;
}

exports.createViewModel = createViewModel;