/* ====================================================
                        graphique
=====================================================*/
var data = {
    labels : ["rep1","rep2","rep3","rep4"],
    datasets : [
        {
            fillColor : "rgba(220,220,220,0.5)",
            strokeColor : "rgba(220,220,220,1)",
            data : [65,59,90,81]
        },
        {
            fillColor : "rgba(151,187,205,0.5)",
            strokeColor : "rgba(151,187,205,1)",
            data : [28,48,40,19]
        }
    ]
}

var ctx = document.getElementById("myChart").getContext("2d");
new Chart(ctx).Bar(data);