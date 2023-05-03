// Clock
const deg = 6;
const hour = document.querySelector(".hour");
const min = document.querySelector(".min");
const sec = document.querySelector(".sec");

const setClock = () => {
	let day = new Date();
	let hh = day.getHours() * 30;
	let mm = day.getMinutes() * deg;
	let ss = day.getSeconds() * deg;

	hour.style.transform = `rotateZ(${hh + mm / 12}deg)`;
	min.style.transform = `rotateZ(${mm}deg)`;
	sec.style.transform = `rotateZ(${ss}deg)`;
};

setClock();

setInterval(setClock, 1000);

// Charts

var timeData = {
    labels: [],
    datasets: [{
        label: 'Time Usage',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
    }]
};

var chartOptions = {
    responsive: true,
    scales: {
        yAxes: [{
            ticks: {
                beginAtZero: true
            }
        }]
    }
};

var ctx = document.getElementById('chart').getContext('2d');

var chart = new Chart(ctx, {
    type: 'line',
    data: timeData,
    options: chartOptions
});

function addData() {
    var fromTime = document.getElementById('from').value;
    var toTime = document.getElementById('to').value;
    var timeUsage = document.getElementById('text').value;

    if (fromTime && toTime && timeUsage) {
        timeData.labels.push(timeUsage);
        var duration = getDuration(fromTime, toTime);
        timeData.datasets[0].data.push(duration);
        chart.update();
    }
}

function getDuration(fromTime, toTime) {
    var fromDate = new Date('2023-01-01T' + fromTime + ':00Z');
    var toDate = new Date('2023-01-01T' + toTime + ':00Z');
    return (toDate.getTime() - fromDate.getTime()) / 1000;
}
