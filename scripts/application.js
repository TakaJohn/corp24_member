/*DEVICE READY*/
//var uniUrl = "http://10.0.2.2/corporate_24/mobile/member_mobile/";
var uniUrl = "http://bouldercorp.com/jcb/corporate_24/member_mobile/";

$(document).bind("mobileinit", function() {
  $.support.cors = true;
  $.mobile.allowCrossDomainPages = true;
//$.ajaxEnabled = false;
});

var isPhoneGapReady = false;

var isAndroid = false;
var isBlackberry = false;
var isIphone = false;
var isWindows = false;

// NETWORK STATUS
var isConnected = false;
var isHighSpeed = false;
var internetInterval;

var currentUrl;

var user_ID, profile_pic, user_contract_number, user_suffix, num_dependance, user_title, user_initials, user_name, user_surname, user_gender, user_birthdate, user_idnumber, user_address, user_area, user_city, user_province, user_phone, user_email, user_push_token, change_password;
var pushNotification, latestMessage;
var database_setup;

//UNIQUE IDENTIFIER
function generateUUID(){
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x7|0x8)).toString(16);
	});
	return uuid;
}

function init(url) {
	if ( typeof url != 'string') {
		currentUrl = location.href;
	} else {
		currentUrl = url;
	}
	if (isPhoneGapReady) {
		onDeviceReady();
	} else {
		// Add an event listener for deviceready
		document.addEventListener("deviceready", onDeviceReady, false);
	}
}

function onDeviceReady() {
	isPhoneGapReady = true;
	userVariables();	
	if(database_setup == "" || database_setup == null){
		dbSetup();
	}	
	
	if(isConnected){
		if(user_push_token == "" || user_push_token == null){
			pushSetup();
		}
	}
	
	navigator.splashscreen.hide();
	console.log("phonegap ready");

	deviceUUID = device.uuid;
	deviceDetection();
	networkDetection();
	
	document.addEventListener("online", onOnline, false);
	document.addEventListener("offline", onOffline, false);
	
	executeEvents();
	executeCallback();
}

function userVariables(){
	user_ID = window.localStorage.getItem("user_ID");
	profile_pic = window.localStorage.getItem("profile_pic");
	database_setup = window.localStorage.getItem("database_setup"); 
	user_contract_number = window.localStorage.getItem("user_contract_number");
	user_suffix = window.localStorage.getItem("user_suffix");
	user_title = window.localStorage.getItem("user_title");
	user_initials = window.localStorage.getItem("user_initials");
	user_name = window.localStorage.getItem("user_name");
	user_surname = window.localStorage.getItem("user_surname"); 
	
	user_gender = window.localStorage.getItem("user_gender");  
	user_birthdate = window.localStorage.getItem("user_birthdate");
	user_idnumber = window.localStorage.getItem("user_idnumber"); 
	  
	user_address = window.localStorage.getItem("user_address"); 
	user_area = window.localStorage.getItem("user_area");
	user_city = window.localStorage.getItem("user_city"); 
	user_province = window.localStorage.getItem("user_province");
	user_phone = window.localStorage.getItem("user_phone");
	user_mobile = window.localStorage.getItem("user_mobile");
	user_email = window.localStorage.getItem("user_email");
	user_push_token = window.localStorage.getItem("user_push_token");
	
	change_password = window.localStorage.getItem("change_password"); 
}

function executeEvents() {
	if (isPhoneGapReady) {		
		// attach events for online and offline detection
		document.addEventListener("online", onOnline, false);
		document.addEventListener("offline", onOffline, false);
		// attach events for pause and resume detection
		document.addEventListener("pause", onPause, false);
		document.addEventListener("resume", onResume, false);
	}
}

function executeCallback() {
	if (isPhoneGapReady) {
		// get the name of the current html page
		var pages = currentUrl.split("/");
		var currentPage = pages[pages.length - 1].slice(0, pages[pages.length - 1].indexOf(".html"));
		// capitalize the first letter and execute the function
		currentPage = currentPage.charAt(0).toUpperCase() + currentPage.slice(1);
		if ( typeof window['on' + currentPage + 'Load'] == 'function') {
			window['on' + currentPage + 'Load']();
			console.log("Page: "+currentPage);
		}
	}
}

function deviceDetection() {
	if (isPhoneGapReady) {
		switch (device.platform) {
			case "Android":
				isAndroid = true;
				break;
			case "Blackberry":
				isBlackberry = true;
				break;
			case "iPhone":
				isIphone = true;
				break;
			case "WinCE":
				isWindows = true;
				break;
		}
	}
}

function networkDetection() {
	if (isPhoneGapReady) {
		if (navigator.connection.type != Connection.NONE) {
			isConnected = true;
		}

		// determine whether this connection is high-speed
		switch (navigator.connection.type) {
			case Connection.UNKNOWN:
			case Connection.CELL_2G:
				isHighSpeed = false;
				break;
			default:
				isHighSpeed = true;
				break;
		}
	}
}

function onOnline() {
	isConnected = true;
}

function onOffline() {
	isConnected = false;
}

function onPause() {
	isPhoneGapReady = false;
	// clear the Internet check interval
	window.clearInterval(internetInterval);
}

function onResume() {
	// don't run if phonegap is already ready
	if (isPhoneGapReady == false) {
		init(currentUrl);
	}
}

function alertDismissed() {
        // do something
}

function showAlert(message, title, btn) {
	navigator.notification.alert(		
		message,  			// message
       	alertDismissed,    	// callback
        title,              // title
        btn                // buttonName
    );
}

function loadingShow(){
	$( '.processing' ).show();
}

function loadingHide(){
	$( '.processing' ).hide();
}

function validateEmail(sEmail) {
    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (filter.test(sEmail)) {
        return true;
    }
    else {
        return false;
    }
}

function login_logout(user_ID){
	if(user_ID == "" || user_ID == null){
		$(".login-content").show();
		window_redirect("login");
	}else{
		$(".logout-content").show();
		$("#register_page").hide();
	}
}

function form_err_message(err){
	$(".static-notification-red p").html(err);
	$(".static-notification-red").show();
	setTimeout(function(){
		$(".static-notification-red p").html("");
		$(".static-notification-red").hide();
	}, 15000);	
}

function form_success_message(err){
	$(".static-notification-green p").html(err);
	$(".static-notification-green").show();
	setTimeout(function(){
		$(".static-notification-red p").html("");
		$(".static-notification-red").hide();
	}, 15000);
}

function form_note_message(err){
	$(".static-notification-blue p").html(err);
	$(".static-notification-blue").show();	
}

function window_redirect(location){
	window.location.replace(location+".html");
}

function logout_user_variables(){
	window.localStorage.setItem("user_ID", ""); 
	window.localStorage.setItem("profile_pic_uploaded", "");
	window.localStorage.setItem("profile_pic", ""); 
	window.localStorage.setItem("num_dependance", "")
	window.localStorage.setItem("user_contract_number", "");
	window.localStorage.setItem("user_suffix", "");
	window.localStorage.setItem("user_title", "");
	window.localStorage.setItem("user_initials", "");
	window.localStorage.setItem("user_name", "");
	window.localStorage.setItem("user_surname", ""); 
	
	window.localStorage.setItem("user_gender", "");  
	window.localStorage.setItem("user_birthdate", "");
	window.localStorage.setItem("user_idnumber", ""); 
	  
	window.localStorage.setItem("user_address", ""); 
	window.localStorage.setItem("user_city", ""); 
	window.localStorage.setItem("user_area", ""); 
	window.localStorage.setItem("user_province", "");
	window.localStorage.setItem("user_phone", "");
	window.localStorage.setItem("user_mobile", "");
	window.localStorage.setItem("user_email", "");
}

function retrieve_news(user_ID) {
	$last_news_date = "";
	$.getJSON(uniUrl+"retrieve_messages.php", {last_news_date:last_news_date, user_ID:user_ID},function(data) {
		var i = 1, listData = ""; 
		if(data !== ""){
			$.each(data, function(k, v) { 
				save_message(v.title,v.body,v.date);           	
            	listData += "<h4 class='left-text'>"+data.title+"</h4>";
                listData += "<p class='left-text'>";
                    listData += data.body;
                listData += "</p>";
            });
            $("#latest_news").html(listData);
            $("")	 
		}
                    
        				
    }).fail(function() {
		showAlert("Unable to load you medical transactions.\nNo data service connection.\n", "Medical Transactions", "Close");
	});
}

function onIndexLoad() {		
	userVariables();
	if(user_ID == "" || user_ID == null){
		$(".login-content").show();
	}else{
		$(".logout-content").show();
		$("#register_page").hide();
	}
	
	if(change_password == 1){
		showAlert("This is the first time you logged in to your Corporate 24 Account\nPlease change your password to one that is more personal.", "Change password", "Close");
		window_redirect("changepass");
	}
	
	$(document).on("click", ".logout-content", function(){
		logout_user_variables();
		window_redirect("index");		
		showAlert("You have successfully logged out of your account", "Logout", "Close");		
		return false;
	});	
}

function onLoginLoad() {
	userVariables();
	$('#login_account').submit(function(e) {	
		loadingShow();
		
		var err = "",
		post_username = $("#username").val(),
		post_suffix = $("#suffix").val(),
		post_password = $("#password").val();
		var postData = $("#login_account").serialize();
		
		if(post_username == "") { 
			err = "Please fill in your username";
		}
		
		if(post_suffix == "") { 
			err = "Please fill in your member suffix";
		}
		
		if(post_password == "") { 
			err = "Please fill in your login password";
		}
		
		if(err == ""){
			if (isConnected) {
			$.post(uniUrl+"login.php", postData, function(data){
				loadingHide();
				if(data.login_status == "yes"){
					showAlert("Welcome "+data.title+" "+data.name+" "+data.surname,"Login","Close");
					window.localStorage.setItem("user_ID", data.ID); 
					window.localStorage.setItem("profile_pic", data.profile_pic); 
					window.localStorage.setItem("num_dependance", data.num_dependance);
					window.localStorage.setItem("user_contract_number", data.contract_number);
					window.localStorage.setItem("user_suffix", data.suffix);
					window.localStorage.setItem("user_title", data.title);
					window.localStorage.setItem("user_initials", data.initials);
					window.localStorage.setItem("user_name", data.name);
					window.localStorage.setItem("user_surname", data.surname); 
					
					window.localStorage.setItem("user_gender", data.gender);  
					window.localStorage.setItem("user_birthdate", data.birthdate);
					window.localStorage.setItem("user_idnumber", data.id_number); 
					  
					window.localStorage.setItem("user_address", data.address); 
					window.localStorage.setItem("user_city", data.city); 
					window.localStorage.setItem("user_area", data.area); 
					window.localStorage.setItem("user_province", data.province);
					window.localStorage.setItem("user_phone", data.phone);
					window.localStorage.setItem("user_mobile", data.mobile);
					window.localStorage.setItem("user_email", data.email);							
					
					window_redirect("index");		
				}
				
				if(data.login_status == "changepass"){
					showAlert("This is your first time loging into your Corporate 24 Account.\nPlease change your login password","Login","Close");
					
					window.localStorage.setItem("user_ID", data.ID); 
					window.localStorage.setItem("profile_pic", data.profile_pic);
					window.localStorage.setItem("user_contract_number", data.contract_number);
					window.localStorage.setItem("user_suffix", data.suffix);
					window.localStorage.setItem("user_title", data.title);
					window.localStorage.setItem("user_initials", data.initials);
					window.localStorage.setItem("user_name", data.name);
					window.localStorage.setItem("user_surname", data.surname); 
					
					window.localStorage.setItem("user_gender", data.gender);  
					window.localStorage.setItem("user_birthdate", data.birthdate);
					window.localStorage.setItem("user_idnumber", data.id_number); 
					  
					window.localStorage.setItem("user_address", data.address); 
					window.localStorage.setItem("user_city", data.city);
					window.localStorage.setItem("user_area", data.area); 
					window.localStorage.setItem("user_province", data.province);
					window.localStorage.setItem("user_phone", data.phone);
					window.localStorage.setItem("user_mobile", data.mobile);
					window.localStorage.setItem("user_email", data.email);
					window.localStorage.setItem("change_password", 1);
					
					window_redirect("changepass");	
				}
				
				if(data.login_status == "no"){
					form_err_message(data.errormsg);
					//showAlert(data.errormsg,"Login","Close");
				}
				
			},"json").fail(function(data) {
				loadingHide();
				form_err_message("Account login failed. Please make sure you are connected to a data service.");
				//showAlert("Account login failed.\nPlease make sure you are connected to a data service.\n", "login", "Close");
			});
			}else{
				loadingHide();
				showAlert("You are currently offline. Login failed", "Alert", "Close");
			}
		}else{
			loadingHide();
			form_err_message(err);
			//showAlert(err, "Login", "Close");
		}	
		
		e.preventDefault();
		return false;
	});

	$(document).on("click", ".logout-content", function(){
		logout_user_variables();
		window_redirect("index");		
		showAlert("You have successfully logged out of your account", "Logout", "Close");		
		return false;
	});
}

function onChangepassLoad() {
	userVariables();
	login_logout(user_ID);
	$("#user_id").val(user_ID);
	
	$('#change_password_account').submit(function(e) {	
		loadingShow();	
		
		var err = "",
		post_password = $("#password").val(),
		post_password1 = $("#password1").val();
		var postData = $("#change_password_account").serialize();
		
		if(post_password !== post_password1) { 
			err = "Your passwords do not match, Please make sure they match.";
		}
		
		if(err == ""){
			if (isConnected) {
			$.post(uniUrl+"changepassword.php", postData, function(data){
				loadingHide();
				if(data.status == "yes"){
					showAlert("Thank you!\nYour password has been successfully changed","Change Password","Close");
					window.localStorage.setItem("change_password", 0);					
					window_redirect("index");
							
				}else{
					form_err_message(data.errormsg);
					//showAlert(data.errormsg,"Login","Close");
				}
			},"json").fail(function() {
				loadingHide();
				form_err_message("Changing password failed. Please make sure you are connected to a data service.");
				//showAlert("Changing password failed.\nPlease make sure you are connected to a data service.\n", "Change Password", "Close");
			});
			}else{
				loadingHide();
				showAlert("You are currently offline. Changing of password failed.", "Alert", "Close");
			}
		}else{
			loadingHide();
			form_err_message(err);
			//showAlert(err, "Change Password", "Close");	
		}
		
		e.preventDefault();
		return false;
	});

	$(document).on("click", ".logout-content", function(){
		logout_user_variables();
		window_redirect("index");		
		showAlert("You have successfully logged out of your account", "Logout", "Close");		
		return false;
	});
}

function retrieve_profile_pic(){
	$.getJSON(uniUrl+"retrieve_profile_pic.php", {user_ID:user_ID}, function(data) {
		if(data !== "" || data !== null){
			console.log("Profile pic: "+data.profile_pic);
			$("#profile_pic").html("<p align='center'><img src='"+data.profile_pic+"' align='center'/><br><b>Update Picture</b></p>");
		}		        					
	});	
}

function onDetailsLoad() {
	userVariables();
	login_logout(user_ID);
	$("#user_id").val(user_ID);	
	$("#contract_number").val(user_contract_number);
	
	if(profile_pic == ""){
		retrieve_profile_pic();	
	}else{
		$("#profile_pic").html("<p align='center'><img src='"+profile_pic+"' align='center'/><br><b>Update Picture</b></p>");
	}	
	
	$('[name=title]').val(user_title );
	$("#name").val(user_name);
	$("#surname").val(user_surname);
	$("#idnumber").val(user_idnumber);
	$('[name=gender]').val(user_gender);
	//$("#birthdate").val(user_birthdate);
	var birthdate_array = user_birthdate.split("/");
	$("#year").val(birthdate_array[0]);
	$("#month").val(birthdate_array[1]);
	$("#date").val(birthdate_array[2]);
	
	$("#address").val(user_address);
	$("#area").val(user_area);
	$("#city").val(user_city);
	$("#province").val(user_province);
	$("#phone").val(user_phone);
	$("#mobile").val(user_mobile);
	$("#email").val(user_email);
		
	$('#update_details').submit(function(e) {	
		loadingShow();	
		
		var err = "";	
		var postData = $("#update_details").serialize();
		
		if($("#title").val() == "") { 
			err = "Please select your title/salutation";
		}		
		
		if($("#name").val() == "") { 
			err = "Please fill in your first name";
		}
		
		if($("#surname").val() == "") { 
			err = "Please fill in your surname";
		}
		
		if($("#idnumber").val() == "") { 
			err = "Please fill in your national identification number";
		}
		
		if($("#gender").val() == "") { 
			err = "Please delect your gender";
		}		
		
		if($("#birthdate").val() == "") { 
			err = "Please fill in your birth date";
		}
		
		if($("#mobile").val() == "") {
			err = "Please fill in a mobile number";
		}
		
		if($("#address").val() == "") { 
			err = "Please fill your address details";
		}
		
		if($("#city").val() == "") { 
			err = "Please fill your address city";
		}
		
		if($("#email").val() !== "") { 
			if (!validateEmail($("#email").val())) {
	            err = "Please fill a valid email address";
	        }
		}
		
		if(err == ""){
			if(isConnected) {
			$.post(uniUrl+"update_details.php", postData, function(data){
				loadingHide();
				if(data.status == "yes"){
					form_success_message("Thank you! your details have been successfully updated.");
					window.localStorage.setItem("profile_pic", data.profile_pic);
					window.localStorage.setItem("user_title", data.title);
					window.localStorage.setItem("user_name", data.name);
					window.localStorage.setItem("user_surname", data.surname);
					window.localStorage.setItem("user_birthdate", data.birthdate);
					window.localStorage.setItem("user_gender", data.gender);
					window.localStorage.setItem("user_id_number", data.id_number);
					window.localStorage.setItem("user_address", data.address);
					window.localStorage.setItem("user_area", data.area);
					window.localStorage.setItem("user_city", data.city);
					window.localStorage.setItem("user_phone", data.phone);
					window.localStorage.setItem("user_mobile", data.mobile);
					window.localStorage.setItem("user_email", data.email);						
				}else{
					form_err_message(data.errormsg);
					//showAlert(data.errormsg,"Update Contacts","Close");
				}
			},"json").fail(function() {
				loadingHide();
				form_err_message("Updating your details failed. Please make sure you are connected to a data service.");
				//showAlert("Updating Contact details failed.\nPlease make sure you are connected to a data service.\n", "Update Contacts", "Close");
			});
			}else{
				loadingHide();
				showAlert("You are currently offline. Updating your details failed", "Alert", "Close");
			}
		}else{
			loadingHide();
			form_err_message(err);	
		}
		
		e.preventDefault();
		return false;
	});
	
	$(document).on("click", "#profile_pic", function(e){
        navigator.camera.getPicture(
        	function (imageURI, contract_number, suffix){
        		$("#profile_pic").html("<p align='center'><img width='150px' src='"+imageURI+"' align='center' /> <span id='upload_result'>Uploading to server<br>Please wait...</span></p>");
			    var options = new FileUploadOptions();
			    options.fileKey = "file";
			    options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
			    options.mimeType = "image/jpeg";
			    options.headers = { Connection: "close" };
			    
			    var unique_id = user_contract_number+"_"+generateUUID();
			    var params = new Object();
			    params.contract_number = user_contract_number;
			    params.suffix = user_suffix;
			    params.unique_id = unique_id;
			 
			    options.params = params;
			    options.chunkedMode = false;
			 
			    var ft = new FileTransfer();
			    ft.upload(
			    	imageURI, 
			    	encodeURI(uniUrl+"upload_profile_picture.php"), 
			    	upload_picture_success, 
			    	upload_picture_error, 
			    	options
			    );
        	}, 
        	function (message){
        		$("#profile_pic").html("<p align='center'><img src='images/profile_pic.png' align='center' /> Updating failed. Please try again.</p>");
        	},
			{
				quality: 100, 
				destinationType: navigator.camera.DestinationType.FILE_URI,
				sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
			}
        );
		e.preventDefault();
	});
	
	$(document).on("click", ".logout-content", function(){
		logout_user_variables();
		window_redirect("index");		
		showAlert("You have successfully logged out of your account", "Logout", "Close");		
		return false;
	});
}

function onDependanceLoad(){
	userVariables();
	login_logout(user_ID);
	if(user_ID == "" || user_ID == null){
		window_redirect("login");
	}else{
		if (isConnected) {
			$.getJSON(uniUrl+"list_dependance.php", {contract_number:user_contract_number},function(data) {
				var i = 1, listData = "";
	            $.each(data, function(k, v) { 
	            	listData += "<div class='big-notification grey-notification'>";
	                    listData += "<h4 class='uppercase' style='color:#000000'>"+v.title+" "+v.name+" "+v.surname+"</h4>";
	                        listData += "<p>";
	                            listData += "<b>Birthdate: </b>"+v.birthdate+"<br>";
	                            listData += "<b>ID Number: </b>"+v.idnumber+"<br>";
	                            listData += "<b>Gender: </b>"+v.gender+"<br>";
	                        listData += "</p>";
	                        listData += "<p>";
	                            listData += "<b>Address: </b>"+v.address+"<br>";
	                            listData += v.area+" "+v.city+"<br>";
	                            listData += "<b>Phone: </b>"+v.phone+"<br>";
	                            listData += "<b>Mobile: </b>"+v.mobile+"<br>";
	                        listData += "</p>";
	                        listData += "<p>";
	                            listData += "<a href='dependent_details.html?suffix="+v.suffix+"'>View details</a>";
	                        listData += "</p>";
	                listData += "</div>";
	            }); 
	            if(listData !== ""){
	            	$("#dependance").html(listData);
	            }else{
	            	$("#dependance p").html("You don't have any dependance on your medical aid.");
	            }       
	            					
	        }).fail(function() {
				showAlert("Unable to get your dependace.\nNo data service connection.\n", "Dependace", "Close");
			});
		}else{
			loadingHide();
				showAlert("You are currently offline. Your dependants failed to load", "Alert", "Close");
		}
	}
	
	$(document).on("click", ".logout-content", function(){
		logout_user_variables();
		window_redirect("index");		
		showAlert("You have successfully logged out of your account", "Logout", "Close");		
		return false;
	});	
}

function onDependent_detailsLoad(){
	userVariables();
	var suffix = getUrlVars()["suffix"];
	$("#contract_number").val(user_contract_number);
	$("#suffix").val(suffix);
	
	if(isConnected){
		$.post(uniUrl+"dependent_details.php", {contract_number:user_contract_number, suffix:suffix},function(data) {
			if(data.profile_pic !== ""){
				$("#profile_pic").html("<p align='center'><img src='"+data.profile_pic+"' align='center'/><br><b>Update Picture</b></p>");
			}
			$('[name=title]').val(data.title );
			$("#name").val(data.name);
			$("#surname").val(data.surname);
			$("#idnumber").val(data.id_number);
			$('[name=gender]').val(data.gender);
			//$("#birthdate").val(data.birthdate);
			var birthdate = data.birthdate;
			var birthdate_array = birthdate.split("/");
			$("#year").val(birthdate_array[0]);
			$("#month").val(birthdate_array[1]);
			$("#date").val(birthdate_array[2]);					
        },"json").fail(function() {
			showAlert("Unable to load dependent's details.\nNo data service connection.\n", "Dependents", "Close");
		});
	}
	
	$('#update_dependent_details').submit(function(e) {	
		loadingShow();	
		
		var err = "",
		postData = $("#update_dependent_details").serialize();
		
		if($("#title").val() == "") { 
			err = "Please fill in your title";
		}
		
		if($("#name").val() == "") { 
			err = "Please fill in your first name";
		}
		
		if($("#surname").val() == "") { 
			err = "Please fill in your surname";
		}
		
		if($("#birthdate").val() == "") { 
			err = "Please fill in your birth date";
		}
		
		if($("#idnumber").val() == "") { 
			err = "Please fill in your national identification number";
		}
		
		if(err == ""){
			if(isConnected) {
				$.post(uniUrl+"update_dependent_details.php", postData, function(data){
					loadingHide();
					if(data.status == "yes"){
						form_success_message("Thank you! you dependents details have been successfully updated");				
					}else{
						form_err_message(data.errormsg);
					}
				},"json").fail(function() {
					loadingHide();
					showAlert("Updating of details failed.\nPlease make sure you are connected to a data service.\n", "Registration", "Close");
				});
			}else{
				loadingHide();
				showAlert("You are currently offline. Update of details has failed", "Alert", "Close");
			}
		}else{
			loadingHide();
			showAlert(err, "Update", "Close");	
		}
		
		e.preventDefault();
		return false;
	});

	$(document).on("click", "#profile_pic", function(e){
        navigator.camera.getPicture(
        	function (imageURI, contract_number, suffix){
        		$("#profile_pic").html("<p align='center'><img width='150px' src='"+imageURI+"' align='center' /> <span id='upload_result'>Uploading to server<br>Please wait...</span></p>");
			    var options = new FileUploadOptions();
			    options.fileKey = "file";
			    options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
			    options.mimeType = "image/jpeg";
			    options.headers = { Connection: "close" };
			 
			    var unique_id = user_contract_number+"_"+generateUUID();
			    var params = new Object();
			    params.contract_number = user_contract_number;
			    params.suffix = getUrlVars()["suffix"];
			    params.unique_id = unique_id;
			 
			    options.params = params;
			    options.chunkedMode = false;
			 
			    var ft = new FileTransfer();
			    ft.upload(
			    	imageURI, 
			    	encodeURI(uniUrl+"upload_profile_picture.php"), 
			    	upload_picture_success, 
			    	upload_picture_error, 
			    	options
			    );
        	}, 
        	function (message){
        		$("#profile_pic").html("<p align='center'><img src='images/profile_pic.png' align='center' /> Updating failed. Please try again.</p>");
        	},
			{
				quality: 100, 
				destinationType: navigator.camera.DestinationType.FILE_URI,
				sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
			}
        );
		e.preventDefault();
	});
}

function upload_picture_success(r) {
    console.log("Code = " + r.responseCode);
	console.log("Response = " + r.response);
	console.log("Sent = " + r.bytesSent);
	$("#profile_pic #upload_result").html("Profile picture successfully uploaded.");
}
 
function upload_picture_error(error) {
	loadingHide();
	if(error.code == 1){
		$("#profile_pic #upload_result").html("Error uploading: <br>File not found");
	}
	if(error.code == 2){
		$("#profile_pic #upload_result").html("Error uploading: <br>Invalid file link");
	}
	if(error.code == 3){
		$("#profile_pic #upload_result").html("Error uploading: <br>Data service connection error");
	}        	
}

function onDependance_remittancesLoad(){
	userVariables();
	login_logout(user_ID);
	var suffix = getUrlVars()["suffix"];
	if(num_dependance > 0){
		$.getJSON(uniUrl+"list_transactions.php", {contract_number:user_contract_number, suffix:suffix},function(data) {
			var i = 1;
            $.each(data, function(k, v) {  
            	v.claim_number
            	v.supplier_number
            	v.supplier
            	v.service_type
            	v.amount
            	v.shortfall
            	v.date
            });
            
            $("#list_remittances").html(listData);					
        }).fail(function() {
			showAlert("Unable to load remittances.\nNo data service connection.\n", "Medical Transactions", "Close");
		});
	}
	
	$(document).on("click", ".logout-content", function(){
		logout_user_variables();
		window_redirect("index");		
		showAlert("You have successfully logged out of your account", "Logout", "Close");		
		return false;
	});
}

function onRemittancesLoad() {
	userVariables();
	if(user_ID == "" || user_ID == null){
		window_redirect("login");
	}else{
		login_logout(user_ID);
		$("#userTitle").html(user_title+" "+user_name+" "+user_surname);
		if (isConnected) {
			$.getJSON(uniUrl+"list_transactions.php", {contract_number:user_contract_number, suffix:user_suffix}, function(data) {
				if(data !== "" || data !== null){
					var i = 1, listData = ""; 
		            $.each(data, function(k, v) { 
		            	listData += "<table class='table' cellspacing='0'>";
		            		listData += "<tr>";
		            		listData += "<th>Name</th><th>Details</th>";
		            		listData += "</tr>";
		            		
		            		listData += "<tr>";
		            		listData += "<td>"+v.file_name+"</th><th><a href='"+v.file_link+"'>Download</a></td>";
		            		listData += "</tr>";	            		
		                listData += "</table>";
		            });
		            
		            $("#list_remittances").html(listData);
				}else{
					$("#list_remittances p").html("You don't have any remittances.");
				}		        					
		    }).fail(function() {
				showAlert("Unable to load you medical transactions.\nNo data service connection.\n", "Medical Transactions", "Close");
			});
		}else{
			loadingHide();
			showAlert("You are currently offline. You remittances failed to load.", "Alert", "Close");
		}
	}	
	
	$(document).on("click", ".logout-content", function(){
		logout_user_variables();
		window_redirect("index");		
		showAlert("You have successfully logged out of your account", "Logout", "Close");		
		return false;
	});	
}

function onMemberregisterLoad(){
	userVariables();
	
	$('#member_register').submit(function(e) {	
		loadingShow();	
		
		var err = "",
		title = $("#title").val(),
		name = $("#name").val(),
		surname = $("#surname").val(),
		postData = $("#member_register").serialize();
		
		if($("#title").val() == "") { 
			err = "Please fill in your title e.g Mr or Mrs";
		}
		
		if($("#name").val() == "") { 
			err = "Please fill in your first name";
		}
		
		if($("#surname").val() == "") { 
			err = "Please fill in your surname";
		}
		
		if($("#birthdate").val() == "") { 
			err = "Please fill in your birth date";
		}
		
		if($("#idnumber").val() == "") { 
			err = "Please fill in your national identification number";
		}
		
		if($("#mobile").val() == "") {
			err = "Please fill in a mobile number";
		}
		
		if($("#address").val() == "") { 
			err = "Please fill your address details";
		}
		
		if($("#city").val() == "") { 
			err = "Please fill your address city";
		}
		
		if($("#email").val() !== ""){
			if (!validateEmail($("#email").val())) {
	            err = "Please fill a valid email address";
	        }
		}
		
		
		if(err == ""){
			if(isConnected){
				$.post(uniUrl+"member_register.php", postData, function(data){
					loadingHide();
					if(data.status == "yes"){
						showAlert("Thank you "+title+" "+name+" "+surname+" your details have been saved.\n", "Registration", "Close");		
						window_redirect("success_member_register");			
					}else{
						showAlert(data.errormsg,"Registration","Close");
					}
				},"json").fail(function() {
					loadingHide();
					form_err_message("Member Registration failed. Please make sure you are connected to a data service.");
					showAlert("Member Registration failed.\nPlease make sure you are connected to a data service.\n", "Registration", "Close");
				});
			}
		}else{
			loadingHide();
			form_err_message(err);	
		}
		
		e.preventDefault();
		return false;
	});
	
	$(document).on("click", ".logout-content", function(){
		logout_user_variables();
		window_redirect("index");		
		showAlert("You have successfully logged out of your account", "Logout", "Close");		
		return false;
	});	
}

function onSuccess_member_registerLoad(){
	$("#register_page").hide();
	
	$(document).on("click", ".logout-content", function(){
		logout_user_variables();
		window_redirect("index");		
		showAlert("You have successfully logged out of your account", "Logout", "Close");		
		return false;
	});	
}

function onRegisterLoad(){
	userVariables();
	$('#registration').submit(function(e) {	
		loadingShow();	
		
		var err = "",
		postData = $("#updateContacts").serialize();
		
		if($("#title").val() == "") { 
			err = "Please fill in your title";
		}
		
		if($("#name").val() == "") { 
			err = "Please fill in your first name";
		}
		
		if($("#surname").val() == "") { 
			err = "Please fill in your surname";
		}
		
		if($("#birthdate").val() == "") { 
			err = "Please fill in your birth date";
		}
		
		if($("#idnumber").val() == "") { 
			err = "Please fill in your national identification number";
		}
		
		if($("#phone").val() == "") { 
			err = "Please fill in a contact/landline number";
		}
		
		if($("#mobile").val() == "") {
			err = "Please fill in a mobile number";
		}
		
		if($("#address").val() == "") { 
			err = "Please fill your address details";
		}
		
		if($("#city").val() == "") { 
			err = "Please fill your address city";
		}
		
		if (!validateEmail($("#email").val())) {
            err = "Please fill a valid email address";
        }
		
		if(err == ""){
			if (isConnected) {
				$.post(uniUrl+"register.php", postData, function(data){
					loadingHide();
					if(data.status == "yes"){
						showAlert("Thank you! you have successfully registered with Corporate 24 Medical Aid\n", "Registration", "Close");					
						$("#results").html("Thank you! your contact details have been successfully updated.");
						window.localStorage.setItem("user_ID", data.ID); 
						window.localStorage.setItem("user_contract_number", data.contract_number);
						window.localStorage.setItem("user_suffix", data.suffix);
						window.localStorage.setItem("user_title", data.title);
						window.localStorage.setItem("user_initials", data.initials);
						window.localStorage.setItem("user_name", data.name);
						window.localStorage.setItem("user_surname", data.surname); 
						
						window.localStorage.setItem("user_gender", data.gender);  
						window.localStorage.setItem("user_birthdate", data.birthdate);
						window.localStorage.setItem("user_idnumber", data.id_number); 
						  
						window.localStorage.setItem("user_address", data.address); 
						window.localStorage.setItem("user_city", data.city); 
						window.localStorage.setItem("user_province", data.province);
						window.localStorage.setItem("user_phone", data.phone);
						window.localStorage.setItem("user_mobile", data.mobile);
						window.localStorage.setItem("user_email", data.email);				
					}else{
						showAlert(data.errormsg,"Registration","Close");
					}
				},"json").fail(function() {
					loadingHide();
					showAlert("registration failed.\nPlease make sure you are connected to a data service.\n", "Registration", "Close");
				});
			}else{
				loadingHide();
				showAlert("You are currently offline. Registeration failed", "Alert", "Close");
			}
		}else{
			loadingHide();
			showAlert(err, "Registration", "Close");	
		}
		
		e.preventDefault();
		return false;
	});
}

function onAdd_dependentsLoad(){
	userVariables();
	login_logout(user_ID);
	$('#contract_number').val(user_contract_number);
	$('#add_dependents').submit(function(e) {	
		loadingShow();	
		
		var err = "",
		postData = $("#add_dependents").serialize();
		
		if($("#name_dependant_0").val() == "" || $("#surname_dependant_0").val() == "") { 
			err = "Fill in at least one dependent before submiting your details";
		}
		
		if(err == ""){
			if (isConnected) {
				$.post(uniUrl+"add_dependents.php", postData, function(data){
					loadingHide();
					if(data.status == "yes"){
						form_success_message("Thank you! you have successfully registered "+data.num_dependents+" with Corporate 24 Medical Aid");
					}else{
						form_err_message(data);
						//showAlert(data.errormsg,"Registration","Close");
					}
				},"json").fail(function() {
					loadingHide();
					showAlert("Adding dependents failed.\nPlease make sure you are connected to a data service.\n", "Registration", "Close");
				});
			}else{
				loadingHide();
				showAlert("You are currently offline. Adding dependents failed.", "Alert", "Close");
			}
			
			
		}else{
			loadingHide();
			showAlert(err, "Registration", "Close");	
		}
		
		e.preventDefault();
		return false;
	});
	
	//dependants
	$(document).on("click", "#show_dependant_1", function(){
		$("#dependant_1").show();		
		return false;
	});
	
	$(document).on("click", "#show_dependant_2", function(){
		$("#dependant_2").show();		
		return false;
	});
	
	$(document).on("click", "#show_dependant_3", function(){
		$("#dependant_3").show();		
		return false;
	});
	
	$(document).on("click", "#show_dependant_4", function(){
		$("#dependant_4").show();		
		return false;
	});
	
	$(document).on("click", "#show_dependant_5", function(){
		$("#dependant_5").show();		
		return false;
	});
	
	$(document).on("click", "#show_dependant_6", function(){
		$("#dependant_6").show();		
		return false;
	});
	
	$(document).on("click", "#show_dependant_7", function(){
		$("#dependant_7").show();		
		return false;
	});
	
	$(document).on("click", "#show_dependant_8", function(){
		$("#dependant_8").show();		
		return false;
	});
	
	$(document).on("click", "#show_dependant_9", function(){
		$("#dependant_9").show();		
		return false;
	});
}

function onAccountdetailsLoad(){
	userVariables();
	login_logout(user_ID);	
	
	$(document).on("click", ".logout-content", function(){
		logout_user_variables();
		window_redirect("index");		
		showAlert("You have successfully logged out of your account", "Logout", "Close");		
		return false;
	});	
}

function onNewsLoad(){
	userVariables();
	login_logout(user_ID);
	list_messages();
}

function onMessagesLoad(){
	userVariables();
	login_logout(user_ID);
	list_messages();
}

function onContactLoad(){
	userVariables();
	login_logout(user_ID);
	
	$("#contactNameField").val(user_title+" "+user_name+" "+user_surname);
	$("#contactEmailField").val(user_email);
	$("#contract_number").val(user_contract_number);
	$("#suffix").val(user_suffix);
	
	$('#contact_form').submit(function(e) {	
		loadingShow();	
		
		var err = "",
		postData = $("#contact_form").serialize();
		
		if($("#contactNameField").val() == "") { 
			err = "Please fill in your name";
		}
		
		if($("#contactEmailField").val() == "") { 
			err = "Please fill in your email address";
		}
		
		if($("#contactMessageTextarea").val() == "") { 
			err = "Please fill in your message";
		}
		
		if (!validateEmail($("#contactEmailField").val())) {
            err = "Please fill a valid email address";
        }
		
		if(err == ""){
			if (isConnected) {
			loadingHide();
			$.post(uniUrl+"contact_us_message.php", postData, function(data){
				loadingHide();
				if(data.status == "yes"){
					$("#contactMessageTextarea").val("");
					form_success_message("Thank you! your message has been sent. We will get back to you as soon as possible");				
				}else{
					form_err_message(data.errormsg);
					//showAlert(data.errormsg,"Contact Us","Close");
				}
			},"json").fail(function() {
				loadingHide();
				form_err_message("There was an error trying to sent your message. Please make sure you are connected to a data service.");
				//showAlert("There was an error trying to sent your message.\nPlease make sure you are connected to a data service.\n", "Contact Us", "Close");
			});
			}else{
				showAlert("Youa are currently offline. Updating of details failed", "Alert", "Close");
			}
		}else{
			loadingHide();
			form_err_message(err);	
		}
		
		e.preventDefault();
		return false;
	});
	
	$(document).on("click", ".logout-content", function(){
		logout_user_variables();
		window_redirect("index");		
		showAlert("You have successfully logged out of your account", "Logout", "Close");		
		return false;
	});	
}

$('#content-header').on('click', '.facebook-content a', function(event) {
    var href = $(this).attr('href');
    if (typeof href !== 'undefined' && href.substr(0, 8) === 'https://'){
        event.preventDefault();
        window.open(this.href, '_system', 'location=no');
    }
});

$('#content-header').on('click', '.twitter-content a', function(event) {
    var href = $(this).attr('href');
    if (typeof href !== 'undefined' && href.substr(0, 8) === 'https://'){
        event.preventDefault();
        window.open(this.href, '_system', 'location=no');
    }
});

$('#content-header').on('click', '.facebook-sidebar a', function(event) {
    var href = $(this).attr('href');
    if (typeof href !== 'undefined' && href.substr(0, 8) === 'https://'){
        event.preventDefault();
        window.open(this.href, '_system', 'location=no');
    }
});

$('#content-header').on('click', '.twitter-sidebar a', function(event) {
    var href = $(this).attr('href');
    if (typeof href !== 'undefined' && href.substr(0, 8) === 'https://'){
        event.preventDefault();
        window.open(this.href, '_system', 'location=no');
    }
});

function getUrlVars() {
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}

// This gets called by jQuery mobile when the page has loaded
$(document).bind("pageload", function(event, data) {
	init(data.url);
});

// Set an onload handler to call the init function
window.onload = init;
