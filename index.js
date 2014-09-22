/**
 * Load Modules
 */
var http = require('http'),
	fs =   require('fs')
;

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Local Variables
 */
var options = {
	url:    'http://sirocco.accuweather.com/adc_images2/english/feature/400x300/worstwx.jpg',
	log:    'last-modified.txt',
	images: 'images'
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Local Last Modified Time
 *
 * @param function callback
 */
function local_modified( callback ) {
	fs.exists(options.log, function(exists) {
		if ( ! exists ) {
			callback( exists );
			return;
		}

		fs.readFile(options.log, 'utf8', function(error, data) {
			if (error) {
				return console.log(error);
			}

			callback( data );
		});
	});
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Remove Last Modified Time
 *
 * @param string|bool modified
 */
function remote_modified( modified ) {
	http.get(options.url, function(response) {
		if ( modified === response.headers['last-modified'] ) return;

		write_image(response);
		update_local(response.headers['last-modified']);
	}).on('error', function(error) {
		console.log(error);
	});
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Update Local Last Modified
 *
 * @param string modified
 */
function update_local( modified ) {
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
function write_image( response ) {
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
		});
	});
}

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

/**
 * Init
 */
 local_modified( remote_modified );