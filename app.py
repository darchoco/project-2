import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, render_template


#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route("/index.html")
def welcome():
    return render_template('index.html')


@app.route("/gasprice.html")
def gas():

    return render_template('gasprice.html')


@app.route("/pollution.html")
def pollution():
    return render_template('pollution.html')

@app.route("/unemployment.html")
def unemployment():
    return render_template('unemployment.html')


if __name__ == '__main__':
    app.run(debug=True)
