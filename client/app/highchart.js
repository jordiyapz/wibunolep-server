class Hchart {
    constructor (elemId, title, y_axis_title, seriesName, color = "#808080") {
        this._data = 0;
        this._seriesName = seriesName;
        this._seriesData = [{ x: (new Date()).getTime(), y: 0 }];
        this._loaded = false;
        this._chart = Highcharts.chart(elemId, {
            title: { text: title },

            credits: {
                enabled: false
            },

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
            }],

            tooltip: {
                formatter: function ()  {
                    // const name = seriesName;
                    // const _date = Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x);
                    // const value = Highcharts.numberFormat(this.y, 2);

                    return '<b>'+seriesName+'</b><br/>'+(this.y);
                }
                // name: seriesName,
                // data: [0,0,0,0,0,0,0,0,0]
            },

            // Warna untuk setiap jenis data
            colors: ['#2bC08f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066',
                '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],

            chart: {
                type: 'areaspline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                plotBorderColor: '#606063'
            },

            plotOptions: {
                areaspline: {
                    fillOpacity: 0.5
                }
            }

        })

        // this._chart.hcEvents.load[0] = () => {
        this._onLoad();
    }

    update (_data) {
        // this._data = data;
        // console.log(this._chart.series);
        this._chart.series[0].setData(_data, true, true, false);
        this._chart.series[0].name = this._seriesName;
    }
    _onLoad () {
        let checker = setInterval(() => {
            if (this._loaded) {
                clearInterval(checker);
                this._chartOnLoad();
            }
        }, 25);
    }
    _chartOnLoad () {
        const series = this._chart.series[0];
        setInterval(() => {
            const x = (new Date()).getTime(); // current time
            const y = this._data;
            const shift_rule = series.data.length > 20;
            series.addPoint([x, y], true, shift_rule);
        }, 1000);
    }
}

function chartOnLoad (chart) {
    // set up the updating of the chart each second
    const series = chartseries[0];
    setInterval(() => {
        const x = (new Date()).getTime(); // current time
        const y = this._data;
        const shift_rule = series.data.length > 20;
        series.addPoint([x, y], true, shift_rule);
    }, 1000);
}