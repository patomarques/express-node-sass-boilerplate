function setCoutingTableDOM(data) {
    var table_el = $('#table-counting').DataTable({
        "language": {
            "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Portuguese.json"
        }
    });
    //var link_cyclist_count = "https://api.plataforma.ameciclo.org/contagens/v1/cyclist-count/";
    var link_cyclist_count = "/contagem/";

    data.forEach(function(el, index){
        console.log(index, el);
        table_el.row.add([
            el.name,
            new Date(el.date).toLocaleDateString(),
            el.summary.total,
            (el.summary.women_percent * 100).toFixed(1) + '%',
            '',
            '',
           '<a href="'+ link_cyclist_count + el._id + '" class="btn-see-more"><i class="fa fa-search bold color-black"></i></a>'
        ]).draw( false );
    });
}

function getDataCouting() {
    var urlCouting = "https://api.plataforma.ameciclo.org/contagens/v1/cyclist-count";

    return fetch(urlCouting)
        .then(response => response.json())
        .then(data => {
            setCoutingTableDOM(data);    
            hideLoading();
            return data;
        })
        .catch(error => console.error(error));
}

function hideLoading(){
    $('.overflow-screen').hide();
    $('body').removeClass('scroll-blocked');
}

$(document).ready(function () {
    var data = getDataCouting();
});