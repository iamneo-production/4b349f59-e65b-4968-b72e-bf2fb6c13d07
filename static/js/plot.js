const ctx = document.getElementById("chart").getContext("2d")
const toggleButtons = document.getElementsByClassName("toggle-line-btn")

const lineButton = document.getElementById("line-graph-btn")
const barButton = document.getElementById("bar-graph-btn")

const DATA_COUNT = 12;
const labels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];
const data1 = [0, 20, 20, 60, 60, 120, 140, 180, 120, 125, 105, 110, 170];
const data2 = [189, 143, 212, 249, 73, 146, 150, 61, 178, 72, 150, 101]
const data = {
    labels: labels,
    datasets: [
        {
            label: 'Area 1',
            data: data1,
            borderColor: "#ff647a",
            fill: false,
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            backgroundColor: "#ffe4e4",
            
        },
        {
            label: 'Area 2',
            data: data2,
            borderColor: "#000",
            fill: false,
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            opacity:0.3,
        },
    ]
};

const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'AQI Prediction for 2023 '
            },
        },
        interaction: {
            intersect: false,
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true
                }
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'AQI'
                },
                suggestedMin: -10,
                suggestedMax: 200
            }
        }
    },
};


const chart = new Chart(ctx, config)


for (const btn of toggleButtons) {
    btn.addEventListener("click", e => {

        const areaNo = btn.dataset.area

        if (btn.classList.contains("active-btn")) {
            
            chart.hide(Number(areaNo))
            btn.classList.remove("active-btn")


        } else {
            
            chart.show(Number(areaNo))
            btn.classList.add("active-btn")
        
        }
    })
}


lineButton.addEventListener("click", e => {
    config.type = "line"
    chart.update()

    lineButton.classList.add("active-btn")
    barButton.classList.remove("active-btn")
})

barButton.addEventListener("click", e => {
    config.type = "bar"
    chart.update()

    barButton.classList.add("active-btn")
    lineButton.classList.remove("active-btn")
})