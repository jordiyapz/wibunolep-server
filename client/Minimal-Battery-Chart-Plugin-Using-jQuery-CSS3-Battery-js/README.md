How to use.

Include jquery in you html page. Also include battery.js and styles.css from src folder in your page.

to create battery chart just call: var battery = $("#battery").battery();

to update char value call: battery.Update(value);

see demo page if you need more info.

Options: backgroundColor: background color of battery chart - default is: lightgrey 
batteryColor: main color of battery chart - default is: #61c419 
maxWidth: width of chart- default is: 150px
