import flask
import json
import os


shopping_list={}

app = flask.Flask(__name__,             # ie "http_server_starter"
            static_url_path='', 	    # Treat all files as static files.
            static_folder='public')	    # Look in the public folder.

@app.get("/shutdown")
def shutdown():
    print("Shutting down the server")
    os._exit(0)

@app.get("/API/LOAD")
def handle_load():
    data = json.dumps(shopping_list)
    return flask.Response(data, status=200, headers={
        "Content-Type": "text/javascript; charset=utf-8"
    })

@app.post("/API/SAVE")
def handle_save():
    post_data = flask.request.form
    print("/API/SAVE invoked, post_data:")
    print(post_data)
    new_keys=0
    for key in post_data.keys():
        if not key in shopping_list:
            new_keys+=1
        shopping_list[key] = post_data[key]

    data = json.dumps( f"OK. Added {new_keys} new items." )
    return flask.Response(data, status=200, headers={
        "Content-Type": "text/javascript; charset=utf-8"
    })

#for testing board.js
@app.route("/")
def testBoard():
    return '''<!DOCTYPE html>
    <!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
    <!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
    <!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
    <!--[if gt IE 8]>      <html class="no-js"> <!--<![endif]-->
    <html>
        <head>
            <meta charset=\"utf-8\">
            <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">
            <title></title>
            <meta name=\"description\" content=\"\">
            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">
            <link rel=\"stylesheet\" href=\"\">
            <link rel=\"script\" href=\"scripts/board.js\">
        </head>
        <body>
            <p>Script Test</p>
            <!--[if lt IE 7]>
                <p class=\"browsehappy\">You are using an <strong>outdated</strong> browser. Please <a href=\"#\">upgrade your browser</a> to improve your experience.</p>
            <![endif]-->
            
            <link rel=\"script\" href=\"scripts/board.js\">
        </body>
    </html>'''

# TODO - Change Port to an appropriate individual port for yourself
app.run(host='0.0.0.0', port=22005,debug=True)