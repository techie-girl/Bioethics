/**
 Saves data to a file. This appears to the user as if they had clicked a link
 to a downloadable file in their browser. If no failure method is specified,
 then this will show a UI notification when errors occur.

 @module file/save
 @param {String} data data to save
 @param {String} filename filename to save to
 @param {Function} success callback function on a successful save, optional
 @param {Function} failure callback function on a failed save (passed error),
	optional
**/

'use strict';
const $ = require('jquery');
const JSZip = require('jszip');
const saveAs = require('browser-saveas');
const locale = require('../locale');
const notify = require('../ui/notify');

//adding a file writer for writing the html file to our twine page
//this file will be moved within the server once the file has been written
//Added fs and mv modules to the twine modules

//file mover
//const mv = require('mv');


require('blob-polyfill');

//data, filename, and download are all input variables, success and failure are both callback functions (as far as i can tell)

module.exports = (data, filename, download, success, failure) => {
	
	
	//if not download then the user wants to upload it to the server and add an entry to the database
	if(!download){
		try {
							
            // Pull the CSRF token from Django so that the POST request
            // can go through securely.
            var csrf_token = $("#csrf-token > input").attr("value");
            console.log(csrf_token);

			//ajax call for sending Twine story and passes in the filename and the html code to an API 
			$.ajax({
				type:'post',
				url: 'http://bioethics.dev/case/create/',
				async:false,
				data:{'filename':filename,
                'html':data, 
                'csrfmiddlewaretoken': csrf_token},
				success: function(data){						
					alert("Saved story successfully.\n You may now publish the case from its edit page.");
					passed = true;
				},
				error: function(err){
					alert("Failed to save story!\n" + err.responseText);
					passed = false;
				}
			});						
				

			if (success) {
				success();
			}
		}
		
		catch (e) {
			if (failure) {
				failure(e);
			}
			else {
				// L10n: %1$s is a filename; %2$s is the error message.
				notify(
					locale.say(
						'&ldquo;%1$s&rdquo; could not be saved (%2$s).',
						filename,
						e.message
					),
					'danger'
				);
			}
		};
		
	}
	
	//if they want it downloaded then use the Twine default download operation
	else{
		
		try {
			const $b = $('body');

			if (!$b.hasClass('iOS')) {
				// standard style

				const blob = new Blob([data], { type: 'text/html;charset=utf-8' });

				// Safari requires us to use saveAs in direct response
				// to a user event, so we punt and use a data: URI instead
				// we can't even open it in a new window as that seems to
				// trigger popup blocking

				if ($b.hasClass('safari')) {
					window.location.href = URL.createObjectURL(blob);
				}
				else {
					//alert("saving/not-saving");
					saveAs(blob, filename);					
				}

				if (success) {
					success();
				}
			}
			else {
				// package it into a .zip; this will trigger iOS to try to
				// hand it off to Google Drive, Dropbox, and the like

				const zip = new JSZip();

				zip.file(filename, data);
				window.location.href =
					'data:application/zip;base64, ' +
					zip.generate({ type: 'base64' });

				if (success) {
					success();
				}
			};
		}
		catch (e) {
			if (failure) {
				failure(e);
			}
			else {
				// L10n: %1$s is a filename; %2$s is the error message.
				notify(
					locale.say(
						'&ldquo;%1$s&rdquo; could not be saved (%2$s).',
						filename,
						e.message
					),
					'danger'
				);
			}
		};
	}
};
