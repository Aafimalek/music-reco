# app.py
from flask import Flask, request, jsonify, render_template
from recommend import recommend_songs, get_all_songs
from flask_cors import CORS

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/songs', methods=['GET'])
def get_songs():
    return jsonify(get_all_songs())

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    song_name = data.get('song', '')
    results = recommend_songs(song_name)
    if results is None:
        return jsonify({'error': 'Song not found'}), 404
    return jsonify(results.to_dict(orient='index'))

if __name__ == '__main__':
    app.run(debug=False,port=5000, host='0.0.0.0')
