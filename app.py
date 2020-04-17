import numpy as np
import requests
import pandas as pd
import pprint as pp
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, render_template
url = 'https://www.bls.gov/web/laus/lauhsthl.htm'

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/index.html")
def welcome():
    #call html template
    return render_template('index.html')


@app.route("/gasprice.html")
def gas():
    #call html template
    return render_template('gasprice.html')


@app.route("/pollution.html")
def pollution():
    #call html template
    return render_template('pollution.html')

@app.route("/unemployment.html")
def unemployment():
    #use pandas to read website, get table with unemployment data
    table = pd.read_html(url)
    #taking steps to clean up the table to convert to json
    unemployment_rate_list_raw = table[0].values.tolist()
    unemployment_rate_list_necessary = unemployment_rate_list_raw[0:51]
    unemployment_rate_list_cleaned = [row[0:2] for row in unemployment_rate_list_necessary]
    unemployment_rate_list = [["State", "Unemployment Rate"]] + unemployment_rate_list_cleaned
    #move to dataframe to establish key:value pairs
    df = pd.DataFrame.from_records(unemployment_rate_list)
    #set first row of data as the headers
    df.columns = df.iloc[0]
    df = df[1:]
    #set state as the index so it can be used as the key
    df.set_index('State', inplace = True)
    df = df.rename(columns = {"Unemployment Rate": "UnemploymentRate"})
    #save as a .json so that it can be ingested by javascript
    df.to_json('static/unemploymentData.json')
    #call html template
    return render_template('unemployment.html')


if __name__ == '__main__':
    app.run(debug=True)
