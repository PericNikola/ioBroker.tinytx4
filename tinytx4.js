/* jshint -W097 */// jshint strict:false
/*jslint node: true */
'use strict';

const SerialPort = require("serialport");
const Readline = SerialPort.parsers.Readline;
var sp = null;

// you have to require the utils module and call adapter function
const utils = require('@iobroker/adapter-core'); // Get common adapter utils

// read the adapter name from package.json
const adapterName = require('./package.json').name.split('.').pop();

/*Variable declaration, since ES6 there are let to declare variables. Let has a more clearer definition where 
it is available then var.The variable is available inside a block and it's childs, but not outside. 
You can define the same variable name inside a child without produce a conflict with the variable of the parent block.*/

function write_cmd(command){

    sp.write(command, function(err) {
        if (err) {
            return adapter.log.debug('Error on write: ', err.message);
            }
        adapter.log.debug('message to USB-stick written : ' + command);
    });
}
function definetinytx(id, name){    
    adapter.setObjectNotExists('tinytx4_' + id, {
        type: 'channel',
        common: {
            name: name,
            role: 'sensor'
        },
        native: {
            "addr": id
        }
    });
    adapter.log.info('RFM12B setting up object = ' + adapterName + '_' + id);
    
	adapter.setObjectNotExists(adapterName + '_' + id + '.voltage', {
        type: 'state',
        common: {
            "name":     "Voltage",
            "type":     "number",
            "unit":     "V",
            "min":      0,
            "max":      5,
            "read":     true,
            "write":    false,
            "role":     "value.voltage",
            "desc":     "voltage"
        },
        native: {}
    });
    adapter.setObjectNotExists(adapterName + '_' + id + '.temp', {
        type: 'state',
        common: {
            "name":     "Temperature",
            "type":     "number",
            "unit":     "°C",
            "min":      -50,
            "max":      50,
            "read":     true,
            "write":    false,
            "role":     "value.temperature",
            "desc":     "Temperature"
        },
        native: {}
    });
    adapter.setObjectNotExists(adapterName + '_' + id + '.humid', {
        type: 'state',
        common: {
            "name":     "Humidity",
            "type":     "number",
            "unit":     "%",
            "min":      0,
            "max":      100,
            "read":     true,
            "write":    false,
            "role":     "value.humidity",
            "desc":     "Humidity"
        },
        native: {}
    });
}
function logtinytx(data){
    var tmp = data.split(' ');
	
	adapter.log.debug('raw Data from Serial Port: ' + data);	//SensorID
	
	//adapter.log.debug('Sensor ID: ' + tmp[0]);	//SensorID
	var SensorID = tmp[0];	//SensorID
	
	var MessWerte = tmp[1].split('&');
	
	//adapter.log.debug('Batterie Spannung: ' + MessWerte[0].slice(2,6)/1000);  	//Spannung
	var BattSpannung = 	MessWerte[0].slice(2,6)/1000;  	//Batterie Spannung
		
	//adapter.log.debug('Temperatur: ' + MessWerte[1].slice(2,6)/100);			//Temperatur
	var Temperatur = MessWerte[1].slice(2,6)/100;			//Temperatur
	
	//adapter.log.debug('Feuchtigkeit: ' + MessWerte[2].slice(2,6)/100);			//Feuchtigkeit
	var Feuchtigkeit= MessWerte[2].slice(2,6)/100;			//Feuchtigkeit
	
    if(!isNaN(tmp[0])){                      // Wenn ein Datensatz sauber gelesen wurde
        
            //var tmpp=tmp.splice(2,8);       // es werden die vorderen Blöcke (0,1) entfernt
            //adapter.log.debug('splice       : '+ tmpp);
            //var buf = new Buffer(tmpp);
            var array=getConfigObjects(adapter.config.sensors, 'sid' , SensorID);
						
            if (array.length === 0 || array.length !== 1) {
            adapter.log.debug('received ID : ' + SensorID + ' is not defined in the adapter Configuration');
            }	else if (array[0].stype !==  adapterName){
					adapter.log.debug('received ID : ' + SensorID + ' is not defined in the adapter as '+ adapterName);
            }	else if (array[0].usid != 'nodef'){
                						
                // Werte schreiben
                adapter.setState(adapterName + '_' + array[0].usid +'.humid',    {val: (Feuchtigkeit), ack: true});
                adapter.setState(adapterName + '_' + array[0].usid +'.temp',     {val: (Temperatur), ack: true});
                adapter.setState(adapterName + '_' + array[0].usid +'.voltage',   {val: (BattSpannung), ack: true});                
            }
     }
}


// create adapter instance wich will be used for communication with controller
let adapter;
function startAdapter(options) {
	options = options || {};
	Object.assign(options, {
        // name has to be set and has to be equal to adapters folder name and main file name excluding extension
        name: adapterName,
        // is called when adapter shuts down - callback has to be called under any circumstances!
        unload: function (callback) {
            try {
                adapter.log.info('cleaned everything up...');
                callback();
            } catch (e) {
                callback();
            }
        },
        // is called if a subscribed object changes
        objectChange: function (id, obj) {
            // Warning, obj can be null if it was deleted
            adapter.log.info('objectChange ' + id + ' ' + JSON.stringify(obj));
        },
        // is called if a subscribed state changes
        stateChange: function (id, state) {
            // Warning, state can be null if it was deleted
            adapter.log.info('stateChange ' + id + ' ' + JSON.stringify(state));
        
            // you can use the ack flag to detect if it is status (true) or command (false)
            if (state && !state.ack) {
                adapter.log.info('ack is not set!');
            }
        },
        // Some message was sent to adapter instance over message box. Used by email, pushover, text2speech, ...
        //message: function (obj) {
            //if (typeof obj === 'object' && obj.message) {
               // if (obj.command === 'send') {
                    // e.g. send email or pushover or whatever
                 //   console.log('send command');
        
                    // Send response in callback if required
                  //  if (obj.callback) adapter.sendTo(obj.from, obj.command, 'Message received', obj.callback);
                //}
           // }
        //},
        // is called when databases are connected and adapter received configuration.
        // start here!
        ready: () => main()
    });
    // you have to call the adapter function and pass a options object
    // adapter will be restarted automatically every time as the configuration changed, e.g system.adapter.template.0
	adapter = new utils.Adapter(options);

	return adapter;
};

function main() {
    // The adapters config (in the instance object everything under the attribute "native") is accessible via
    // adapter.config:
	adapter.log.debug('start of main');
    var obj = adapter.config.sensors;
    for (var anz in obj){
        if(obj[anz].stype==adapterName){
            definetinytx(obj[anz].usid, obj[anz].name);
        }
    }

    var options = {
        baudRate:   parseInt(adapter.config.baudrate)   || parseInt(9600)
    };
	adapter.log.debug('configured port : ' + adapter.config.serialport );
	adapter.log.debug('configured baudrate : ' + adapter.config.baudrate );
	adapter.log.debug('options : ' + JSON.stringify(options) );	
    	const sp = new SerialPort(adapter.config.serialport || '/dev/ttyUSB0', options, function (error) {
        if ( error ) {
            adapter.log.info('failed to open: '+error);
        } else {
            adapter.log.info('open');
	    const parser = sp.pipe(new Readline({ delimiter: '\r\n' }));

            parser.on('data', function(data) {

                //adapter.log.info('data received: ' + data);
                if ( data.startsWith('H0')){
                    logHMS100TF(data);
                }
                else {
                    var tmp = data.split(' ');
				
                    if(!isNaN(tmp[0])){
						logtinytx(data);
					} else {
						//adapter.log.info('data received 1448: ' + data);	
					}
                }
            });
	    if (adapter.config.command_en) {
                setTimeout(write_cmd(adapter.config.command) , 1500); //1,5s Verzögerung
            }
        }
    });


    // in this template all states changes inside the adapters namespace are subscribed
    adapter.subscribeStates('*');


}

// If started as allInOne/compact mode => return function to create instance
if (module && module.parent) {
    module.exports = startAdapter;
} else {
    // or start the instance directly
    startAdapter();
} 
