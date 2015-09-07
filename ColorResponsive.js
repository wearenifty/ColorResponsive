/**
 * Created by davidchiu on 9/5/15.
 *
 * Requires jQuery
 */
(function (root, factory) {

    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.ColorResponsive = factory(root);
    }

}(this, function () {

    'use strict';

    var options;
    var canvas;
    var context;
    var backgroundElement;
    var hasImage = true;


    function getBackground(selector) {
        var background;

        backgroundElement = document.elementFromPoint($(selector).position().left, $(selector).height()+1);
        var backgroundImage = $(backgroundElement).css('backgroundImage');
        var backgroundSize = $(backgroundElement).css('backgroundSize');

        if (backgroundImage == 'none') {

            var backgroundColor = $(backgroundElement).css('backgroundColor');

            background = backgroundColor.split('(')[1].split(')')[0].replace(/ /g, '');

            hasImage = false;

        } else {

            background = backgroundImage.replace('url(', '').replace(')', '');

        }

        return background;
    }


    function checkColorThreshold(color) {
        var rgbThresholdValues = /[0-9].*[0-9]/.exec(options.threshold)[0].split(',');
        var rgbBackgroundValues = color.split(',');

        if (rgbBackgroundValues[0] > rgbThresholdValues[0] && rgbBackgroundValues[1] > rgbThresholdValues[1] && rgbBackgroundValues[2] > rgbThresholdValues[2]) {
            $('.app-bar').addClass('background--light');
            $('.app-bar').removeClass('background--dark');
        } else {
            $('.app-bar').addClass('background--dark');
            $('.app-bar').removeClass('background--light');
        }

    }

    /*
     * Get Bounding Client Rect
     */
    function getArea(obj) {
        var area;
        var image;
        var parent;

        if (obj.nodeType) {
            var rect = obj.getBoundingClientRect();

            // Clone ClientRect for modification purposes
            area = {
                left: rect.left,
                right: rect.right,
                top: rect.top,
                bottom: rect.bottom,
                width: rect.width,
                height: rect.height
            };

            parent = obj.parentNode;
            image = obj;
        } else {
            area = calculateAreaFromCSS(obj);
            parent = obj.el;
            image = obj.img;
        }

        parent = parent.getBoundingClientRect();

        area.imageTop = 0;
        area.imageLeft = 0;
        area.imageWidth = image.naturalWidth;
        area.imageHeight = image.naturalHeight;

        var ratio = area.imageHeight / area.height;
        var delta;

        // Stay within the parent's boundary
        if (area.top < parent.top) {
            delta = parent.top - area.top;
            area.imageTop = ratio * delta;
            area.imageHeight -= ratio * delta;
            area.top += delta;
            area.height -= delta;
        }

        if (area.left < parent.left) {
            delta = parent.left - area.left;
            area.imageLeft += ratio * delta;
            area.imageWidth -= ratio * delta;
            area.width -= delta;
            area.left += delta;
        }

        if (area.bottom > parent.bottom) {
            delta = area.bottom - parent.bottom;
            area.imageHeight -= ratio * delta;
            area.height -= delta;
        }

        if (area.right > parent.right) {
            delta = area.right - parent.right;
            area.imageWidth -= ratio * delta;
            area.width -= delta;
        }

        area.imageTop = Math.floor(area.imageTop);
        area.imageLeft = Math.floor(area.imageLeft);
        area.imageHeight = Math.floor(area.imageHeight);
        area.imageWidth = Math.floor(area.imageWidth);

        return area;
    }

    function drawImage(backgroundUrl) {
        var image = new Image();

        image.src = backgroundUrl;

        canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0px';
        canvas.style.left = '0px';
        canvas.width = document.body.clientWidth;
        canvas.height = window.innerHeight;


        context = canvas.getContext('2d');

        console.log(image)
        var area = getArea(image);
    }

    function checkBackground(background) {
        if (hasImage) {
            $(options.target)
        } else {
            checkColorThreshold(background);
        }
    }

    function init(_options) {

        options = _options;


        if (options.target === undefined || options.threshold === undefined ) {
            throw('Missing target and threshold options')
        }

        var background = getBackground(options.target);

        if (background == $(options.target).data('background')) {
            return;
        } else {
            $(options.target).data('background', background);
            console.log($(options.target).data('background'))

            checkBackground(background);
        }

    }

    return {
        /*
         * Init and destroy
         */
        init: init,
        //destroy: destroy,
        //
        ///*
        // * Expose main function
        // */
        //refresh: check,
        //
        ///*
        // * Setters and getters
        // */
        //set: set,
        //get: get,
        //
        ///*
        // * Return image data
        // */
        //getImageData: getImageData
    };

}));
