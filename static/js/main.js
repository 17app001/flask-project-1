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
    drawCityPM25('雲林縣');
});


window.onresize = function () {
    chart1.resize();
    chart2.resize();
    chart3.resize();
}

$("#county_btn").click(() => {
    let city = document.querySelector("#select_county").value;
    drawCityPM25(city);
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

function drawCityPM25(city) {
    chart3.showLoading();
    $.ajax(
        {
            url: `/city-pm25/${city}`,
            type: "POST",
            dataType: "json",
            success: (data) => {
                chart3.hideLoading();
                drawChart3(data);
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
                console.log(data);
                chart2.hideLoading();
                drawChart2(data);
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
                drawChart1(data);
                renderMaxPM25(data);

            },
            error: () => {
                chart1.hideLoading();
                alert("資料讀取失敗!");
            }
        }
    );
}

function drawChart1(datas) {
    var option;
    option = {
        title: {
            text: 'PM2.5全台資訊'
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            left: 'left',
            top: 'center',
            feature: {
                magicType: { show: true, type: ['line', 'bar', 'tiled'] },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['PM2.5']
        },
        xAxis: {
            type: 'category',
            data: datas['stationName']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'PM2.5',
                data: datas['result'],
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            }
        ]
    };

    option && chart1.setOption(option);
}

function drawChart2(datas) {
    var option;
    option = {
        legend: {
            data: ['PM2.5']
        },
        xAxis: {
            type: 'category',
            data: datas['citys']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                itemStyle: {
                    color: '#800080'
                },
                name: 'PM2.5',
                data: datas['result'],
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            }
        ]
    };

    option && chart2.setOption(option);
}



function drawChart3(datas) {
    var option;
    option = {
        legend: {
            data: ['PM2.5']
        },
        xAxis: {
            type: 'category',
            data: datas['stationName']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                itemStyle: {
                    color: '#800080'
                },
                name: 'PM2.5',
                data: datas['result'],
                type: 'bar',
                showBackground: true,
                backgroundStyle: {
                    color: 'rgba(180, 180, 180, 0.2)'
                }
            }
        ]
    };

    option && chart3.setOption(option);
}



















function _darwChart(datas) {
    var option;

    // prettier-ignore
    let dataAxis = datas["stationName"];
    // prettier-ignore
    let data = datas["result"]
    let yMax = 500;
    let dataShadow = [];
    for (let i = 0; i < data.length; i++) {
        dataShadow.push(yMax);
    }
    option = {
        title: {
            text: '特性示例：渐变色 阴影 点击缩放',
            subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
        },
        xAxis: {
            data: dataAxis,
            axisLabel: {
                inside: true,
                color: '#fff'
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            z: 10
        },
        yAxis: {
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#999'
            }
        },
        dataZoom: [
            {
                type: 'inside'
            }
        ],
        series: [
            {
                type: 'bar',
                showBackground: true,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#83bff6' },
                        { offset: 0.5, color: '#188df0' },
                        { offset: 1, color: '#188df0' }
                    ])
                },
                emphasis: {
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#2378f7' },
                            { offset: 0.7, color: '#2378f7' },
                            { offset: 1, color: '#83bff6' }
                        ])
                    }
                },
                data: data
            }
        ]
    };
    // Enable data zoom when user click bar.
    const zoomSize = 6;
    chart1.on('click', function (params) {
        console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
        chart1.dispatchAction({
            type: 'dataZoom',
            startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
            endValue:
                dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
        });
    });

    option && chart1.setOption(option);

}






