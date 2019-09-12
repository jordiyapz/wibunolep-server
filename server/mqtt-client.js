// MQTT-client

const mqtt_url = 'mqtt://soldier.cloudmqtt.com:14608';


const mqtt_client_options = {
	username: 'wyyyrgco',
	password: 'jpOZK7lVUmlR',
	clientId: 'Wibunolep-Server'
}

const topics = [
	'/client',
	'/AsCender/serial/tx',
	'/AsCender/serial/rx',
	'/AsCender/payload'
];

const mqtt = require ('mqtt');
const client = mqtt.connect(mqtt_url, mqtt_client_options);

/**onConnect
 * mqtt server will send a connack packet (connection acknowledgement)
*/
client.on('connect', connack => {
	console.log('Connected to mqtt server');
    client.subscribe(topics);
    client.publish(topics[0], mqtt_client_options.clientId);
    // client.on('message', (topic, payload, packet) => {
    //     const message = payload.toString();
    //     console.log(`Received from ${topic}: ${message}`);
    // })
})

client.on('error', error => {
	// cannot connect
	console.log(error);
})

module.exports = client;