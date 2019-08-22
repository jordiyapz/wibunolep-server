class Hchart {
    constructor (elemId, title, y_axis_title, seriesName, color = "#808080") {
        this._data = null;
        this._seriesData = [];
        Highcharts.chart(elemId, {
            title: { text: title },

            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },

            yAxis: {
                title: { text: y_axis_title }
            },

            series: [{
                name: seriesName,
                data: this._seriesData
                // data: (function () {
                //     // generate an array of random data
                //     const data = [];
                //     const time = (new Date()).getTime();
                //     for (let i = -19; i <= 0; i += 1) {
                //         data.push({
                //             x: time + i * 1000,
                //             y: acc.x
                //         });
                //     }
                //     return data;
                // }())
            }],

            tooltip: {
                formatter: () => {
                    const name = this.series.name;
                    const date = Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x);
                    const value = Highcharts.numberFormat(this.y, 2);
                    return `<b>${name}</b><br/>${date}<br/>${value}`;
                }
            },

            chart: {
                type: 'line',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    // graphic onLoad event
                    load: () => {
                    // set up the updating of the chart each second
                        const series = this.series[0];
                        setInterval(() => {
                                const x = (new Date()).getTime(); // current time
                                const y = this._data;
                                const shift_rule = series.data.length > 20;
                                series.addPoint([x, y], true, shift_rule);
                        }, 1000);
                    }
                }
            },

        })
    }

    update (data) {
        this._data = data;
    }
}
/*
Highcharts.chart('grafik-acc-x', {
    chart: {
        type: 'spline',
        animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        events: {
            load: function () {
            // set up the updating of the chart each second
                var series = this.series[0];
                setInterval(function () {
                        var x = (new Date()).getTime(), // current time
                            y = acc.x;
                        series.addPoint([x, y], true, true);
                }, 1000);
            }
        }
    },
    title: {
        text: 'Grafik Acc X'
    },
    xAxis: {
        type: 'datetime',
        tickPixelInterval: 150
    },
    yAxis: {
        title: {
            text: 'm/s^2'
        },
        plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
        }]
    },
    tooltip: {
        formatter: function () {
            return '<b>' + this.series.name + '</b><br/>' +
                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                Highcharts.numberFormat(this.y, 2);
        }
    },
    legend: {
        enabled: false
    },
    exporting: {
        enabled: false
    },
    series: [{
        name: 'Acc data',
        data: (function () {
            // generate an array of random data
            var data = [];
            let time = (new Date()).getTime();

            for (i = -19; i <= 0; i += 1) {
                data.push({
                    x: time + i * 1000,
                    y: acc.x
                });
            }
            return data;
        }())
    }]
});
*/