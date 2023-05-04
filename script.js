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

// Chart
var ctx = document.getElementById('chart').getContext('2d');

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

const chartOptions = {
    scales: {
      yAxes: [{
        ticks: {
          min: 0,
          max: 24,
          stepSize: 1,
          beginAtZero: true,
          suggestedMax: 24,
          suggestedMin: 0
        }
      }]
    },
    responsive: true,
    maintainAspectRatio: false
};

var chart = new Chart(ctx, {
    type: 'bar',
    data: timeData,
    options: chartOptions
});

timeData.fromTimes = [];
timeData.toTimes = [];

var submitBtn = document.querySelector('button');
submitBtn.addEventListener('click', function() {

  var fromTime = document.getElementById('from').value;
  var toTime = document.getElementById('to').value;
  
  var isTimePeriodAdded = timeData.fromTimes.some(function(time, index) {
    return time === fromTime && timeData.toTimes[index] === toTime;
  });

  if (isTimePeriodAdded) {
    alert('This time period is already added!');
    return;
  }

  var doesTimePeriodOverlap = timeData.fromTimes.some(function(time, index) {
    var existingFromTime = time;
    var existingToTime = timeData.toTimes[index];

    return (fromTime >= existingFromTime && fromTime < existingToTime) || (toTime > existingFromTime && toTime <= existingToTime);
  });

  if (doesTimePeriodOverlap) {
    alert('This time period overlaps with an existing time period!');
    return;
  }

  var from = new Date("2023-01-01T" + fromTime + ":00");
  var to = new Date("2023-01-01T" + toTime + ":00");
  var diffMs = Math.abs(to - from);
  var diffHrs = Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;

  var textInput = document.getElementById('text').value;

  var totalHoursUsed = chart.data.datasets[0].data.reduce(function(total, hours) {
    return total + hours;
  }, 0);

  if (totalHoursUsed + diffHrs > 24) {
    alert('Total time usage cannot exceed 24 hours!');
    return;
  }

  chart.data.labels.push(textInput);
  chart.data.datasets[0].data.push(diffHrs);
  chart.update();

  // Calculate
  totalHoursUsed += diffHrs;
  var freeHoursRemaining = 24 - totalHoursUsed;

  document.getElementById('total-used-time').textContent = totalHoursUsed;
  document.getElementById('free-time').textContent = freeHoursRemaining;
});

var removeBtn = document.getElementById('remove');
removeBtn.addEventListener('click', function() {

  var textInput = document.getElementById('text').value;

  for (var i = 0; i < timeData.labels.length; i++) {
    if (timeData.labels[i] === textInput) {
      timeData.labels.splice(i, 1);
      timeData.datasets[0].data.splice(i, 1);
      timeData.fromTimes.splice(i, 1);
      timeData.toTimes.splice(i, 1);
      break;
    }
  }

  chart.update();
  document.getElementById('text').value = '';

  // Calculate
  var totalHoursUsed = chart.data.datasets[0].data.reduce(function(total, hours) {
    return total + hours;
  }, 0);

  var freeHoursRemaining = 24 - totalHoursUsed;

  document.getElementById('total-used-time').textContent = totalHoursUsed;
  document.getElementById('free-time').textContent = freeHoursRemaining;
});