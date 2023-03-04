const ctx = document.getElementById("chart").getContext("2d")

const lineButton = document.getElementById("line-graph-btn")
const barButton = document.getElementById("bar-graph-btn")

const areaButtonsDiv = document.getElementById("areas-div")


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
const data = {
    labels: labels,
    datasets: []
    // datasets: [
    //     {
    //         label: 'Area 1',
    //         data: data1,
    //         borderColor: "#ff647a",
    //         fill: false,
    //         cubicInterpolationMode: 'monotone',
    //         tension: 0.4,
    //         backgroundColor: "#ffe4e4",
            
    //     },
    //     {
    //         label: 'Area 2',
    //         data: data2,
    //         borderColor: "#000",
    //         fill: false,
    //         cubicInterpolationMode: 'monotone',
    //         tension: 0.4,
    //         opacity:0.3,
    //     },
    // ]
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
                suggestedMin: 0,
                suggestedMax: 250
            }
        }
    },
};

const chart = new Chart(ctx, config)

const init = async () => {
    const toggleButtons = []
    const api_data = await fetch("/aqi")
    const api_data_json = await api_data.json()
    
    for (const [index, [district, values]] of Object.entries(Object.entries(api_data_json))) {
        
        data.datasets.push(
        {
            label: district,
            data: values,
            borderColor: "#000",
            fill: false,
            cubicInterpolationMode: 'monotone',
            tension: 0.4,
            opacity:0.3,
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
    }

    chart.update()
}

init()


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