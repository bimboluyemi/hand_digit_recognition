import { MnistData } from './data.js';

async function showExamples(data){
    // create a container in visor
    const surface = tfvis.visor().surface({ name: 'Input Data Examples', tab: 'Input Data'});

    // get the examples 
    const examples = data.nextTestBatch(20);
    const numExamples = examples.xs.shape[0];

    // create canvas element to render each examples
    for (let i = 0; i < numExamples; i++) {
        const imageTensor = tf.tidy(() => {
            // Reshape the image to 28x28 px
            return examples.xs
              .slice([i, 0], [1, examples.xs.shape[1]])
              .reshape([28, 28, 1]);
        });

        const canvas = document.createElement('canvas');
        canvas.width = 28;
        canvas.height = 28;
        canvas.style = 'margin: 4px;';
        await tf.browser.toPixels(imageTensor, canvas);
        surface.drawArea.appendChild(canvas);

        imageTensor.dispose();
    }
}

async function run() {
    const data = new MnistData();
    await data.load();
    await showExamples(data);
}

document.addEventListener('DOMContentLoaded', run);

function getModel() {
    const model = tf.sequential();

    const IMAGE_WIDTH = 28;
    const IMAGE_HEIGHT = 28;
    const IMAGE_CHANNELS = 1;

    // In the first layer of out convolutional neural network we have 
    // to specify the input shape. Then we specify some parameters for 
    // the convolution operation that takes in this layer

    model.add(tf.layers.conv2d({
        inputShape: [IMAGE_WIDTH, IMAGE_HEIGHT, IMAGE_CHANNELS],
        kernelSize: 5,
        filters: 8,
        strides: 1,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
    }));

    model.add(tf.layers.maxPooling2d({poolSize: [2, 2], strides: [2, 2]}));

    // Now we flatten the output from the 2D filters into a 1D vector to prepare 
    // it for input into our last layer. This is common practice when feesing 
    // higher dimensional data to a final classification output layer.
    model.add(tf.layers.flatten());

    // Our last layer is a dense layer which has 10 output units, one for each
    // output class (i.e. 0, 1, 2, 3, 4, 5 ,6, 7, 8, 9).
    const NUM_OUTPUT_CLASSES = 10;
    model.add(tf.layers.dense({
        units: NUM_OUTPUT_CLASSES,
        kernelInitializer: 'varianceScaling',
        activation: 'softmax'
    }));

    // Choose an optimizer, loss function and accuracy metric,
    // then compile and return the model
    const optimizer = tf.train.adam();
    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy'],
    });

    return model;
}