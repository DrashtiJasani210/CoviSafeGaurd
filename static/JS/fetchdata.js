$(document).ready(function () {
    init()
    function init() {
        var url = "https://api.apify.com/v2/key-value-stores/tVaYRsPHLjNdNBu7S/records/LATEST?disableRedirect=true"
        var datares = "";
        $.get(url, function (data) {
            $.each(data, function (id, obj) {
                datares = `<tr>
                <td>${obj.country}</td>
                <td>${obj.infected}</td>
                <td>${obj.recovered}</td>
                <td>${obj.deceased}</td><tr/>`
                console.log(datares);
                $("#data").append(datares);
            })
        })
    }
})