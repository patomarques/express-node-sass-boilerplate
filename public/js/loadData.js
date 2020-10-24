$(document).ready(function () {
    var colorsGreen = ['#008080', '#66b2b2', '#003333', '#004c4c', '#006666', '#008080', '#198c8c', '#4ca6a6', '#66b2b2', '#cce5e5'];

    var dataQualitativeLabels = {
        cargo: 'Cargueira',
        child: 'Criança',
        helmet: 'Capacete',
        service: 'Serviço',
        sharing_child: 'Carona Criança',
        sharing_men: 'Carona Homem',
        sharing_women: 'Carona Mulher',
        sidewalk: 'Calçada',
        women: 'Mulher',
        wrong_way: 'Contramão'
    };

    var dataQuantityLabels = {
        east_north: 'Leste-Norte',
        east_south: 'Leste-Sul',
        east_west: 'Leste-Oeste',
        north_east: 'Norte-Leste',
        north_south: 'Norte-Sul',
        north_west: 'Norte-Oeste',
        south_east: 'Sul-Oeste',
        south_north: 'Sul-Norte',
        south_west: 'Sul-Oeste',
        west_east: 'Oeste-Leste',
        west_north: 'Oeste-Norte',
        west_south: 'Oeste-Sul'
    };

    var dataPercentLabels = {
        women_percent: 'Mulheres',
        children_percent: 'Crianças e Adolescentes',
        sharing_percent: 'Compartilhado'
    };

    var el_list_ciclysts_qty_by_hour = $('#list-ciclysts-qty-by-hour');
    var el_list_ciclysts_percent_by_hour = $('#list-ciclysts-percent-by-hour');

    var urlCounting = getUrlCoutingDetails();

    async function getDataAsync() {
        let response = await fetch(urlCounting).then(response => response.json())
            .then(data => {
                return data;
            })
            .catch(error => console.error(error));

        return response;
    }

    getDataAsync().then(response => {
        setDataCountingDOM(response);

        hideLoading();

        var data_table_qty = loadDataTable(el_list_ciclysts_qty_by_hour);
        var data_table_percent = loadDataTable(el_list_ciclysts_percent_by_hour);

        setDataTableCountingQty(data_table_qty, response);
        setDataTableCountingPercent(data_table_percent, response);

        loadGraphs(response);
    });

    function hideLoading(){
        $('.overflow-screen').hide();
    }

    function loadGraphs(dataCounting) {
        graph_cyclists_by_hour = document.getElementById('graph_ciclysts_by_hour');
        graph_details_percent = document.getElementById('graph_ciclysts_percent_by_hour');
        graph_total_by_percent = document.getElementById('graph_total_by_percent');

        loadBarChartCompare(graph_cyclists_by_hour, dataCounting);
        loadBarChartHorizontal(graph_details_percent, dataCounting);
        loadBarChart(graph_total_by_percent, dataCounting);
    }

    function loadDataTable(el) {
        return el.DataTable({
            "language": {
                "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Portuguese.json"
            },
            paging: false,
            searching: false,
            ordering: false
        });
    }

    function getUrlCoutingDetails() {
        var id = window.location.href.split('/contagem/')[1];

        if (id === undefined) {
            window.location.href = "/";
            return;
        }

        return "https://api.plataforma.ameciclo.org/contagens/v1/cyclist-count/" + id;
    }

    function setDataTableCountingQty(el_table, data) {
        var data_qualitative = getDataTableQtyFormatted(data);

        for (index = 0; index < data_qualitative.length; index++) {
            el_table.row.add(data_qualitative[index]).draw(false);
        }
    }

    function getDataTableQtyFormatted(data) {
        var data_qualitative = data.data.qualitative;
        var data_formatted = [];

        for (const el in data_qualitative) {
            var data_per_hour = data_qualitative[el].count_per_hour;
            var data_formating = [];

            data_formating.push(el);

            for (const index in data_per_hour) {
                data_formating.push(data_per_hour[index]);
            }

            data_formatted.push(data_formating);
        }

        return data_formatted;
    }

    function setDataTableCountingPercent(el_table, data) {
        var data_qualitative = data.data.quantitative;

        for (const el in data_qualitative) {
            var data_per_hour = data_qualitative[el].count_per_hour;
            var data_formmat = [];

            data_formmat.push(el);

            for (const index in data_per_hour) {
                data_formmat.push(data_per_hour[index]);
            }

            el_table.row.add(data_formmat).draw(false);
        }
    }

    function setDataCountingDOM(data) {
        $('.title-couting').html(data.name);
        $('.date-counting.date-br').html(new Date(data.date).toLocaleDateString());
    }

    function calculatePercent(ammount){
        return (ammount * 100).toFixed(1);
    }

    function loadBarChart(element, data) {
        var traces = [];
        console.log('data ', data);
        var qualitative = data.summary;

        var indexQualitative = 0;
        var keys = getQualitativesX(data.data.qualitative);

        for (const key in qualitative) {
            console.log('graphic 2 -> ', keys, qualitative[key]);

            if (key != 'total' && key != 'hour_max') {

                let trace = {
                    x: keys[0],
                    y: calculatePercent(qualitative[key]),
                    name: key,
                    type: 'bar',
                    marker: {
                        color: colorsGreen[indexQualitative++]
                    }
                };

                traces.push(trace);
            }
        }

        console.log('grafico 2 ', traces);

        var data = traces;

        var data = [{
            x: ['6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'],
            y: [11.2, 3.2, 5.6, 9.9, 5.2, 0, 1.8, 1.8, 3.1, 2.7, 8.5, 4.5, 5.5, 8.3],
            type: 'bar',
            marker: {
                color: '#008080'
            }
        }];

        var layout = {
            barmode: 'stack',
            font: {
                size: 16
            },
            legend: {
                xanchor: "top",
                yanchor: "center",
                orientation: 'h'
            }
        };

        Plotly.newPlot(element, data, layout);
    }

    function loadBarChartHorizontal(element, data) {
        console.log('data ', data);

        var keys = [];
        var percents = [];
        var percents_text = [];

        const percent = data.summary;

        for (const key in percent) {
            if (key != 'total' && key != 'hour_max') {
                keys.push(dataPercentLabels[key]);

                let value = percent[key] * 100;
                value = value.toFixed(1);
                percents.push(value);
                percents_text.push(value + '%');
            }
        }

        console.log('percents ', percents.reverse());
        console.log('keys ', keys.reverse());

        var data = [{
            type: 'bar',
            x: percents.reverse(),
            y: keys.reverse(),
            text: percents_text.reverse(),
            showlegend: false,
            textposition: 'auto',
            orientation: 'h',
            marker: {
                color: '#008080'
            }
        }];

        var layout = {
            barmode: 'stack',
            font: {
                size: 16
            },
            legend: {
                xanchor: "top",
                yanchor: "center",
                orientation: 'h'
            }
        };

        Plotly.newPlot(element, data, layout);

    }

    function loadBarChartCompare(element, data) {
        var traces = [];

        var qualitative = data.data.qualitative;

        var indexQualitative = 0;
        var keys = getQualitativesX(qualitative);

        for (const key in qualitative) {
            let trace = {
                x: keys[0],
                y: getQualitativesY(qualitative[key]),
                name: dataQualitativeLabels[key],
                type: 'bar',
                marker: {
                    color: colorsGreen[indexQualitative++]
                }
            };

            traces.push(trace);
        }

        var data = traces;

        var layout = {
            barmode: 'stack',
            font: {
                size: 16
            },
            legend: {
                xanchor: "top",
                yanchor: "center",
                orientation: 'h'
            }
        };

        Plotly.newPlot(element, data, layout);
    }

    function getQualitativesX(objectList) {
        var qualitatives = [];

        for (const key in objectList) {
            var indexes = Object.keys(objectList[key].count_per_hour);
            var result = indexes.map(function (index) {
                return parseInt(index, 10);
            });

            qualitatives.push(result);
        }

        return qualitatives;
    }

    function getQualitativesY(objectList) {
        return Object.values(objectList.count_per_hour);
    }
});