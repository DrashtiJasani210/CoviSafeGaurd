$(document).ready(function () {
    // $('#country').editableSelect();
    // Dynamically set the countries to dropdown list
    var url = "https://api.apify.com/v2/key-value-stores/tVaYRsPHLjNdNBu7S/records/LATEST?disableRedirect=true"
    var confirmed_data = [];
    var recovered_data = [];
    var death_data = [];
    var time = [];
    var act_data = [];
    $.get(url, function (data) {
        let datar = "";
        $("#confirmed-total").html(data[0].infected)
        $("#recovered-total").html(data[0].recovered)
        $("#death-total").html(data[0].deceased)
        $.each(data, function (id, obj) {
            datar = "<option value='" + obj.country + "'>" + obj.country + "</option>";
            $('#country').append(datar);
        })
        act_data.push(data[0].infected);
        act_data.push(data[0].recovered);
        act_data.push(data[0].deceased);

        var url2 = data[0].historyData;
        $.get(url2, function (hdata) {
            var total_obj = hdata.length;
            for (var i = total_obj - 1; i >= (total_obj - 30); i--) {
                confirmed_data.push(hdata[i].infected);
                recovered_data.push(hdata[i].recovered);
                death_data.push(hdata[i].deceased);
                time.push(hdata[i].lastUpdatedAtApify.slice(0, 10).split("-").reverse().join("-"));
            }

            confirmed_data.reverse();
            recovered_data.reverse();
            death_data.reverse();
            time.reverse();
            //custom tooltip
            const getOrCreateTooltip = (chart) => {
                let tooltipEL = chart.canvas.parentNode.querySelector('div');
                if (!tooltipEL) {
                    tooltipEL = document.createElement('DIV');
                    tooltipEL.classList.add('tooltipDesign');
                    tooltipUL = document.createElement('UL');
                    tooltipUL.classList.add('tooltipUL');
                    //append to parent
                    tooltipEL.appendChild(tooltipUL);
                    chart.canvas.parentNode.appendChild(tooltipEL);
                }
                return tooltipEL;
            };
            //1 trigger
            const external_tooltip = (context) => {
                const { chart, tooltip } = context;
                const tooltipEL = getOrCreateTooltip(chart);

                //Hide tooltip if mouseout
                if (tooltip.opacity === 0) {
                    tooltipEL.style.opacity = 0;
                    //opacity=1 Visible
                    //opacity=0 hide
                    return;
                }
                //tooltip text
                if (tooltip.body) {
                    const titlelines = tooltip.title || [];
                    const bodylines = tooltip.body.map(b => b.lines);
                    const tooltipLI = document.createElement('LI');

                    //title look
                    titlelines.forEach(title => {
                        tooltipUL.appendChild(tooltipLI);
                        //create Span tag
                        const tooltipSpan = document.createElement('SPAN');
                        tooltipLI.appendChild(tooltipSpan);
                        //create a text node with the title
                        const tooltipTitle = document.createTextNode(title);
                        tooltipSpan.appendChild(tooltipTitle);
                        tooltipSpan.classList.add('tooltiptitle');
                    });

                    const tooltipBodyP = document.createElement('P');
                    bodylines.forEach((body, i) => {
                        const displayblockSpan = document.createElement('SPAN');
                        displayblockSpan.classList.add('displayblockSpan');

                        const colors = tooltip.labelColors[i];
                        const colorSquare = document.createElement('SPAN');
                        colorSquare.classList.add('colorSquare');
                        colorSquare.style.background = colors.borderColor;
                        colorSquare.style.border = colors.borderColor;

                        const textlabel = document.createTextNode(body);

                        //append both colorlabel + textlabel
                        displayblockSpan.appendChild(colorSquare);
                        displayblockSpan.appendChild(textlabel);
                        tooltipBodyP.appendChild(displayblockSpan);
                    });

                    const ULnode = tooltipEL.querySelector('ul');
                    //remove old childern
                    while (ULnode.firstChild) {
                        ULnode.firstChild.remove();
                    }

                    //add new childern
                    ULnode.appendChild(tooltipLI);
                    tooltipLI.appendChild(tooltipBodyP);
                    tooltipEL.style.opacity = 1;

                    //position of tooltip
                    const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;
                    tooltipEL.style.left = positionX + tooltip.caretX + 70 + 'px';
                    tooltipEL.style.top = positionY + tooltip.caretY + 'px';
                    tooltipEL.style.font = tooltip.options.bodyFont.string;
                    tooltipEL.style.padding = tooltip.options.padding + 'px' + tooltip.options.padding + 'px';
                }
            };

            //chart initialization
            var mychart = document.getElementById('chart').getContext('2d');
            var chart = new Chart(mychart, {
                type: 'line',
                data: {
                    labels: time,
                    datasets: [{
                        label: 'Confirmed',
                        data: confirmed_data,
                        backgroundColor: 'transparent',
                        borderColor: 'red',
                        borderWidth: 4,
                        tension: 0.4
                    },
                    {
                        label: 'Recovered',
                        data: recovered_data,
                        backgroundColor: 'transparent',
                        borderColor: 'green',
                        borderWidth: 4,
                        tension: 0.4
                    },
                    {
                        label: 'Death',
                        data: death_data,
                        backgroundColor: 'transparent',
                        borderColor: '#373c43',
                        borderWidth: 4,
                        tension: 0.4
                    }],
                },
                options: {
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    plugins: {
                        tooltip: {
                            enabled: false,
                            position: 'nearest',
                            external: external_tooltip
                        },
                        legend: {
                            display: false
                        }
                    }
                }

            });
        });
    });
});

function getCountryData() {
    //Remove Canvas
    $('#chart').remove();
    //Add canvas to its parent tag
    $('#canvas').append('<canvas id="chart"><canvas>');
    var url = "https://api.apify.com/v2/key-value-stores/tVaYRsPHLjNdNBu7S/records/LATEST?disableRedirect=true"
    $.get(url, function (data) {
        var confirmed_data = [];
        var recovered_data = [];
        var death_data = [];
        var time = [];
        var act_data = [];
        $.each(data, function (id, obj) {
            if (obj.country == $('#country').val()) {
                act_data.push(obj.infected);
                act_data.push(obj.recovered);
                act_data.push(obj.deceased);

                $("#confirmed-total").html(obj.infected)
                $("#recovered-total").html(obj.recovered)
                $("#death-total").html(obj.deceased)
                var url2 = obj.historyData;
                $.get(url2, function (hdata) {
                    var total_obj = hdata.length;
                    for (var i = total_obj - 1; i >= (total_obj - 30); i--) {
                        confirmed_data.push(hdata[i].infected || hdata[i].activeCases);
                        recovered_data.push(hdata[i].recovered);
                        death_data.push(hdata[i].deceased || hdata[i].deaths);
                        time.push(hdata[i].lastUpdatedAtApify.slice(0, 10).split("-").reverse().join("-"));
                    }

                    confirmed_data.reverse();
                    recovered_data.reverse();
                    death_data.reverse();
                    time.reverse();
                    //custom tooltip
                    const getOrCreateTooltip = (chart) => {
                        let tooltipEL = chart.canvas.parentNode.querySelector('div');
                        if (!tooltipEL) {
                            tooltipEL = document.createElement('DIV');
                            tooltipEL.classList.add('tooltipDesign');
                            tooltipUL = document.createElement('UL');
                            tooltipUL.classList.add('tooltipUL');
                            //append to parent
                            tooltipEL.appendChild(tooltipUL);
                            chart.canvas.parentNode.appendChild(tooltipEL);
                        }
                        return tooltipEL;
                    };
                    //1 trigger
                    const external_tooltip = (context) => {
                        const { chart, tooltip } = context;
                        const tooltipEL = getOrCreateTooltip(chart);

                        //Hide tooltip if mouseout
                        if (tooltip.opacity === 0) {
                            tooltipEL.style.opacity = 0;
                            //opacity=1 Visible
                            //opacity=0 hide
                            return;
                        }
                        //tooltip text
                        if (tooltip.body) {
                            const titlelines = tooltip.title || [];
                            const bodylines = tooltip.body.map(b => b.lines);
                            const tooltipLI = document.createElement('LI');

                            //title look
                            titlelines.forEach(title => {
                                tooltipUL.appendChild(tooltipLI);
                                //create Span tag
                                const tooltipSpan = document.createElement('SPAN');
                                tooltipLI.appendChild(tooltipSpan);
                                //create a text node with the title
                                const tooltipTitle = document.createTextNode(title);
                                tooltipSpan.appendChild(tooltipTitle);
                                tooltipSpan.classList.add('tooltiptitle');
                            });

                            const tooltipBodyP = document.createElement('P');
                            bodylines.forEach((body, i) => {
                                const displayblockSpan = document.createElement('SPAN');
                                displayblockSpan.classList.add('displayblockSpan');

                                const colors = tooltip.labelColors[i];
                                const colorSquare = document.createElement('SPAN');
                                colorSquare.classList.add('colorSquare');
                                colorSquare.style.background = colors.borderColor;
                                colorSquare.style.border = colors.borderColor;

                                const textlabel = document.createTextNode(body);

                                //append both colorlabel + textlabel
                                displayblockSpan.appendChild(colorSquare);
                                displayblockSpan.appendChild(textlabel);
                                tooltipBodyP.appendChild(displayblockSpan);
                            });

                            const ULnode = tooltipEL.querySelector('ul');
                            //remove old childern
                            while (ULnode.firstChild) {
                                ULnode.firstChild.remove();
                            }

                            //add new childern
                            ULnode.appendChild(tooltipLI);
                            tooltipLI.appendChild(tooltipBodyP);
                            tooltipEL.style.opacity = 1;

                            //position of tooltip
                            const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;
                            tooltipEL.style.left = positionX + tooltip.caretX + 70 + 'px';
                            tooltipEL.style.top = positionY + tooltip.caretY + 'px';
                            tooltipEL.style.font = tooltip.options.bodyFont.string;
                            tooltipEL.style.padding = tooltip.options.padding + 'px' + tooltip.options.padding + 'px';
                        }
                    };

                    //chart initialization
                    var mychart = document.getElementById('chart').getContext('2d');
                    var chart = new Chart(mychart, {
                        type: 'line',
                        data: {
                            labels: time,
                            datasets: [{
                                label: 'Confirmed',
                                data: confirmed_data,
                                backgroundColor: 'transparent',
                                borderColor: 'red',
                                borderWidth: 4,
                                tension: 0.4
                            },
                            {
                                label: 'Recovered',
                                data: recovered_data,
                                backgroundColor: 'transparent',
                                borderColor: 'green',
                                borderWidth: 4,
                                tension: 0.4
                            },
                            {
                                label: 'Death',
                                data: death_data,
                                backgroundColor: 'transparent',
                                borderColor: '#373c43',
                                borderWidth: 4,
                                tension: 0.4
                            }],
                        },
                        options: {
                            interaction: {
                                mode: 'index',
                                intersect: false
                            },
                            plugins: {
                                tooltip: {
                                    enabled: false,
                                    position: 'nearest',
                                    external: external_tooltip
                                },
                                legend: {
                                    display: false
                                }
                            }
                        }

                    });
                });
            }
        })
    });

}