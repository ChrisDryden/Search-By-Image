from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import os.path
import tensorflow as tf
from flask import Flask, render_template, jsonify

app = Flask(__name__)
working_dir = os.getcwd() 

def get_features():
  img_features = {}

  graph_file = working_dir + '/inception/classify_image_graph_def.pb'
  with tf.gfile.FastGFile(graph_file, 'rb') as f:
    graph_def = tf.GraphDef()
    graph_def.ParseFromString(f.read())
    _ = tf.import_graph_def(graph_def, name='')

  with tf.Session() as sess:
    # 'pool_3:0': 2048 vector of images

    last_layer = sess.graph.get_tensor_by_name('pool_3:0')

    for file in os.listdir(working_dir + '/static/img'):
      if file.endswith(".jpg"):
        print(file)
        img_path = working_dir + '/static/img/' + file
        image_data = tf.gfile.FastGFile(img_path, 'rb').read()
        # 'DecodeJpeg/contents:0': jpeg to tensor code
        features = sess.run(last_layer, {'DecodeJpeg/contents:0': image_data})
        img_features[file] = list([float(x) for x in features[0][0][0]])
  return img_features

# homepage
@app.route("/")
def index():
  return render_template('index.html')

@app.route('/get_img_features')
def get_img_features():
  img_features = get_features()
  print(type(img_features))
  print("server calculated features")
  return jsonify(img_features)

# Serve static files
@app.route('/<path:path>')
def static_proxy(path):
  # send_static_file will guess the correct MIME type
  return app.send_static_file(path)

# Run the server app
if __name__ == "__main__":
  app.debug = True
  app.run()
  app.run(debug = True)