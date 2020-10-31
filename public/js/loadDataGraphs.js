document.addEventListener('DOMContentLoaded', function () {
    $("html, body").scrollTop(0);
}, false);

$(document).ready(function () {
    var colors = ['#008080', '#66b2b2', '#003333', '#004c4c', '#006666', '#008080', '#198c8c', '#4ca6a6', '#66b2b2', '#cce5e5', '#d0deae'];

    var dataQualitativeLabels = {
        cargo: 'Cargueira',
        child: 'Crianças e Adolecentes',
        helmet: 'Capacete',
        service: 'Serviço',
        sharing_child: 'Carona Criança',
        sharing_men: 'Carona Homem',
        sharing_women: 'Carona Mulher',
        sidewalk: 'Calçada',
        women: 'Mulheres',
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

    var axiosX = [11.2, 3.2, 5.6, 9.9, 5.2, 0, 1.8, 1.8, 3.1, 2.7, 8.5, 4.5, 5.5, 8.3];
    var axiosY = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
    var options = [];
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

        loadGraphs(response);
    });

    function hideLoading() {
        $('.overflow-screen').hide();
        $('body').removeClass('scroll-blocked');
    }

    function getUrlCoutingDetails() {
        var id = window.location.href.split('/contagem/')[1];

        if (id === undefined) {
            window.location.href = "/";
            return;
        }

        return "https://api.plataforma.ameciclo.org/contagens/v1/cyclist-count/" + id;
    }

    function setDataCountingDOM(data) {
        $('.title-couting').html(data.name);
        $('.date-counting.date-br').html(new Date(data.date).toLocaleDateString());
    }

    function loadGraphs(dataCounting) {
        var graph_cyclists_by_hour = 'graph_ciclysts_by_hour';
        var graph_details_percent = 'graph_ciclysts_percent_by_hour';
        var graph_total_by_percent = 'graph_total_by_percent';

        loadBarChartCompare(graph_cyclists_by_hour, dataCounting);
        loadBarChartHorizontal(graph_details_percent, dataCounting);
        loadBarChart(graph_total_by_percent, dataCounting);
    }

    function loadBarChart(element, data) {
        var datasets = [];
        var qualitative = data.data.qualitative;
        let index = 0;

        for (const key in qualitative) {            
            if (key == 'women' || key == 'child') {
                var el = {
                    label: dataQualitativeLabels[key],
                    data: Object.values(qualitative[key].count_per_hour),
                    backgroundColor: colors[index++ * 2],
                    borderColor: [
                        colors[8]
                    ],
                    borderWidth: 1
                }

                datasets.push(el);
            }
        }

        var myChart = new Chart(element, {
            type: 'bar',
            data: {
                labels: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
                datasets: datasets
            },
            options: {
                scales: {
                    xAxes: [{
                        stacked: true
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                }
            }
        });
    }

    function loadBarChartHorizontal(element, data) {
        var myBarChart = new Chart(element, {
            type: 'horizontalBar',
            data: {
                labels: ['Mulheres', 'Crianças', 'Capacete', 'Carona', 'Cargueiras', 'Serviço', 'Contra-mão', 'Calçada'],
                datasets: [{
                    label: 'Hora',
                    data: [5.3, 0, 9.3, 2.2, 14.7, 5.0, 25.4, 0],
                    backgroundColor: [
                        colors[5], colors[5], colors[5], colors[5], colors[5], colors[5], colors[5], colors[5]
                    ],
                    borderColor: [
                        colors[0]
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    function loadBarChartCompare(element, data) {

        var barChartData = {
            labels: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
            datasets: [{
                label: 'Crianças e Adolescentes',
                backgroundColor: colors[9],
                data: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
                ]
            }, {
                label: 'Mulheres',
                backgroundColor: colors[10],
                data: [
                    16, 7, 7, 9, 4, 0, 1, 1, 2, 2, 4, 6, 6, 8
                ]
            }, {
                label: 'Homens',
                backgroundColor: colors[0],
                data: [
                    127, 215, 117, 82, 73, 90, 54, 56, 62, 73, 86, 127, 138, 55
                ]
            }]
        };

        window.myBar = new Chart(element, {
            type: 'bar',
            data: barChartData,
            options: {
                title: {
                    display: false
                },
                tooltips: {
                    mode: 'index',
                    intersect: false
                },
                responsive: true,
                scales: {
                    xAxes: [{
                        stacked: true
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                }
            }
        });
    }
   
});