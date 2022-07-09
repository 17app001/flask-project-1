const chart1El = document.querySelector("#main");
const pm25HighSite = document.querySelector("#pm25_high_site");
const pm25HighValue = document.querySelector("#pm25_high_value");
const pm25LowSite = document.querySelector("#pm25_low_site");
const pm25LowValue = document.querySelector("#pm25_low_value");

console.log()

let chart1 = echarts.init(chart1El);


$(document).ready(() => {
    drawPM25();
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
    console.log(maxIndex, minIndex)

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
            text: 'PM25全台資訊'
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

function darwChart2(datas) {

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






