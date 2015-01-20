var db = window.openDatabase("corp24medicalaiddb", "1.0", "corp24medicalaiddb", 1000000);

function dbSetup() {
	db.transaction(populateDB, errorCB, successCB);
}

function populateDB(tx) {
	tx.executeSql('CREATE TABLE IF NOT EXISTS messages (title TEXT, body TEXT, msg_date TEXT)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS news (title TEXT, body TEXT, msg_date TEXT)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS user (ID TEXT, profile TEXT, title TEXT, name TEXT, surname TEXT, idnumber TEXT, birthdate TEXT, pushtoken TEXT, address TEXT, area TEXT, city TEXT, mobile TEXT, phone TEXT, email TEXT, gender TEXT)');
	//tx.executeSql('INSERT INTO users (id, pusherID, fname, lname, address, city, country, mobile, email, medaid, medaidnumber, bloodtype, allergies, disabilities, regdate) VALUES ("1", 1, "Test", "Client", "address", "", "", "", 0)');
}

function errorCB(err) {
	console.log("Error processing SQL: " + err.code);
}

function successCB() {
	//db.transaction(queryDB, errorCB);
	window.localStorage.setItem("database_setup", 1);
	console.log("Database successfully populated")
}

//get users details
function get_user_details(){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"SELECT * FROM user LIMIT ?", [1], 
	 		function user_details_success(tx, results){
				var len = results.rows.length, listData = "";
			    if(len !== 0){	
			    	var i = 0;				
			    	user_ID = results.rows.item(i).ID;
					user_profile_pic = results.rows.item(i).profile;
					user_title = results.rows.item(i).title;
					user_name = results.rows.item(i).name;
					user_surname = results.rows.item(i).surname; 
					
					user_gender = results.rows.item(i).gender; 
					user_birthdate = results.rows.item(i).birthdate;
					user_idnumber = results.rows.item(i).idnumber; 
					  
					user_address = results.rows.item(i).address;
					user_area = results.rows.item(i).area;
					user_city = results.rows.item(i).city; 
					
					user_phone = results.rows.item(i).phone;
					user_mobile = results.rows.item(i).mobile;
					user_email = results.rows.item(i).email;
					user_push_token = results.rows.item(i).pushtoken;
				}else{
					console.log("There are no users details in db.");
				}
			}, 
	 		function user_details_fail(){
	 			console.log("Error: Retireving users details from db.");
	 		}
	 	);
	 });	
}

function save_user_details(ID, profile, title, name, surname, gender, birthdate, idnumber, address, area, city, phone, mobile, email){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"INSERT INTO user (ID, profile, title, name, surname, gender, birthdate, idnumber, address, area, city, phone, mobile, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
	 		[ID, profile, title, name, surname, gender, birthdate, idnumber, address, area, city, phone, mobile, email], 
	 		function save_user_details_success(){
	 			//successfull registration
	 			showAlert("Thank you! you have successfully Registered\n", "Registration", "Close");
	 		}, 
	 		function save_user_details_error(){
	 			console.log("Error: retireving users details from db.");
	 		}
	 	);
	 });	
}

function update_user_details(ID, profile, title, name, surname, gender, birthdate, idnumber, address, area, city, phone, mobile, email){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"UPDATE user SET profile = ?, title = ?, name = ?, surname = ?, gender = ?, birthdate = ? idnumber = ?, address = ?, area = ?, city = ?, phone = ?, mobile =?, email = ? WHERE ID = ?", [profile, title, name, surname, gender, birthdate, idnumber, address, area, city, phone, mobile, email, ID], 
	 		function update_user_details_success(){
	 			showAlert("Your details have been successfully updated.\n", "Update", "Close");
	 		}, 
	 		function update_user_details_success(){
	 			console.log("Error: updating users details to db");
	 		}
	 	);
	 });	
}

function delete_user_details(){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"DELETE FROM user)", [], 
	 		function delete_user_details_success(){
	 			console.log("Old user details have been successfully deleted.");
	 		}, 
	 		function delete_user_details_error(){
	 			console.log("Error: deleting old user details.");
	 		}
	 	);
	 });	
}

//list messages in database
function list_messages(){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"SELECT * FROM messages ORDER BY msg_date DESC LIMIT ?", [10], 
	 		success_message_list, 
	 		error_message_list
	 	);
	 });	
}

function success_message_list(tx, results){
	var len = results.rows.length, listData = "";
    if(len !== 0){
    	for (var i=0; i<len; i++){
    		var title = results.rows.item(i).title;
    		var body = results.rows.item(i).body;
    		var date = results.rows.item(i).msg_date;
    		
    		if(i == 0){
    			listData += "<div class='big-notification yellow-notification'>";
    		}else{
    			listData += "<div class='big-notification grey-notification'>";
    		}
                listData += "<h4 class='uppercase' style='color:#000000'>"+title+" | "+date+"</h4>";
                    listData += "<p>";
                        listData += body;
                    listData += "</p>";
            listData += "</div>";
		}
		$("#list_messages").html(listData);
	}
}

function error_message_list(){ 
	console.log("Error: Push message list from DB");
}

//list news in database
function list_news(){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"SELECT * FROM news ORDER BY msg_date DESC LIMIT ?", [10], 
	 		success_news_list, 
	 		error_news_list
	 	);
	 });	
}

function success_news_list(tx, results){
	var len = results.rows.length, listData = "";
    if(len !== 0){
    	for (var i=0; i<len; i++){
    		var title = results.rows.item(i).title;
    		var body = results.rows.item(i).body;
    		var date = results.rows.item(i).msg_date;
    		
    		if(i == 0){
    			listData += "<div class='big-notification yellow-notification'>";
    		}else{
    			listData += "<div class='big-notification grey-notification'>";
    		}
    		
                listData += "<h4 class='uppercase' style='color:#000000'>"+title+" | "+date+"</h4>";
                    listData += "<p>";
                        listData += body;
                    listData += "</p>";
            listData += "</div>";
		}
		$("#list_news").html(listData);
	}
}

function error_news_list(){ 
	console.log("Error: Listing news articles");
}

//save push message to database
function save_message(title, message, msgdate){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"INSERT INTO messages (title, body, msg_date) VALUES (?, ?, ?)", [title, message, msgdate], 
	 		success_message_save, 
	 		error_message_save
	 	);
	 });	
}

function success_message_save(){ 
	console.log("Push message has been saved to DB");
}

function error_message_save(){ 
	console.log("Error: Push message save to DB");
}

//save news message to database
function save_news(title, message, msgdate){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"INSERT INTO news (title, body, msg_date) VALUES (?, ?, ?)", [title, message, msgdate], 
	 		success_news_save, 
	 		error_news_save
	 	);
	 });	
}

function success_news_save(){ 
	console.log("News message has been saved to DB");
}

function error_news_save(){ 
	console.log("Error: Saving news message to DB");
}

//update push message to database
function update_message(title, message, msgdate, ID){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"UPDATE messages SET title = ?, body = ?, msg_date = ? WHERE ID = ?", [title, message, msgdate, ID], 
	 		success_message_update, 
	 		error_message_update
	 	);
	 });	
}

function success_message_update(){ 
	console.log("Push message updated to DB");
}

function error_message_update(){ 
	console.log("Error: Updating news message in database");
}

//update news message to database
function update_news(title, message, msgdate, ID){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"UPDATE news SET title = ?, body = ?, msg_date = ? WHERE ID = ?", [title, message, msgdate, ID], 
	 		success_news_update, 
	 		error_news_update
	 	);
	 });	
}

function success_news_update(){ 
	console.log("News message updated to DB");
}

function error_news_update(){ 
	console.log("Error: Updating news message in database");
}


//delete push message to database
function delete_message(ID){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"DELETE FROM messages WHERE ID = ?)", [ID], 
	 		success_message_delete, 
	 		error_message_delete
	 	);
	 });	
}

function success_message_delete(){ 
	console.log("Push message has been deleted in DB");
}

function error_message_delete(){ 
	dbSetup();
	console.log("Error: Push message delete from DB");
}

//delete news message to database
function delete_news(ID){
	 db.transaction(function(tx) {
	 	tx.executeSql(
	 		"DELETE FROM news WHERE ID = ?)", [ID], 
	 		success_news_delete, 
	 		error_news_delete
	 	);
	 });	
}

function success_news_delete(){ 
	console.log("Push message has been deleted in DB");
}

function error_news_delete(){ 
	console.log("Error: Deleting news message from DB");
}
