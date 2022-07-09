from flask import Flask, render_template, request
from datetime import datetime
import json


from scrape.pm25 import get_pm25


app = Flask(__name__)


@app.route('/pm25-json', methods=['POST'])
def get_pm25_json():
    columns, values = get_pm25()
    # X軸
    stationName = [value[1] for value in values]
    # Y軸
    result = [value[2] for value in values]

    return json.dumps({'time': get_time(), 'stationName': stationName, 'result': result}, ensure_ascii=False)


@app.route('/pm25-chart')
def pm25_chart():
    return render_template("pm25-chart.html")


@app.route('/pm25', methods=['GET', 'POST'])
def pm25():
    sort = False
    if request.method == 'POST':
        if request.form.get('sort'):
            sort = True
        if request.form.get('update'):
            sort = False

    columns, values = get_pm25(sort)
    time = get_time()
    return render_template('./pm25.html', **locals())
    # API
    # return json.dumps({'columns': columns, 'values': values}, ensure_ascii=False)


@app.route('/')
@app.route('/<name>')
@app.route('/index')
def index(name='GUEST'):
    time = get_time()
    content = {'name': name, 'time': time}
    return render_template('./index.html', content=content)


@app.route('/stock')
def stock():
    time = get_time()
    stocks = [
        {'分類': '日經指數', '指數': '22,920.30'},
        {'分類': '韓國綜合', '指數': '2,304.59'},
        {'分類': '香港恆生', '指數': '25,083.71'},
        {'分類': '上海綜合', '指數': '3,380.68'}
    ]

    return render_template('./stock.html', time=time, stocks=stocks)


@app.route('/test')
def test():
    return render_template('./test.html')


@app.route('/sum/x=<x>&y=<y>')
def sum(x, y):
    try:
        return f'{x}+{y}={eval(x)+eval(y)}'
    except Exception as e:
        print(e)
        # return str(e)
    return '<h1 style="color:red">輸入錯誤!</h1>'


@app.route('/time')
def get_time():
    return f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}"


if __name__ == '__main__':
    # print(get_pm25_json())
    app.run(debug=True)
