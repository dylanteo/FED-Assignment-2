const wheelElement = document.querySelector("#wheel");
const spinButton = document.querySelector("#spin-btn");
const resultDisplay = document.querySelector("#final-value");
const timerDisplay = document.querySelector("#timer"); // Get the timer display element

const angleRanges = [
    { min: 0, max: 30, value: 2 },
    { min: 31, max: 90, value: 1 },
    { min: 91, max: 150, value: 6 },
    { min: 151, max: 210, value: 5 },
    { min: 211, max: 270, value: 4 },
    { min: 271, max: 330, value: 3 },
    { min: 331, max: 360, value: 2 },
];

const segmentData = Array(6).fill(16);
const segmentColors = ["#1565c0", "#2196f3", "#1565c0", "#2196f3", "#1565c0", "#2196f3"];
const chartOptions = {
    plugins: [ChartDataLabels],
    type: "pie",
    data: {
        labels: ["50", "100", "200", "300", "400", "500"],
        datasets: [{ backgroundColor: segmentColors, data: segmentData }],
    },
    options: {
        responsive: true,
        animation: { duration: 0 },
        plugins: {
            tooltip: { enabled: false },
            legend: { display: false },
            datalabels: {
                color: "#ffffff",
                formatter: (value, ctx) => ctx.chart.data.labels[ctx.dataIndex],
                font: { size: 24 },
            },
        },
    },
};


let chartInstance = new Chart(wheelElement, chartOptions);

let spinCount = 0;
let animationStep = 101;

function determineValue(angle) {
    const matchingRange = angleRanges.find(range => angle >= range.min && angle <= range.max);
    if (matchingRange) {
        resultDisplay.innerHTML = `<p>You have won ${chartOptions.data.labels[matchingRange.value - 1]} points!</p>`;
        // Do not enable the spin button here anymore. It will be re-enabled by the countdown timer
        return chartOptions.data.labels[matchingRange.value - 1];
    }
    
}

// New function to start a countdown timer
function startCountdown(duration) {
    let timer = duration, hours, minutes, seconds;
    
    const interval = setInterval(function () {
        hours = parseInt(timer / 3600, 10);
        minutes = parseInt((timer % 3600) / 60, 10);
        seconds = parseInt(timer % 60, 10);

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;

        if (--timer < 0) {
            timerDisplay.textContent = "00:00:00";
            clearInterval(interval);
            spinButton.disabled = false; // Re-enable the spin button
        }
    }, 1000);
}

spinButton.addEventListener("click", async function() {
    spinButton.disabled = true;
    resultDisplay.innerHTML = `<p>Good Luck!</p>`;
    let stopAngle = Math.floor(Math.random() * 356);
    let spinInterval = setInterval(() => {
        chartInstance.options.rotation += animationStep;
        chartInstance.update();
        if (chartInstance.options.rotation >= 360) {
            spinCount++;
            animationStep -= 5;
            chartInstance.options.rotation = 0;
        }
        if (spinCount > 15 && chartInstance.options.rotation === stopAngle) {
            pointsearned = determineValue(stopAngle);
            pointsearned = parseInt(pointsearned);
            clearInterval(spinInterval);
            spinCount = 0;
            animationStep = 101;
            startCountdown(60); // Start a 1-min countdown after spinning
            addtoapi(pointsearned);
        }
    }, 10);
});

async function addtoapi(points){
    // Update points
    let APIKEY = "65b11c87a07ee8c4ea038308"
    let id = localStorage.getItem('pointcardid')
    let pointsResponse = await fetch(`https://fedassignment2-b6e1.restdb.io/rest/pointcard/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': APIKEY
        }
    });
    if (!pointsResponse.ok) {
        throw new Error(`HTTP error! Status: ${pointsResponse.status}`);
    }

    let pointsData = await pointsResponse.json();
    let currentPoints = pointsData.points;
    let newTotalPoints = currentPoints + points;

    await fetch(`https://fedassignment2-b6e1.restdb.io/rest/pointcard/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'x-apikey': APIKEY
        },
        body: JSON.stringify({ points: newTotalPoints })
    });
    localStorage.setItem('points', newTotalPoints);
}

