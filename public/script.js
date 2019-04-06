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