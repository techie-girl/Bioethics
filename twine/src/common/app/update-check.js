/**
 Checks for a newer version of the Twine app against
 https://twinery.org/latestversion/2.json, using build numbers which
 are automatically generated by Grunt.

 If retrieving this information fails, then this does nothing.

 This is separated from the app component to avoid a circular dependency.

 @method checkForUpdate
 @param {Number} latestBuildNumber build number to consider as current.
	This is required; the app's build number is stored in
	store.appInfo.buildNumber.
 @param {Function} callback if a new version is available, this is called
	 with an object with the properties buildNumber, the newest release's
	 build number, version, the human-readable version number, and url, the
	 URL the download is available at.
**/

const $ = require('jquery');

module.exports = function(latestBuildNumber, callback) {
	$.getJSON('https://twinery.org/latestversion/2.json', data => {
		if (data.buildNumber > latestBuildNumber) {
			callback(data);
		}
	});
};
