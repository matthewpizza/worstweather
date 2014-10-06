/**
 * Check If Image Path Exists
 */
var http = require('http'),
	url = 'http://sirocco.accuweather.com/adc_images2/english/feature/400x300/worstwx.jpg'
;

http.get(url, function(response) {
	if (response.statusCode == '200') return;
	throw new Error(response.statusCode);
}).on('error', function(error) {
	throw error;
});