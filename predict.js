let imageLoaded = false
$("#image-selector").change(function () {
	imageLoaded = false
	let reader = new FileReader()
	reader.onload = function () {
		let dataURL = reader.result
		$("#selected-image").attr("src", dataURL)
		for(let i=0;i<5;i++){
      document.getElementById('result-' + i).innerHTML = ''
      document.getElementById('result-bar-' + i).style.width = '0'
      document.getElementById('result-number-' + i).innerHTML = ''
    }
		imageLoaded = true
	}
	
	let file = $("#image-selector").prop('files')[0]
	reader.readAsDataURL(file)
})

let binmodel
let modelLoaded = false
$( document ).ready(async function () {
	modelLoaded = false
  console.log( "Loading model..." )
  // binmodel = await tf.loadLayersModel('model/binary.json')
	multimodel = await tf.loadLayersModel('model_4/model.json')
  console.log( "Model loaded." )
	$('#model-loading-container').hide()
	modelLoaded = true
})

$("#predict-button").click(async function () {
	if (!modelLoaded) { alert("The model must be loaded first"); return }
	if (!imageLoaded) { alert("Please select an image first"); return }
	
	let image = $('#selected-image').get(0)
	
	// Pre-process the image
	console.log( "Loading image..." )
	let tensor = tf.browser.fromPixels(image)
		.resizeNearestNeighbor([224,224]) // change the image size
		.expandDims()
		.toFloat()
		.div(tf.scalar(255.0))//convert to gray
	// let binpredict = await binmodel.predict(tensor).data()
	// console.log(binpredict)
	// $('#prediction-list').append(`<li>pneumonia: ${binpredict[0].toFixed(6)}</li>`)
  $('#predict-loading-container').show()
	let multipredicts = await multimodel.predict(tensor).data()
	console.log(multipredicts)
	let top5 = Array.from(multipredicts)
		.map(function (p, i) { // this is Array.map
			return {
				probability: p,
				className: MULTICLASS[i] // we are selecting the value from the obj
			}
		})
		.sort(function (a, b) {
			return b.probability - a.probability
		})
  let i = 0
	top5.forEach(function (p) {
    document.getElementById('result-' + i).innerHTML = p.className
    console.log(((p.probability * 50).toFixed(2)).toString() + '%')
    document.getElementById('result-bar-' + i).style.width = ((p.probability * 50).toFixed(2)).toString() + '%'
    document.getElementById('result-number-' + i).innerHTML = (p.probability * 100).toFixed(2).toString() + '%'
    i += 1
	})
  $('#predict-loading-container').hide()
  document.getElementById('predict-result-container').style.animation = ''
  document.getElementById('predict-result-container').style.animation = 'spin2 1s linear'
	// let sum = 0
	// multipredicts.forEach(function(p){
	// 	sum += p
	// })
	// console.log(sum)
})
