# Breathwise

## Overview
Our product uses both machine learning trained on audios of breathing and an algorithm to determine the probability of diseases based on patient-reported symptoms. We combine the two to further boost the accuracy of our predictions. Our goal for this project was to help reduce traffic in hospitals and tackling one of the most common reasons for medical visits, respiratory illness. This way, doctors can focus more on patients who need it. It also makes healthcare more accessible by lowering the amount of money people need to spend on medical bills and allowing them to take charge of their own health.

## How we built it
We used a React.js frontend with a Node.js backend, and we custom made our own machine learning model with a validation accuracy of 92%. For the model itself, we used Keras and Tensorflow.js to integrate the model. Our dataset was from Kaggle and is linked below:
https://www.kaggle.com/datasets/vbookshelf/respiratory-sound-database

Here is the link to the Google Collab file where we trained the model:
https://colab.research.google.com/drive/1ZRmA_ncOixDyKSs0by0nVcwCL2Oz29qo

