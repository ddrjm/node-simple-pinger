var tcp = require("tcp-ping");
var chalk = require("chalk");
var fs = require("fs");
var nodemailer = require('nodemailer');
var config = require("./config");

console.log(config);

// read the hosts.json file
var hosts = null;
fs.readFile('hosts.json',"utf8", function (err, data) {
  if (err) throw err;
  console.log(data);
  hosts = JSON.parse(data);
  if(hosts != null)
  	setInterval(pingHosts,config.checkTimeout, hosts); //argument is passed as third param: check : https://nodejs.org/api/timers.html
});


function pingHosts(hosts){
	hosts.forEach(function(current, index, array){
		tcp.probe(current.address ,80,function (err,data){
		//we have the host avaliable
		if(data){
			tcp.ping(current,function(err,data){
				if (err) throw err;
				console.log(chalk.bold(data.address) +": \t "+chalk.green("OK") + ". Latency: \t~"+ chalk.white.bold(Math.round(data.avg))+"ms");
			});
		}
		//host not available
		else {
			console.error(chalk.bold.red("Host "+ current.address +" not available, not pinging."));
			//send zhe emailzz
			var smtpTransport = nodemailer.createTransport(config.smtp.transportString);


			//create the message
			var mailOptions = {
			    from: config.smtp.from, // sender address 
			    to: config.smtp.to, // list of receivers 
			    subject: 'Fire Alert!', // Subject line 
			    text: 'The website ' + current.address + " isn't responding!", // plaintext body 
			    html: '<b>The website ' + current.address + " isn't responding!</b>" // html body 
			};
			
			//fire the cannon
			smtpTransport.sendMail(mailOptions, function(error, info){
    			if(error){
        			return console.log(chalk.red(error));
    			}
    			console.log(chalk.green('Message sent: ' + chalk.white.bold(info.response)));
			});

		}

	});
	});

}

