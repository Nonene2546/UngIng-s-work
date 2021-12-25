let imageLoaded = false;
$("#image-selector").change(function () {
	imageLoaded = false;
	let reader = new FileReader();
	reader.onload = function () {
		let dataURL = reader.result;
		$("#selected-image").attr("src", dataURL);
		$("#prediction-list").empty();
		imageLoaded = true;
	}
	
	let file = $("#image-selector").prop('files')[0];
	reader.readAsDataURL(file);
});

let modelLoaded = false;
$( document ).ready(async function () {
	modelLoaded = false;
	$('.progress-bar').show();
    console.log( "Loading model..." );
    binmodel = await tf.loadLayersModel('model/binary.json');
    console.log( "Model loaded." );
	$('.progress-bar').hide();
	modelLoaded = true;
});

$("#predict-button").click(async function () {
	if (!modelLoaded) { alert("The model must be loaded first"); return; }
	if (!imageLoaded) { alert("Please select an image first"); return; }
	
	let image = $('#selected-image').get(0);
	
	// Pre-process the image
	console.log( "Loading image..." );
	let tensor = tf.browser.fromPixels(image, 1)
		.resizeNearestNeighbor([350,350]) // change the image size
		.expandDims()
		.toFloat()
		.div(tf.scalar(255.0))//convert to gray
	let binpredict = await binmodel.predict(tensor).data();
	console.log(binpredict)
	$('#prediction-list').empty()
	$('#prediction-list').append(`<li>cataract: ${binpredict[0].toFixed(6)}</li>`)
});
