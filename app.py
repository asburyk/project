import flask
import json
import pickledb
import os
import random
import math
from flask import Flask, flash, request, redirect, url_for
import time
import datetime

database_file = "users.db"
db = pickledb.load(database_file, True)
db_name = "users"

if not db.get(db_name):
    db.lcreate(db_name)

app = flask.Flask(__name__, static_url_path="", static_folder="public")
app.secret_key='fdshgsi'

@app.get("/shutdown")
def shutdown():
    print("Shutting down the server")
    os._exit(0)

# @app.get("/toPuzzle")
# def toPuzzle():
#     size=request.args.get('size', default = -1, type = int)
#     if (size != 9 and size != 15):
#         return -1 #idk
#     return flask.render_template("/game.html", size = size)
    

@app.get("/puzzle")
def newPuzzle():
    size = request.args.get('size', default = -1, type = int) # learned about this from: https://stackoverflow.com/questions/24892035/how-can-i-get-the-named-parameters-from-a-url-using-flask
    if (size != 9 and size != 15):
        return -1 #idk
    NMINES = 15
    if (size == 15):
        NMINES = 40
    i = 0
    placement = NMINES*[0]
    placed = (size*size)*[0]
    while (i < NMINES):
        pos = random.randint(0, size * size - 1)
        if (placed[pos] == 1):
            continue
        placed[pos] = 1
        placement[i] = {"x": math.floor(pos / size), "y": pos % size}
        i += 1
    obj = {"size": size, "placement": placement}
    return flask.Response(response=json.dumps(obj), status=200, headers = {"Content-Type": "application/json"})

@app.post("/login")
def login():
    data = flask.request.form.to_dict()
    i = 0
    while (i < db.llen(db_name)):
        if (db.lget(db_name, i)["username"] == data["username"]):
            if (db.lget(db_name, i)["password"] == data["password"]):
                return flask.render_template("/loginSuccess.html", username = data["username"], password = data["password"]);
            else:
                flash("Invalid username/password")
                flask.render_template("/loginError.html")
        i += 1
    flash("Invalid username/password")
    return flask.render_template("/loginError.html")

@app.post("/users")
def addUser():
    data = flask.request.form.to_dict()
    print(data)
    # first check if username already exists
    i = 0
    print(data["username"])
    while (i < db.llen(db_name)):
        if (db.lget(db_name, i)["username"] == data["username"]):
            flash("Username already exists")
            return flask.render_template("/loginError.html") # this and loginError template part from https://flask.palletsprojects.com/en/stable/patterns/flashing/
        i += 1
    # check nonempty
    if (data["username"] == "" or data["password"] == ""):
        flash("Invalid username/password")
        return flask.render_template("/loginError.html") # this and loginError template part from https://flask.palletsprojects.com/en/stable/patterns/flashing/
    

    db.ladd(db_name, data)
    return flask.render_template("/loginSuccess.html", username = data["username"], password = data["password"]);
    #return redirect("/index.html")

@app.get("/users/<user>/puzzles")
def getPuzzles(user):
    return 0

@app.get("/users/<user>/puzzles?id=<id>")
def getPuzzle(user, id):
    return 0

@app.post("/users/<user>/puzzle")
def postPuzzle(user):
    data = flask.request.json
    i = 0
    while (i < db.llen(db_name)):
        if (db.lget(db_name, i)["username"] == data["username"]):
            if (db.lget(db_name, i)["password"] == data["password"]):
                break
            else:
                return flask.Response(response=json.dumps({"success": False}), status=200, headers = {"Content-Type": "application/json"})
        i += 1
    if (i >= db.llen(db_name)):
        return flask.Response(response=json.dumps({"success": False}), status=200, headers = {"Content-Type": "application/json"})
    userinfo = db.lget(db_name, i)
    db.lpop(db_name, i)
    if (userinfo.keys().__contains__("saved_games")):
        id = len(userinfo["saved_games"])
    else:
        id = 0
        userinfo["saved_games"] = []
    timestamp = time.time()
    timestamp = datetime.datetime.fromtimestamp(timestamp=timestamp).strftime('%Y-%m-%d %H:%M:%S') #https://stackoverflow.com/questions/13890935/does-pythons-time-time-return-the-local-or-utc-timestamp
    newGame = {}
    newGame["id"] = id
    newGame["timestamp"] = timestamp
    newGame["size"] = data["currentSize"]
    newGame["init"] = data["currentMines"]
    newGame["moves"] = data["currentMoves"]
    userinfo["saved_games"].append(newGame)
    db.ladd(db_name, userinfo)
    return flask.Response(response=json.dumps({"success": True}), status=200, headers = {"Content-Type": "application/json"})
    

app.run(host='0.0.0.0', port=22009,debug=True)

