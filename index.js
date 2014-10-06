/**
 * Load Modules
 */
var http = require('http'),
	fs = require('fs'),
	events = require('events'),
	emitter = new events.EventEmitter(),
	Notification = require('node-notifier')
;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Local Variables
 */
var options = {
	url:    'http://sirocco.accuweather.com/adc_images2/english/feature/400x300/worstwx.jpg',
	log:    __dirname + '/last-modified.txt',
	images: __dirname + '/images'
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Local Last Modified Time
 */
function getLocalModified() {
	fs.exists(options.log, function(exists) {
		if ( ! exists ) {
			emitter.emit('localModified', exists);
			return;
		}

		fs.readFile(options.log, 'utf8', function(error, data) {
			if (error) {
				return console.log(error);
			}

			emitter.emit('localModified', data);
		});
	});
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Remote Last Modified Time
 *
 * @param string|bool modified
 */
emitter.on('localModified', function(modified) {
	http.get(options.url, function(response) {
		if ( modified === response.headers['last-modified'] ) return;

		writeImage(response);
		updateLocal(response.headers['last-modified']);
	}).on('error', function(error) {
		console.log(error);
	});
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Update Local Last Modified
 *
 * @param string modified
 */
function updateLocal(modified) {
	fs.writeFile(options.log, modified, function(error) {
		if (error) return console.log(error);
	});
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Write Remote Image to Local Directory
 *
 * @param object response
 */
function writeImage(response) {
	var imagedata = '',
		now = new Date(),
		filename = now.getFullYear() + '_' + (now.getMonth() + 1) + '_' + now.getDate() + '.jpg'
	;

	if ( ! fs.existsSync(options.images) ) {
		fs.mkdirSync(options.images);
	}

	response.setEncoding('binary');

	response.on('data', function(chunk) {
		imagedata += chunk;
	});

	response.on('end', function() {
		fs.writeFile(options.images + '/' + filename, imagedata, 'binary', function(error){
			if (error) return console.log(error);

			emitter.emit('newImage', options.images + '/' + filename);
		});
	});
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Send Notification
 */
emitter.on('newImage', function(image) {
	var notifier = new Notification();

	notifier.notify({
		title:       'AccuWeather',
		message:     'Today’s Worst Weather',
		contentImage: image,
		appIcon:      __dirname + '/accuweather.png',
		open:         'file://' + image
	});
});

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Init
 */
getLocalModified();