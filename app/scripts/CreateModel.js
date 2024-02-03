import * as tf from '@tensorflow/tfjs';

export const createModel = () => {
    const model = tf.sequential();

    model.add(tf.layers.dense({inputShape: [5], units: 10, activation: 'relu'}));

    model.add(tf.layers.dense({units: 1, activation: 'sigmoid'}));

    model.compile({
        optimizer: tf.train.adam(),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy'],
    });

    return model;
};

