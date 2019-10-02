(function( $ ) {
 
    $.fn.battery = function(options) {
        var maxVal = 100;
        var settings = $.extend({
            batteryColor: "#61c419",
            backgroundColor: "lightgrey",
            maxWidth: 150,
            textColor: '#fff'
        }, options );


        var element = this;
        this.append(" <div class='bat-border'><div class='batFill'></div></div><div class='bat-ico'></div>");

        function showBattery(currentVal,targetVal)
        {
            var targetWidth = ((settings.maxWidth/maxVal)*targetVal).toFixed(2);
            var currentPercent = ((currentVal/targetVal)*100).toFixed(0);
            var fill = $(".batFill", element);
            fill.width(targetWidth);
            fill.css("background-image", createGradient(settings.batteryColor, settings.backgroundColor, currentPercent));
            var textElement = "<div class='bat-text'>"+currentVal+"%</div>";
            fill.html(textElement);
            $('.bat-text').css("color", settings.textColor);
        }

        function createGradient(primaryColor, secondaryColor, percentage){
            var gradient = "linear-gradient(to right, {primaryColor} 0%, {primaryColor} {percentage}%, {secondaryColor} {percentage}% , {secondaryColor} 100%)";
            gradient = replace(gradient, "{primaryColor}", primaryColor);
            gradient = replace(gradient, "{secondaryColor}", secondaryColor);
            gradient = replace(gradient, "{percentage}", percentage);
            return gradient;
        }

        function replace(text, what, value){
            return text.replace(new RegExp(what, 'g'), value);
        }

        var update  = function(value) {
            showBattery(value, maxVal);
            return element;
        }
        showBattery(40,maxVal);
        return {
            Update: update
        }
 
    };
 
}( jQuery ));