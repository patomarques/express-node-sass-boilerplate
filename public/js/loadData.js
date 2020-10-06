$(document).ready(function () {
    var data_qualitative_name = {
        cargo: 'Cargueira',
        child: 'Criança',
        helmet: 'Capacete',
        service: 'Serviço',
        sharing_child: 'Carona Criança',
        sharing_men: 'Carona Homem',
        sharing_women: 'Carona Mulher',
        sidewal: 'Calçada',
        women: 'Mulher',
        wrong_way: 'Contramão'
    };

    var data_quantity_name = {
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

        var data_table_qty = loadDataTable(el_list_ciclysts_qty_by_hour);
        var data_table_percent = loadDataTable(el_list_ciclysts_percent_by_hour);

        setDataTableCountingQty(data_table_qty, response);
        setDataTableCountingPercent(data_table_percent, response);
        
        loadGraphs(response);
    });

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
        
        for(index = 0; index < data_qualitative.length; index++){
            el_table.row.add(data_qualitative[index]).draw(false);
        }
    }

    function getDataTableQtyFormatted(data){
        console.log('total -> ', data);

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
            //el_table.row.add(data_formmat).draw(false);
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

    function loadBarChart(element, data) {
        var data = [{
            x: ['6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19'],
            y: [11.2, 3.2, 5.6, 9.9, 5.2, 0, 1.8, 1.8, 3.1, 2.7, 8.5, 4.5, 5.5, 8.3],
            type: 'bar',
            marker: {
                color: '#008080'
            }
        }];

        Plotly.newPlot(element, data);
    }

    function loadBarChartHorizontal(element, data) {
        var data = [{
            type: 'bar',
            x: [5.3, 0, 9.3, 2.2, 14.7, 5, 25.4, 0],
            y: ['Mulheres', 'Crianças e adolescentes', 'Capacete', 'Caronas', 'Cargueiras', 'Serviço', 'Contramão', 'Calçada'],
            orientation: 'h',
            marker: {
                color: '#008080'
            }
        }];

        Plotly.newPlot(element, data);

    }

    function loadBarChartCompare(element, data) {
        var trace1 = {
            x: ['Mulheres', 'Homens', 'Crianças e Adolescentes'],
            y: [20, 14, 23],
            name: 'Horário',
            type: 'bar',
            marker: {
                color: '#008080'
            }
        };

        var trace2 = {
            x: ['Mulheres', 'Homens', 'Crianças e Adolescentes'],
            y: [12, 18, 29],
            name: 'Ciclistas',
            type: 'bar',
            marker: {
                color: '#ff0000'
            }
        };

        var data = [trace1, trace2];

        var layout = {
            barmode: 'stack'
        };


        Plotly.newPlot(element, data, layout);
    }
});