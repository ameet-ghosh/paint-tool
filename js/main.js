var $canvas = $("canvas");
var context = $canvas[0].getContext("2d");
var lastEvent;
var isMouseDown = false;
var color='black';
var socket = io.connect('http://192.168.2.154:3000');
function mouseEnd(){ isMouseDown = false; }
function drawingEvent(e) {
	return (typeof(e.offsetX) === 'undefined') ? 
		{offsetX: e.pageX - $canvas.offset().left , offsetY: e.pageY - $canvas.offset().top} :
		{offsetX: e.offsetX, offsetY: e.offsetY};
}
socket.on("drawing", function(line){
  drawLine(line);
});
$('.submit').on('click',function(){
    var userName=$('.nameText').val();
    socket.emit('user', userName);
})
// socket.on("addColor", function(addNewColor){
//   addNewColorSocket(addNewColor);
// });
function addNewColorSocket(addNewColor){
    $('li').removeClass("selected");
    var $li = $("<li />");
	$li.css("background-color", addNewColor).addClass('selected');
	$("ul").append($li);
    // $(".favcolor").val(addNewColor);
}
$("ul").on("click", "li", function() {
	$(this).addClass("selected").siblings().removeClass("selected");
	color = $(this).css("background-color");
});
$(".favcolor").on("change", function() {
	// $('li').removeClass("selected");
	color = $(this).val();
    addNewColor=$(this).val();
    addNewColorSocket(addNewColor);
    // socket.emit('addColor',color);

});
function drawLine(line) {
	context.beginPath();
	context.moveTo(line.start.x,line.start.y);	
	context.lineTo(line.end.x, line.end.y);
	context.strokeStyle = line.color;
	context.stroke();
}
$canvas.on("mousedown touchstart", function(e){
	e.preventDefault();
	lastEvent = drawingEvent(e);
	isMouseDown = true;
})
$canvas.on("mousemove touchmove", function(e){
  e.preventDefault();
	var event = drawingEvent(e);
	if(isMouseDown) {
		var line = {
			start: {x: lastEvent.offsetX, y: lastEvent.offsetY}, 
			end: {x: event.offsetX, y: event.offsetY},
			color: color
		}
		drawLine(line);
		socket.emit("drawing", line);
		lastEvent = drawingEvent(e);		
	}
})
$canvas.on("mouseup touchend", mouseEnd);
$canvas.on("mouseleave touchcancel", mouseEnd);
