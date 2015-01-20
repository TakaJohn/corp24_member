function pushSetup(){
	pushNotification = window.plugins.pushNotification;
	if(device.platform == 'android' || device.platform == 'Android'){		
		if(user_push_token == "" || user_push_token == null){
			pushNotification.register(pushSuccessHandler, pushErrorHandler, {"senderID":"592424937199","ecb":"onNotificationGCM"});
		}
	}else{
		if(user_push_token == "" || user_push_token == null){
			pushNotification.register(tokenSuccessHandler, tokenErrorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});
		}
	}	
}

/******APPLE FUNCTIONS******/

function onNotificationAPN(e) {
	if (e.alert) {
		$("#app-status-ul").append('<li>push-notification: ' + e.alert + '</li>');
        navigator.notification.alert(e.alert);
	}
                    
	if (e.sound) {
		var snd = new Media(e.sound);
		snd.play();
	}
                
	if (e.badge) {
		pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
	}
}

function tokenSuccessHandler (result) {
	$("#app-status-ul").append('<li>token: '+ result +'</li>');
	window.localStorage.setItem("user_push_token", result);
	// Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
}

function tokenErrorHandler (error) {
	if (isConnected) {
		console.log("try again register for Apple push");
		setTimeout(function(){
        	pushNotification.register(tokenSuccessHandler, tokenErrorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});
    	}, 10000);
	}
	console.log('Error:'+ error);
}

/******ANDROID FUNCTIONS******/

function pushSuccessHandler (result) {
   console.log("Success registering Push ID: "+result);
   //window.localStorage.setItem("user_push_token", result); 
}
            
function pushErrorHandler (error) {
	if (isConnected) {
		console.log("try again register for GCM push");
		setTimeout(function(){
        	pushNotification.register(pushSuccessHandler, pushErrorHandler, {"senderID":"592424937199","ecb":"onNotificationGCM"});
    	}, 10000);
	}
	console.log('Error:'+ error);
}

function newPushMessage(title,message,image){
	$("#header_pushmsg").show();
	if(image !== "" || image !== null){
		$("#push_body p").html("<img align='left' src='"+image+"'/><strong>"+title+"</strong><br>"+message);
		latestMessage = "<p><img align='left' src='"+image+"'/><strong>"+title+"</strong><br>"+message+"</p>";
		savePushMessageDB(latestMessage, todayFullDate);
	}else{
		$("#push_body p").html("<strong>"+title+"</strong><br>"+message);
		latestMessage = "<p><strong>"+title+"</strong><br>"+message+"</p>";
		savePushMessageDB(latestMessage, todayFullDate);
	}
	
	setTimeout(function(){
		$("#header_pushmsg").hide();
		$("#push_body p").html("");
    }, 20000);
}

function onNotificationGCM(e) {
    console.log('EVENT -> RECEIVED:' + e.event);                
	switch( e.event ){
		case 'registered':
		if ( e.regid.length > 0 ){
			window.localStorage.setItem("user_push_token", e.regid);
			if(user_ID !== ""){
				$.post(uniUrl+"update_user_push_token.php",{user_ID:user_ID, device:"android", user_push_token:e.regid}, function(data) {
					if(data.status = "yes"){
						//user android token succefully saved
					}
					if(data.status = "no"){
						console.log("users token is failed to be registered")
					}
				},"json").fail(function(data) {
					console.log("currently offline: user_push_token not updated");
				});
			}
		}
        break;
                    
        case 'message':
        	var push_message = e.payload.message;
        	var push_title = e.payload.title;
        	var push_date = e.payload.date;        	
        	
    		save_message(push_title, push_message, push_date);
        	
            if (e.foreground){            	
				var my_media = new Media("/android_asset/www/beep.wav");
				my_media.play();
			}else{
				if (e.coldstart){
					var my_media = new Media("/android_asset/www/beep.wav");
					my_media.play();
				}else{
					var my_media = new Media("/android_asset/www/beep.wav");
					my_media.play();
				}				
			}			
			
            break;
                    
            case 'error':
				console.log('ERROR -> MSG:' + e.msg )
            break;
                    
            default:
				console.log("EVENT -> Unknown, an event was received and we do not know what it is");
            break;
    }
}