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
            acc_x: [],
            acc_y: [],
            acc_z: [],
            temp: []
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
        // [<header>, <latitude>, <longitude>, <humidity>, <temperature>, <acc_x>, <acc_x>, <acc_x>, <gyro_x>, <gyro_y>, <gyro_z>]
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
        this.seriesProcess(series.acc_x, clean[5]);
        this.seriesProcess(series.acc_y, clean[6]);
        this.seriesProcess(series.acc_z, clean[7]);
        this.seriesProcess(series.temp, clean[4]);
    }

    seriesProcess(table, data) {
        const currentTime = (new Date()).getTime();
        if (table.length >= this._chartSeries.length) {
            table.shift();
        }
        // table.push(parseInt(data));
        table.push({
            x: currentTime,
            y: parseInt(data)
        })
    }

    /**
     *
     * @param {String} data
     * @returns
     *  [<header>, <latitude>, <longitude>, <humidity>, <temperature>, <acc_x>, <acc_x>, <acc_x>, <gyro_x>, <gyro_y>, <gyro_z>]
     */
    _parser(data) {
        const regex = /([0-9|\.|-]*)/g;
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