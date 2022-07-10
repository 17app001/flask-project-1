const chart1El = document.querySelector("#main");
const chart2El = document.querySelector("#six");
const chart3El = document.querySelector("#county");


const pm25HighSite = document.querySelector("#pm25_high_site");
const pm25HighValue = document.querySelector("#pm25_high_value");
const pm25LowSite = document.querySelector("#pm25_low_site");
const pm25LowValue = document.querySelector("#pm25_low_value");


let chart1 = echarts.init(chart1El);
let chart2 = echarts.init(chart2El);
let chart3 = echarts.init(chart3El);


$(document).ready(() => {
    drawPM25();
    drawSixPM25();
    drawCityPM25('南投縣');
});


window.onresize = function () {
    chart1.resize();
    chart2.resize();
    chart3.resize();
}

$("#county_btn").click(() => {
    drawCityPM25($("#select_county").val());
});

function renderMaxPM25(data) {
    console.log(data);
    let stationName = data["stationName"];
    let result = data["result"];

    let maxIndex = result.indexOf(Math.max(...result));
    let minIndex = result.indexOf(Math.min(...result));

    pm25HighSite.innerText = stationName[maxIndex];
    pm25HighValue.innerText = result[maxIndex];
    pm25LowSite.innerText = stationName[minIndex];
    pm25LowValue.innerText = result[minIndex];
    console.log(maxIndex, minIndex);
}

function allRander() {
    drawPM25();
    drawSixPM25();
    drawCityPM25('南投縣');
}

function drawCityPM25(city) {
    chart3.showLoading();
    $.ajax(
        {
            url: `/city-pm25/${city}`,
            type: "POST",
            dataType: "json",
            success: (data) => {
                chart3.hideLoading();
                drawChart(data['stationName'], data['result'], chart3, null, false, '#800080');
            },
            error: () => {
                chart3.hideLoading();
                alert(`${city}縣市資料讀取失敗!`);
            }
        }
    );
}

function drawSixPM25() {
    chart2.showLoading();
    $.ajax(
        {
            url: "/six-pm25-json",
            type: "POST",
            dataType: "json",
            success: (data) => {
                chart2.hideLoading();
                console.log(data);
                drawChart(data['citys'], data['result'], chart2, null, false, '#800080');
            },
            error: () => {
                chart2.hideLoading();
                alert("六都資料讀取失敗!");
            }
        }
    );
}

function drawPM25() {
    pm25HighSite.innerText = "N/A";
    pm25HighValue.innerText = 0;
    pm25LowSite.innerText = "N/A";
    pm25LowValue.innerText = 0;
    chart1.showLoading();
    $.ajax(
        {
            url: "/pm25-json",
            type: "POST",
            dataType: "json",
            success: (data) => {
                chart1.hideLoading();
                $("#date").text(data["time"]);
                drawChart(data["stationName"], data["result"], chart1, "PM2.5全台資訊", true);
                renderMaxPM25(data);

            },
            error: () => {
                chart1.hideLoading();
                alert("資料讀取失敗!");
            }
        }
    );
}

function drawChart(x_data, y_data, chart = null, title = null, toolbox = false, color = '#483d8b') {
    var option;
    option = {
        title: {
            text: title
        },
        toolbox: toolbox ? {
            show: true,
            orient: 'vertical',
            left: 'left',
            top: 'center',
            feature: {
                magicType: { show: true, type: ['line', 'bar', 'tiled'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        } : {},
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['PM2.5']
        },
        xAxis: {
            type: 'category',
            data: x_data,
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                itemStyle: {
                    color: color,
                },
                name: 'PM2.5',
                data: y_data,
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            }
        ]
    };

    option && chart.setOption(option);
}








