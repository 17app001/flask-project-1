from flask import Flask, render_template
from datetime import datetime


app = Flask(__name__)


@app.route('/')
@app.route('/<name>')
@app.route('/index')
def index(name='GUEST'):
    time = get_time()
    content = {'name': name, 'time': time}
    return render_template('./index.html', content=content)


@app.route('/stock')
def stock():
    stocks = [
        {'分類': '日經指數', '指數': '22,920.30'},
        {'分類': '韓國綜合', '指數': '2,304.59'},
        {'分類': '香港恆生', '指數': '25,083.71'},
        {'分類': '上海綜合', '指數': '3,380.68'}
    ]

    for stock in stocks:
        print(stock['分類'], stock['指數'])

    return render_template('./stock.html', stocks=stocks)


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
    print(get_time())
    app.run(debug=True)
