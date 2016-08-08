var tcp = require("tcp-ping");
var chalk = require("chalk");
var fs = require("fs");

var hosts = null;
fs.readFile('hosts.json',"utf8", function (err, data) {
  if (err) throw err;
  console.log(data);
  hosts = JSON.parse(data);
  if(hosts != null)
  	setInterval(pingHosts,2000, hosts); //argument is passed as third param: check : https://nodejs.org/api/timers.html
});


function pingHosts(hosts){
	hosts.forEach(function(current, index, array){
		tcp.probe(current.address ,80,function (err,data){
		//we have the host avaliable
		if(data){
			tcp.ping(current,function(err,data){
				console.log(chalk.bold(data.address) +": \t "+chalk.green("OK") + ". Latency: \t~"+ chalk.white.bold(Math.round(data.avg))+"ms");
			});
		}
		//host not available
		else {
			console.error(chalk.bold.red("Host "+ current.address +" not available, not pinging."));
		}

	});
	});

}

