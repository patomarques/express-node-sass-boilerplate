$(document).ready(function () {
    var id = "5f6e4ba4a2cbeb001406952d";
    var id2 = "5f6e4ba2a2cbeb001406952c";

    function setDataCountingDOM(data) {
        console.log(data.date);
        $('.title-couting').html(data.name);
        $('.date-counting.date-br').html(new Date(data.date).toLocaleDateString());

        // var textInfo = "Contagem realizada na " + data.name + ", no dia " + new Date(data.date).toLocaleDateString() + ".";
        // $('#section-couting-info .title-section').html(textInfo);
    }

    var dataCounting = getDataCoutingDetails();

    graph_cyclists_by_hour = document.getElementById('graph_ciclysts_by_hour');
    graph_details_percent = document.getElementById('graph_ciclysts_percent_by_hour');
    graph_total_by_percent = document.getElementById('graph_total_by_percent');

    loadBarChartCompare(graph_cyclists_by_hour, dataCounting);
    loadBarChartHorizontal(graph_details_percent, dataCounting);
    loadBarChart(graph_total_by_percent, dataCounting);

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

    function getDataCoutingDetails() {
        var id = window.location.href.split('/contagem/')[1];

        if (id === undefined) {
            window.location.href = "/";
            return;
        }

        var urlCouting = "https://api.plataforma.ameciclo.org/contagens/v1/cyclist-count/" + id;

        return fetch(urlCouting)
            .then(response => response.json())
            .then(data => {
                console.log('contagem details -> ', data);
                setDataCountingDOM(data);

                return data;
            })
            .catch(error => console.error(error));
    }

});