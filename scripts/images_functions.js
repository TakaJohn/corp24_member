//profile pic transfer: base64 image
$(document).on("click", "#profile_pic", function(e) {
	navigator.camera.getPicture(
		profile_pic_success(imageURI), 
		profile_pic_fail(message), 
		{
			if(device.platform == "Android" || device.platform == "android"){
				quality : 100,
				destinationType : navigator.camera.DestinationType.DATA_URI,
				sourceType : navigator.camera.PictureSourceType.PHOTOLIBRARY,
				encodingType: Camera.EncodingType.JPEG
			}
			
			if(device.platform == "iOS"){
				quality : 45,
				destinationType : navigator.camera.DestinationType.DATA_URI,
				sourceType : navigator.camera.PictureSourceType.PHOTOLIBRARY,
				encodingType: Camera.EncodingType.JPEG
			}			
		});
	e.preventDefault();
});

//profile pic success fails
function profile_pic_success(imageURI){
	$("#profile_pic").html("<p align='center'><img width='150px' src='data:image/gif;base64," + imageURI + "' align='center' /> <span id='upload_result'></span></p>");
	//update form profile pic field
	$("#profile_pic_uri").val(imageURI);
}

function profile_pic_fail(message){
	$("#profile_pic").html("<p align='center'><img src='images/profile_pic.png' align='center' /> Unable to retrive picture. Please try again.</p>");
}


//*********************************************************************************************************************************************************************//

//image file transfer: image uri
$(document).on("click", "#image_transfer", function(e) {
	navigator.camera.getPicture(
		image_transfer_success(imageURI), 
		image_transfer_fail(message), 
		{
			if(device.platform == "Android" || device.platform == "android"){
				quality : 100,
				destinationType : navigator.camera.DestinationType.FILE_URI,
				sourceType : navigator.camera.PictureSourceType.PHOTOLIBRARY,
				encodingType: Camera.EncodingType.JPEG
			}
			
			if(device.platform == "iOS"){
				quality : 45,
				destinationType : navigator.camera.DestinationType.FILE_URI,
				sourceType : navigator.camera.PictureSourceType.PHOTOLIBRARY,
				encodingType: Camera.EncodingType.JPEG
			}		
		});
	e.preventDefault();
});

//image success fail: file transfer
function image_transfer_success(imageURI){
	$("#image_transfer__pic").html("<p align='center'><img width='150px' src='" + imageURI + "' align='center' /> <span id='upload_result'>Uploading to server<br>Please wait...</span></p>");
	var options = new FileUploadOptions();
	options.fileKey = "file";
	options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
	options.mimeType = "image/jpeg";
	options.headers = {
		Connection : "close"
	};

	var unique_id = user_contract_number + "_" + generateUUID();
	var params = new Object();
	params.contract_number = user_contract_number;
	params.suffix = user_suffix;
	params.unique_id = unique_id;

	options.params = params;
	options.chunkedMode = false;

	var ft = new FileTransfer();
	ft.upload(imageURI, encodeURI(uniUrl + "upload_profile_picture.php"), upload_picture_success, upload_picture_error, options);
}

function image_transfer_fail(message){
	$("#image_transfer__pic").html("<p align='center'><img src='images/profile_pic.png' align='center' /> Unable to retirve picture. Please try again.</p>");
}


