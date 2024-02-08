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
        labels: ["10 points", "20 points", "30 points", "40 points", "50 points", "60 points"],
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
        resultDisplay.innerHTML = `<p>You have won ${chartOptions.data.labels[matchingRange.value - 1]}!</p>`;
        // Do not enable the spin button here anymore. It will be re-enabled by the countdown timer
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

spinButton.addEventListener("click", function() {
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
            determineValue(stopAngle);
            clearInterval(spinInterval);
            spinCount = 0;
            animationStep = 101;
            startCountdown(60); // Start a 1-min countdown after spinning
        }
    }, 10);
});
