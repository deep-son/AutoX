from flask import Flask, render_template, jsonify
import json

app = Flask(__name__)

# ...

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/get_trie_data')
def get_trie_data():
    with open('trie_data.json', 'r') as json_file:
        trie_data = json.load(json_file)
    
    print(trie_data)
    return jsonify(trie_data)


# ...

if __name__ == '__main__':
    app.run(debug=True)
