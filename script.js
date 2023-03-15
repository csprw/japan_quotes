// The quotes to use
var quotes = [
  "You deserve your love and affection",
  "Your soul and your heart are like rabbits.",
  "No, really, don't get up before the chickens do.",
  "Three things cannot be long hidden: the sun, the moon, and the truth.",
  "If anything is worth doing, do it with all your heart.",
  'Can we go to the park.',
  'Where is the orange cat? Said the big black dog.',
  'We can make the bird fly away if we jump on something.',
  'We can go down to the store with the dog. It is not too far away.',
  'My big yellow cat ate the little black bird.',
  'I like to read my book at school.',
  'We are going to swim at the park.'  
];


// The faceAPI
const video = document.getElementById('video');
console.log("Vid");

Promise.all([
  // faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  // faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  // faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  // faceapi.nets.faceExpressionNet.loadFromUri('/models')
  faceapi.nets.tinyFaceDetector.loadFromUri('./'),
  faceapi.nets.faceLandmark68Net.loadFromUri('./'),
  faceapi.nets.faceRecognitionNet.loadFromUri('./'),
  faceapi.nets.faceExpressionNet.loadFromUri('./')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {

  console.log("[debug] Video playing");
  // Add the canvas for bouding boxes
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)

  // Detect faces
  setInterval(async () => {
    // Detect the faces
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    // console.log("[debug] detections: ", detections);

    // Put bounding box over detections
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

    if (document.getElementById('boundingBox').checked) {
      faceapi.draw.drawDetections(canvas, resizedDetections);
    };
    if (document.getElementById('landmarks').checked) {
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    };
    if (document.getElementById('expression').checked) {
      faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    };

    // Jus draw everything
    // faceapi.draw.drawDetections(canvas, resizedDetections)
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

    if (typeof detections !== 'undefined' && detections.length > 0) {
      // Face detected
      if (window.notDetectedDuration >= 1500) {
        var q = quotes[ Math.floor( Math.random() * quotes.length ) ];
        document.getElementById("theText").innerHTML = q;     
      }
      window.notDetectedDuration = 0;
    }
    else {
      // No faces detected
      console.log("No faces detected");
      if (window.notDetectedDuration >= 1500) {
        document.getElementById("theText").innerHTML = " ";     
      }
      window.notDetectedDuration += 100;
    }
   
  }, 100)
})





window.notDetectedDuration = 100;
var q = quotes[ Math.floor( Math.random() * quotes.length ) ];
document.getElementById("theText").innerHTML = q;   