var MongoClient = require('mongodb').MongoClient;
var dbUrl = "mongodb://localhost:27017/";

(function() {
	var fs, http, qs, server, url, resultlength;
	http = require('http');
	url = require('url');
	qs = require('querystring');
	fs = require('fs');

	var loginStatus = false, loginUser = "";

	server = http.createServer(function(req, res) {
		var action, form, formData, msg, publicPath, urlData, stringMsg;
		urlData = url.parse(req.url, true);
		action = urlData.pathname;
		publicPath = __dirname + "\\public\\";
		console.log(req.url);



		if (action === "/Home") {
			console.log("home");
			MongoClient.connect(dbUrl, function(err, db) {
							if (err) throw err;
							var dbo = db.db("database");
							var query = {};

							dbo.collection("user").find(query).toArray(function(err ,result){
								if (err) throw err;
								console.log(result);
								//console.log(result.length);
								resultlength = result.length;
								//console.log(resultlength);
								db.close();
							});
						});
			if (req.method === "POST") {
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) {
					formData += data;-
					console.log("form data="+ formData);
					return req.on('end', function() {
						var user;
						user = qs.parse(formData);
						user.id = resultlength + 1;
						msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("&");

						var tempSplitName = splitMsg[0];
						var tempSplitEmail = splitMsg[1];
						var tempSplitPassword = splitMsg[2];

						var splitName = tempSplitName.split("=");
						var splitEmail = tempSplitEmail.split("=");
						var splitPassword = tempSplitPassword.split("=");

						var newemail = decodeURIComponent(splitEmail[1]);
						var newname = decodeURIComponent(splitName[1]);


						var checkdbemail = false;

						var searchDB = "Email : " + newemail;
						console.log("mess="+msg);
						console.log("mess="+formData);
						//console.log("split=" + msg[1]);
						console.log("search=" + searchDB);
						//res.writeHead(200, {
					//		"Content-Type": "application/json",
						//	"Content-Length": msg.length
						//});
						MongoClient.connect(dbUrl, function(err, db) {
							var finalcount;
							if (err) throw err;
							var dbo = db.db("database");
							var myobj = stringMsg;

							dbo.collection("user").count({"Email" : newemail}, function(err, count){
								console.log(err, count);
								finalcount = count;
								if(finalcount > 0)
								{
									if(err) {
										throw err;
										console.log(err);
									}
									console.log("email already exist");
									db.close();
									return res.end("email fail");
								}else{
										dbo.collection("user").insertOne(myobj, function(err, res) {
											if (err) throw err;
											console.log("1 document inserted");
											db.close();
											//return res.end(msg);
										});
										console.log(msg);
										var mydata=newemail+","+newname;
										return res.end(mydata);
										}
							});
						});
					});										
				});

			}
			else
			{
				//form = publicPath + "ajaxSignupForm.html";
				form = "E-Gamer.html";
				return fs.readFile(form, function(err, contents) {
					if (err !== true)
					{
						res.writeHead(200, {
							"Content-Type": "text/html"
						});
						return res.end(contents);
					}
					else
					{
						res.writeHead(500);
						return res.end;
					}
				});
			  }
			} else if (action === "/Login") {
			console.log("login");
			if (req.method === "POST") {
				console.log("action = post");
				formData = '';
				msg = '';
				return req.on('data', function(data) {
					formData += data;
					console.log("form data="+ formData);
					return req.on('end', function() {
						var user;
						user = qs.parse(formData);
						msg = JSON.stringify(user);
						stringMsg = JSON.parse(msg);
						var splitMsg = formData.split("&");

						var tempSplitEmail = splitMsg[0];
						var tempSplitPassword = splitMsg[1];

						var splitEmail = tempSplitEmail.split("=");
						var splitPassword = tempSplitPassword.split("=");

						var newemail = decodeURIComponent(splitEmail[1]);
						var newpassword = decodeURIComponent(splitPassword[1]);


						var checkdbemail = false;

						var searchDB = "Email : " + newemail;
						console.log("mess="+msg);
						console.log("mess="+formData);
						//console.log("split=" + msg[1]);
						console.log("search=" + searchDB);
						//res.writeHead(200, {
					//		"Content-Type": "application/json",
						//	"Content-Length": msg.length
						//});
						MongoClient.connect(dbUrl, function(err, db) {
							var finalcount;
							if (err) throw err;
							var dbo = db.db("database");
							var myobj = stringMsg;

							dbo.collection("user").count({"Email" : newemail}, function(err, count){
								console.log(err, count);
								finalcount = count;
								if(finalcount <= 0)
								{
									if(err) {
										throw err;
										console.log(err);
									}
									console.log("email not match");
									db.close();
									return res.end("email fail");
								}else{
									dbo.collection("user").count({"Password" : newpassword}, function(err, count){
									console.log(err, count);
									finalcount = count;
									if(finalcount <= 0)
									{
										if(err) {
											throw err;
											console.log(err);
										}
										console.log("password not match");
										db.close();
										return res.end("email fail");
									}else{
									
										console.log(msg);
										
										dbo.collection("user").find({"Email" : newemail}).toArray(function(err, result) 
											{
												if (err) throw err;
												console.log("result" + result);
												db.close();
												var resultReturn = JSON.stringify(result);
												console.log("resultReturn" + resultReturn);
												return res.end(resultReturn);
											});
										//var mydata=newemail+","+id;
										//return res.end(mydata);
										}
									});
								}
								
								
								
								});
							});


						});
					});


			}
			
		}
			 else if (action === "/UserLogin") {
				console.log("login");
				if (req.method === "POST") {
					console.log("action = post");
					formData = '';
					msg = '';
					return req.on('data', function(data) {
						formData += data;
						console.log("form data="+ formData);
						return req.on('end', function() {
							var user;
							user = qs.parse(formData);
							msg = JSON.stringify(user);
							stringMsg = JSON.parse(msg);
							var splitMsg = formData.split("&");
	
							var tempSplitEmail = splitMsg[1];
							var tempSplitPassword = splitMsg[2];
	
							var splitEmail = tempSplitEmail.split("=");
							var splitPassword = tempSplitPassword.split("=");
	
							var newemail = decodeURIComponent(splitEmail[1]);
							var newpassword = decodeURIComponent(splitPassword[1]);
	
	
							var checkdbemail = false;
	
							var searchDB = "Email : " + newemail;
							console.log("mess="+msg);
							console.log("mess="+formData);
							//console.log("split=" + msg[1]);
							console.log("search=" + searchDB);
							//res.writeHead(200, {
							//	"Content-Type": "application/json",
							//	"Content-Length": msg.length
							//});
							MongoClient.connect(dbUrl, function(err, db) {
								var finalcount;
								if (err) throw err;
								var dbo = db.db("database");
								var myobj = stringMsg;
	
								dbo.collection("user").count({"Email" : newemail}, function(err, count){
									console.log(err, count);
									finalcount = count;
									if(finalcount <= 0)
									{
										if(err) {
											throw err;
											console.log(err);
										}
										console.log("email not match");
										db.close();
										return res.end("email fail");
									}else{
										dbo.collection("user").count({"Password" : newpassword}, function(err, count){
										console.log(err, count);
										finalcount = count;
										if(finalcount <= 0)
										{
											if(err) {
												throw err;
												console.log(err);
											}
											console.log("password not match");
											db.close();
											return res.end("email fail");
										}else{													
											console.log(msg);
											var mydata= newemail +","+id;
											return res.end(mydata);
											}
										});
										}
								});


						});
					});
				});
			 }

		} else if (action === "/readfavourlist")
		{
			console.log("read");
				if (req.method === "POST") {
					console.log("action = post");
					formData = '';
					msg = '';
					return req.on('data', function(data) {
						formData += data;
						console.log("form data="+ formData);
						return req.on('end', function() {
							var favourite;
							favourite = qs.parse(formData);
							msg = JSON.stringify(favourite);
							stringMsg = JSON.parse(msg);
							var splitMsg = formData.split("&");
							
							var tempSplitId = splitMsg[0];
							var tempSplitUser = splitMsg[1];
	
							var splitId = tempSplitId.split("=");
							var splitUser = tempSplitUser.split("=");

							console.log("mess="+msg);
							console.log("mess="+formData);
							//console.log("split=" + msg[1]);
							//res.writeHead(200, {
							//	"Content-Type": "application/json",
							//	"Content-Length": msg.length
							//});
							console.log("read favour");
							MongoClient.connect(dbUrl, function(err, db) 
							{
								var finalcount;
								if (err) throw err;
								var dbo = db.db("mydb");
								var myobj = stringMsg;
								dbo.collection("favourlist").find({"Userid" : splitId[1],"Username":splitUser[1]}).toArray(function(err, result) 
								{
								if (err) throw err;
								console.log("result" + result);
								db.close();
									var resultReturn = JSON.stringify(result);
									console.log("resultReturn" + resultReturn);
									return res.end(resultReturn);
								});
							});
							
				
					});
				});
			 }
				
		} else if (action === "/addfavourlist")
		{
			console.log("read");
				if (req.method === "POST") {
					console.log("action = post");
					formData = '';
					msg = '';
					return req.on('data', function(data) {
						formData += data;
						console.log("form data="+ formData);
						return req.on('end', function() {
							var favourite;
							favourite = qs.parse(formData);
							msg = JSON.stringify(favourite);
							stringMsg = JSON.parse(msg);
							
							var splitMsg = formData.split("&");
							
							var tempSplitId = splitMsg[0];
							var tempSplitUser = splitMsg[1];
							var tempSplitGame = splitMsg[2];
	
							var splitId = tempSplitId.split("=");
							var splitUser = tempSplitUser.split("=");
							var splitGame = tempSplitGame.split("=");

							console.log("mess="+msg);
							console.log("mess="+formData);
							//console.log("split=" + msg[1]);
							//res.writeHead(200, {
							//	"Content-Type": "application/json",
							//	"Content-Length": msg.length
							//});
							console.log("read favour");
							MongoClient.connect(dbUrl, function(err, db) 
							  {
								var finalcount;
								if (err) throw err;
								var dbo = db.db("mydb");
								var myobj = stringMsg;
								dbo.collection("favourlist").count({"Userid" : splitId[1],"Username" : splitUser[1],"FavoriteListTitle" : splitGame[1]}, function(err, count)
								{
								  console.log(err, count);
								  finalcount = count;
								  if(finalcount > 0)
								  {
									if(err) throw err;
									db.close();
									return res.end("fail");
								  }
								  else
								  {
									dbo.collection("favourlist").insertOne(myobj, function(err, favres) 
									{
									  if (err) throw err;
									  console.log("1 document inserted");
									  db.close();
									});
									return res.end("success");
								  }
								});
								
							  });
							
				
					});
				});
			 }
				
		}
		
		else if (action === "/delfavourlist")
		{
      
			console.log("del");
				if (req.method === "POST") {
					console.log("action = post");
					formData = '';
					msg = '';
					return req.on('data', function(data) {
						formData += data;
						console.log("form data="+ formData);
						return req.on('end', function() {
							var favourite;
							favourite = qs.parse(formData);
							msg = JSON.stringify(favourite);
							stringMsg = JSON.parse(msg);
							
							var splitMsg = formData.split("&");
							
							var tempSplitId = splitMsg[0];
							var tempSplitUser = splitMsg[1];
							var tempSplitGame = splitMsg[2];
	
							var splitId = tempSplitId.split("=");
							var splitUser = tempSplitUser.split("=");
							var splitGame = tempSplitGame.split("=");

							console.log("mess="+msg);
							console.log("mess="+formData);
							console.log("del favour");
              MongoClient.connect(dbUrl, function(err, db) 
              {
                var finalcount;
                if (err) throw err;
                var dbo = db.db("mydb");
                var myobj = stringMsg;
                dbo.collection("favourlist").remove({"Userid" : splitId[1],"Username" : splitUser[1],"FavoriteListTitle" : splitGame[1]}, function(err, count)
                {
    				if (err) throw err;
    				db.close();
					return res.end("delete");
					});
                
              });
            });
          });
        
        
			}
		}else if (action === "/Resources")
		{
			form = "API.html";
				return fs.readFile(form, function(err, contents) {
					if (err !== true)
					{
						res.writeHead(200, {
							"Content-Type": "text/html"
						});
						return res.end(contents);
					}
					else
					{
						res.writeHead(500);
						return res.end;
					}
				});
			
		}else if (action === "/map")
		{
			form = "map.html";
				return fs.readFile(form, function(err, contents) {
					if (err !== true)
					{
						res.writeHead(200, {
							"Content-Type": "text/html"
						});
						return res.end(contents);
					}
					else
					{
						res.writeHead(500);
						return res.end;
					}
				});
			
		}
		
		else
		{
      //handle redirect

			if(req.url === "/"){
				console.log("Requested URL is url" + req.url);
				res.writeHead(200, {
					'Content-Type': 'text/html'
				});
				res.write('<b>testpage</b><br /><br />This is the default response.');
			}else if(/^\/[a-zA-Z0-9\/_.-]*.js$/.test(req.url.toString())){
				sendFileContent(res, req.url.toString().substring(1), "text/jquery");
			}
			else if(/^\/[a-zA-Z0-9\/_.-]*.css$/.test(req.url.toString())){
				sendFileContent(res, req.url.toString().substring(1), "text/css");
			}else if(/^\/[a-zA-Z0-9\/_.-]*.jpg$/.test(req.url.toString())){
				sendFileContent(res, req.url.toString().substring(1), "img/jpg");
			}/*else if(/^\/[a-zA-Z0-9\/_.-]*.mp4$/.test(req.url.toString())){
				sendFileContent(res, req.url.toString().substring(1), "video/mp4");
			}else if(/^\/[a-zA-Z0-9\/_.-]*.scss$/.test(req.url.toString())){
				sendFileContent(res, req.url.toString().substring(1), "text/scss");
			}else if(/^\/[a-zA-Z0-9\/_.-]*.ico$/.test(req.url.toString())){
				sendFileContent(res, req.url.toString().substring(1), "text/ico");
			}else if(/^\/[a-zA-Z0-9\/_.-]*.woff2$/.test(req.url.toString())){
				sendFileContent(res, req.url.toString().substring(1), "text/woff2");
			}else if(/^\/[a-zA-Z0-9\/_.-]*.map$/.test(req.url.toString())){
				sendFileContent(res, req.url.toString().substring(1), "text/map");
			}else if(/^\/[a-zA-Z0-9\/_.-]*.woff$/.test(req.url.toString())){
				sendFileContent(res, req.url.toString().substring(1), "text/woff");
			}else if(/^\/[a-zA-Z0-9\/_.-]*.ttf$/.test(req.url.toString())){
				sendFileContent(res, req.url.toString().substring(1), "text/ttf");
			}*/else{
				console.log("Requested URL is: " + req.url);
				res.end();
			}
		}
	});

	server.listen(4242);

	console.log("Server is running，time is" + new Date());


	function sendFileContent(response, fileName, contentType){
		fs.readFile(fileName, function(err, data){
			if(err){
				response.writeHead(404);
				response.write("Not Found!");
			}else{
				response.writeHead(200, {'Content-Type': contentType});
				response.write(data);
			}
			response.end();
		});
	}
 }).call(this);
