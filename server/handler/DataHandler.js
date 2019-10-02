class DataHandler {
    constructor() {
        this._dataTable = {
            length: 10,
            lastData: {
                raw: null,
                clean: null
            },
            history: []
        }

        this._chartSeries = {
            length: 10,
            alt: [],
            as: [],
            gs: []
        }
    }

    get() {
        return this._dataTable;
    }

    getpack() {
        const lastData = this._dataTable.lastData;
        return {
            clean: lastData.clean,
            raw: lastData.raw,
            series: this._chartSeries
        }
    }

    update(new_data) {
        // [head, alt, lat, lon, roll, pitch, yaw, heading, airspeed, groundspeed, mode, armed]
        const clean = this._parser(new_data);
        const dataTable = this._dataTable;
        dataTable.lastData = {clean, raw: new_data};
        const history = dataTable.history;
        if (history.length > dataTable.length) {
            history.shift();
        }
        history.push(new_data);
        // Process chart data
        const series = this._chartSeries;
        this.seriesProcess(series.alt, clean[1]);
        this.seriesProcess(series.as, clean[8]);
        this.seriesProcess(series.gs, clean[9]);
    }

    seriesProcess(table, data) {
        const currentTime = (new Date()).getTime();
        if (table.length >= this._chartSeries.length) {
            table.shift();
        }
        // table.push(parseInt(data));
        table.push({
            x: currentTime,
            y: parseFloat(data)
        })
    }

    /**
     *
     * @param {String} data
     * @returns
     *  [<header>, <latitude>, <longitude>, <humidity>, <temperature>, <acc_x>, <acc_x>, <acc_x>, <gyro_x>, <gyro_y>, <gyro_z>]
     */
    _parser(data) {
        const regex = /([0-9|a-z|A-Z|\.|-]*)/g;
        let hasilParsing = [];
        data.match(regex).forEach(element => {
            if (element != '')
                hasilParsing.push(element);
        });
        return hasilParsing;
    }
}
const dh = new DataHandler();
module.exports = dh;