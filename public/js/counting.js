$(document).ready(function () {
    var table_list_qty_by_hour = $('#list-ciclysts-qty-by-hour').DataTable({
        "language": {
            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Portuguese.json"
        }
    });

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

    function setDataCountingDOM(data) {
        if (data !== undefined) {
            data.forEach(function (el, index) {
                console.log(index, el);
                table_list_qty_by_hour.row.add([
                    data_qualitative_name[index],
                    new Date(el.date).toLocaleDateString(),
                    el.summary.total,
                    (el.summary.women_percent * 100).toFixed(1) + '%',
                    '',
                    '',
                    ''
                ]).draw(false);
            });
        }

    }
});