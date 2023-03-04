const Colors = window.kurkle

const ctx = document.getElementById("chart-pred").getContext("2d")

const lineButton = document.getElementById("line-graph-btn-pred")
const barButton = document.getElementById("bar-graph-btn-pred")

const areaButtonsDiv = document.getElementById("areas-div-pred")
const toggleButtons = []

const ALPHA = 0.6
const COLORS = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)',
    'rgb(201, 203, 207)'
]

const COLORS_A = [
    `rgba(255, 99, 132, ${ALPHA})`,
    `rgba(255, 159, 64, ${ALPHA})`,
    `rgba(255, 205, 86, ${ALPHA})`,
    `rgba(75, 192, 192, ${ALPHA})`,
    `rgba(54, 162, 235, ${ALPHA})`,
    `rgba(153, 102, 255, ${ALPHA})`,
    `rgba(201, 203, 207, ${ALPHA})`
]

const DATA_COUNT = 12;
const dates = []
for (let i = 0; i <= 364; i++) {
    var d = new Date("2023-01-01");
    dates.push(new Date(d.setDate(d.getDate() + i)).toDateString());
}
console.log(dates)
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
const data = {
    labels: dates,
    datasets: []
};

const config = {
    type: 'line',
    data: data,
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Average Temperature Prediction for 2023 '
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
                suggestedMin: 30,
                suggestedMax: 120
            }
        }
    },
};

const chart = new Chart(ctx, config)

const init = async () => {
    const api_data = await fetch("/pred")
    const api_data_json = await api_data.json()
    let max = null
    let min = null

    for (const [index, [district, values]] of Object.entries(Object.entries(api_data_json))) {
        values.forEach(val => {
            if (!max) max = val
            if (!min) min = val

            if (val > max) max = val
            else if (val < min) min = val
        })
        data.datasets.push(
            {
                label: district,
                data: values,
                borderColor: COLORS[index],
                backgroundColor: COLORS_A[index],
                fill: false,
                cubicInterpolationMode: 'monotone',
                tension: 0.4,
                opacity: 0.3,
            },
        )
        const divElement = document.createElement("button")
        divElement.className = "border-2 px-4 py-2 rounded-full toggle-line-btn active-btn hover:shadow-md duration-200 ease-linear"
        divElement.setAttribute("data-area", String(index))
        divElement.innerText = district

        areaButtonsDiv.insertAdjacentElement(
            "beforeend",
            divElement
        )

        toggleButtons.push(divElement)
    }
    for (const btn of toggleButtons) {
        btn.addEventListener("click", e => {

            const areaNo = btn.dataset.area
            console.log(areaNo)

            if (btn.classList.contains("active-btn")) {

                chart.hide(Number(areaNo))
                btn.classList.remove("active-btn")


            } else {

                chart.show(Number(areaNo))
                btn.classList.add("active-btn")

            }
        })
    }


    config.options.scales.y.suggestedMax = Math.round(max) + 10
    config.options.scales.y.suggestedMin = Math.round(min) - 10
    chart.update()
}

init()


const activeReset = () => {
    for (const btn of toggleButtons) {
        btn.classList.add("active-btn")
    }
}

lineButton.addEventListener("click", e => {
    config.type = "line"
    chart.update()

    lineButton.classList.add("active-btn")
    barButton.classList.remove("active-btn")

    activeReset()
})

barButton.addEventListener("click", e => {
    config.type = "bar"
    chart.update()

    barButton.classList.add("active-btn")
    lineButton.classList.remove("active-btn")

    activeReset()
})