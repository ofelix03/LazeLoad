(function($, window){


	const threshold = {
		FULL: "full",
		HALF: "half",
	}

	function LazeLoad(selector, options) {
		o = this;

		o.images = $(selector);
		o.window = $(window);
		o.document = $(document); 
		o.windowDimension = {
			height: null,
			width: null
		};

		o.defaultOptions = {
			/** @todo CSS3 Transition would be added in later versions */
			effect: null,
			delay: 0,
			/** Callback Function called after an image has been loaded */
			afterImageLoad: null,

			/** Callback Function called before an image is loaded */
			beforeImageLoad: null,

			/** The point at which an image should be loaded
			*  	Possible Values: full|half|Npx
			**/
			threshold: "full",
			placeholder: "data:image/png;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAQAAAAAAAAAAAAAAAAAAAAAA8J8HasaIBWRZAAAAAElFTkSuQmCC"
		};

		o.options = $.extend({}, this.defaultOptions, options);

		o.init();
	}

	LazeLoad.prototype = {
		init: init,
		isImageInFocus: isImageInFocus,
		configureParameters: configureParameters,
		setLoadedState: setLoadedState,
		loadImagesInFocus: loadImagesInFocus,
	}


	/**
	 * This method is what's start the actual magic
	 */
	 function init() {
	 	var src, $image;

	 	o.configureParameters();

	 	o.images.each(function(){
	 		$image = $(this);

			// Let set the load state for all images to false, meaning all images
			// are still using the placeholder.
			$image.attr('src', o.options.placeholder)
			o.setLoadedState($image, false)
		})

	 	o.loadImagesInFocus();
	 }

	/**
	 * Determines whether an image element is in the window's view or  not
	 * 
	 * @param  {jQuery}  $image 
	 * @return {Boolean}      
	 */
	 function isImageInFocus($image) {
	 	var imageOffset = $image.offset();
	 	var imageOffsetFromWindowTop = imageOffset.top - o.window.scrollTop();
		/**
		* @todo  Later I will apply the loadImage base on parametes configured by user
		*/
		
		if (o.options.threshold == threshold.FULL) {
			if ((imageOffsetFromWindowTop + $image.height()) <= o.windowDimension.height) 
				return true;
			else
				return false;	
		} else if (o.options.threshold == threshold.HALF) {
			if ((imageOffsetFromWindowTop + ($image.height() / 2)) <= o.windowDimension.height)	
				return true;
			else
				return false;
		} else if (typeof o.options.threshold == "number") {
			if ((imageOffsetFromWindowTop + o.options.threshold) <= o.windowDimension.height)
				return true;
			else
				return false;
		}


	}


	function configureParameters() {
		o.windowDimension = {
			width: o.window.width(),
			height: o.window.height(),
		}
	}


	/**
	 * Sets the data-loaded attr of image to true/false to indicate whether the original 
	 * image resource has been loaded already
	 * 
	 * @param {jQuery} $image    A jquery image object
	 * @param {boolean} loadState A boolean value of either true|false
	 */
	 function setLoadedState($image, loadState) {
	 	if (loadState === undefined) {
	 		loadState = false
	 	}

	 	$image.data('loaded', loadState)
	 }

	/**
	 * This loads all images in the window's vocal point. It's runs when the 
	 * document is first loaded and each time the window/document is scrolled
	 */
	 function loadImagesInFocus() {
	 	o.images.each(function(){
	 		$image = $(this);

	 		if (o.isImageInFocus($image)) {
				// Let load the actual image
				
				// Before we load the image in focus, let see if plugin user has set a beforeImageLoad
				// callback function
				if (o.options.beforeImageLoad !== null) {
					o.options.beforeImageLoad.call(this, $image);
				}

				src = $image.data('src')
				$image.attr('src', src);
				// Let set the load state on the image, so we do not end up loading it over and over again
				// each time it's brought into focus
				o.setLoadedState($image, true)

				// Now that image has been loaded, let check if plugin user has set a afterLoadImage callback
				// function
				if (o.options.afterImageLoad !== null) {
					o.options.afterImageLoad.call(this, $image)
				}
			}
		})

	 	o.window.scroll(function(){
	 		o.images.each(function(){
	 			$image = $(this);

	 			if (o.isImageInFocus($image)) {
					// Let load the actual image
					
					// Before we load the image in focus, let see if plugin user has set a beforeImageLoad
					// callback function
					if (o.options.beforeImageLoad !== null) {
						o.options.beforeImageLoad.call(this, $image);
					}

					src = $image.data('src')
					$image.attr('src', src);

					// Let set the load state on the image, so we do not end up loading it over and over again
					// each time it's brought into focus
					o.setLoadedState($image, true)

					// Now that image has been loaded, let check if plugin user has set a afterLoadImage callback
					// function
					if (o.options.afterImageLoad !== null) {
						o.options.afterImageLoad.call(this, $image)
					}
				}
			});
	 	});
	 }


    // Attaching to jQuery as a plugin
    if ($ !== undefined) {
    	// console.log('laze load', new LazeLoad("img"))
    	$.fn.lazeload = function(options){
	    	return new LazeLoad(this, options);
    	}
    }

    // Attaching it to the global Object
    if (window !== undefined) {
    	window.LazeLoad = LazeLoad;
    }

})(jQuery, window);


