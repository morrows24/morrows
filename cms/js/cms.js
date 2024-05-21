/* 
CoastCMS
Copyright (c) 2017 Fabian Freitag
Licensed under the MIT license
www.coast-cms.de 
*/

/* ------------------------------------------------------------------------------- */

function notify(content, duration){
if (!duration) {duration = 10000;}

$('.cms_notifications').prepend('<div class="cms_notification">'+content+'<div class="cms_button_hide_notification"><i class="fa fa-times"></i></div></div>').children().first().slideDown(300).wait(duration).slideUp(300);

$('.cms_button_hide_notification').click(function () { $(this).parent().slideUp(100);  });
}

/* ------------------------------------------------------------------------------- */

function imagelightbox(currentimage){
$('body').append('<div class="cms_imagelightbox"><img src="'+currentimage+'"></div>');
$('.cms_imagelightbox').fadeIn(300).css('height',$(window).height()-50+'px').css('width',$(window).width()+'px').spin(spinneroptions);
$('.cms_imagelightbox img').css('max-height',$(window).height()-100+'px').css('max-width',$(window).width()-100+'px');
$('.cms_imagelightbox img').on('load', function(){
var margintop = ($(window).height()-50-$(this).height())/2;
$(this).css('margin-top',margintop+'px').fadeIn(200);
$(this).parent().spin(false);
});
$('.cms_imagelightbox').click(function(){ $(this).fadeOut(300, function(){$(this).remove();});});

$(window).bind("resize", function(){
$('.cms_imagelightbox').css('height',$(window).height()-50+'px').css('width',$(window).width()+'px');
$('.cms_imagelightbox img').css('max-height',$(window).height()-100+'px').css('max-width',$(window).width()-100+'px');
});
}

/* ------------------------------------------------------------------------------- */

function countdown() {

if(timeout === 0) {
clearInterval(countdowntimer);
location.reload(true);
} else {
if (timeout == 90) {  
notify('<i class="fa fa-exclamation-triangle"></i> '+warning_logout,90000);
}
if (timeout <= 90) {  $('#cms_countdown').html(timeout); }
timeout--;
}
}


/* ------------------------------------------------------------------------------- */

function initImageUploads(){

$('img.editable_image').each(function(index){

if ($(this).parent().is('a')){

$(this).parent().after('<div class="cms_editableimage_overlay"><i class="fa fa-cloud-upload"></i></div><input type="file" name="imgdata" class="cms_editableimage_input">');

var pathtooverlay = $(this).parent().next();

} else {

$(this).after('<div class="cms_editableimage_overlay"><i class="fa fa-cloud-upload"></i></div><input type="file" name="imgdata" class="cms_editableimage_input">');

var pathtooverlay = $(this).next();

}

var imgwidth=$(this).width();
var imgheight=$(this).height();

var overlaywidth=$(this).outerWidth();
var overlayheight=$(this).outerHeight(); //.outerHeight(true);

var margin=$(this).css('margin'); // try margin-left...!? // top+margin-top...
var position = $(this).position();
		
pathtooverlay.width(overlaywidth).height(overlayheight).css('top', position.top).css('left', position.left).css('line-height', overlayheight+'px').css('margin', margin).fadeIn(200);

//$.event.props.push('dataTransfer');

pathtooverlay.on("dragover", function(event) {
event.preventDefault();  
event.stopPropagation();
$(this).addClass('dragging');
$(this).fadeTo(5, 0.8).html('<i class="fa fa-cloud-upload"></i>');
});

pathtooverlay.on("dragleave", function(event) {
event.preventDefault();  
event.stopPropagation();
$(this).removeClass('dragging');
$('.cms_editableimage_link_overlay').show();
});

pathtooverlay.on("drop", function(event) {

event.preventDefault();  
event.stopPropagation();

var file = event.originalEvent.dataTransfer.files[0];
checkimgfile(index, file);
}); // END DROP

// CLICK FALLBACK

pathtooverlay.click(function(){ $(this).next().trigger('click'); }); 

pathtooverlay.next().change(function(event) { 
var file = this.files[0];
checkimgfile(index, file);
}); // END CHANGE FALLBACK
}); // END EACH



// resize overlay
$(window).bind("resize", function(){

$('img.editable_image').each(function(){
var position = $(this).position();
var overlaywidth=$(this).outerWidth();
var overlayheight=$(this).outerHeight();

if ($(this).parent().is('a')){ var pathtooverlay = $(this).parent().next();
} else { var pathtooverlay = $(this).next(); }

pathtooverlay.width(overlaywidth).height(overlayheight).css('top', position.top).css('left', position.left).css('line-height', overlayheight+'px');
});

});



// resize overlay
window.setTimeout(function(){
$('img.editable_image').each(function(){
var position = $(this).position();
var overlaywidth=$(this).outerWidth();
var overlayheight=$(this).outerHeight();

if ($(this).parent().is('a')){ var pathtooverlay = $(this).parent().next();
} else { var pathtooverlay = $(this).next(); }

pathtooverlay.width(overlaywidth).height(overlayheight).css('top', position.top).css('left', position.left).css('line-height', overlayheight+'px');
})}, 1000);





// IMAGE-LINKS
$('.editable_image_link img').each(function(){

var currenthref = $(this).parent().attr('href');

$(this).parent().next().next('input').after('<div class="cms_imagelink_input_bar">'+
'<input type="text" class="cms_imagelink_input" value="'+currenthref+'">'+
'<div class="cms_imagelink_button cms_imagelink_button_ok"><i class="fa fa-check"></i></div>'+
'<div class="cms_imagelink_button cms_imagelink_button_cancel"><i class="fa fa-times"></i></div>'+
'<div class="clearer"></div>'+
'</div>');

var imgwidth=$(this).width();
var imgheight=$(this).height();

var position = $(this).position();
		
$(this).parent().next().next().next().css('top', position.top + imgheight).css('left', position.left);
});

$('.cms_editableimage_overlay').mouseenter(function(){
$('.cms_imagelink_input_bar').hide();
$(this).next().next('.cms_imagelink_input_bar').show();
});

$('.cms_imagelink_input_bar').mouseleave(function(){
$(this).hide();
});

$('.cms_imagelink_button_ok').click(function(){
$(this).parent().prev().prev().prev().attr('href', $(this).prev().val());
$(this).parent().hide();
});

$('.cms_imagelink_button_cancel').click(function(){
$(this).prev().prev().val($(this).parent().prev().prev().prev().attr('href'));
$(this).parent().hide();
});


} // END INITUPLOADS


function checkimgfile(index, file){

$('.cms_editableimage_overlay').eq(index).fadeTo(5, 0.8).html('').spin(spinneroptions);

maxfilesize = parseInt(maxfilesize);
currentfilesize = file.size/1024/1024;
filename = file.name;
filetype = filename.substr(-4);
filetype = filetype.toLowerCase();

//if (currentfilesize > maxfilesize){ notify(file_to_big,5000); } else 

if (filetype != '.jpg' && filetype != '.png' && filetype != '.gif' && filetype != '.pdf' && filetype != 'jpeg'){
	
notify(wrong_img_filetype,5000); 
$('.cms_editableimage_overlay').eq(index).spin(false).removeClass('dragging').html('<i class="fa fa-cloud-upload"></i>');

} else {

// ROCK N ROLL!

var currentdatatype = $('img.editable_image').eq(index).attr('data-type');
if (!currentdatatype) { currentdatatype = 'single_image'; }

var currentdataoption = $('img.editable_image').eq(index).attr('data-option');
if (!currentdataoption) { currentdataoption = 'crop';}

// FIX WIDTH
if ($('img.editable_image').eq(index).attr('data-width') > 0){
imgwidth=$('img.editable_image').eq(index).attr('data-width');
}else{
imgwidth=$('img.editable_image').eq(index).width();
}

if ($('img.editable_image').eq(index).attr('data-height') > 0){
imgheight=$('img.editable_image').eq(index).attr('data-height');
}else{
imgheight=$('img.editable_image').eq(index).height();
}


if (filetype == '.jpg' || filetype == '.JPG' || filetype == 'jpeg' || filetype == 'JPEG'){
checkexiforientation(index, file, filename, filetype, imgwidth, imgheight, currentdatatype, currentdataoption);
} else {
if (currentfilesize > maxfilesize){ notify(file_to_big,5000); } else {
postimgdata(index, file, file, filename, filetype, imgwidth, imgheight, currentdatatype, currentdataoption);
}

}

} // END ROCK N ROLL
} // END checkimgfile


//name: Hermite resize
//author: ViliusL, https://github.com/viliusle/Hermite-resize
function resample_hermite(e,t,n,r,i){var s=Date.now();var o=e.getContext("2d").getImageData(0,0,t,n);var u=e.getContext("2d").getImageData(0,0,r,i);var a=o.data;var f=u.data;var l=t/r;var c=n/i;var h=Math.ceil(l/2);var p=Math.ceil(c/2);for(var d=0;d<i;d++){for(var v=0;v<r;v++){var m=(v+d*r)*4;var g=0;var y=0;var b=0;var w=gx_g=gx_b=gx_a=0;var E=(d+.5)*c;for(var S=Math.floor(d*c);S<(d+1)*c;S++){var x=Math.abs(E-(S+.5))/p;var T=(v+.5)*l;var N=x*x;for(var C=Math.floor(v*l);C<(v+1)*l;C++){var k=Math.abs(T-(C+.5))/h;var L=Math.sqrt(N+k*k);if(L>=-1&&L<=1){g=2*L*L*L-3*L*L+1;if(g>0){k=4*(C+S*t);gx_a+=g*a[k+3];b+=g;if(a[k+3]<255)g=g*a[k+3]/250;w+=g*a[k];gx_g+=g*a[k+1];gx_b+=g*a[k+2];y+=g}}}}f[m]=w/y;f[m+1]=gx_g/y;f[m+2]=gx_b/y;f[m+3]=gx_a/b}}console.log("hermite = "+Math.round(Date.now()-s)/1e3+" s");e.getContext("2d").clearRect(0,0,Math.max(t,r),Math.max(n,i));e.width=r;e.height=i;e.getContext("2d").putImageData(u,0,0)}

//---

function checkexiforientation(index, file, filename, filetype, imgwidth, imgheight, currentdatatype, currentdataoption){
var src = file;

var exifreader = new FileReader();
exifreader.onload = function(e){ 
src = e.target.result;

var exif = EXIF.readFromBinaryFile(new BinaryFile(this.result));
var orientation = exif.Orientation;

initreader(index, file, filename, filetype, imgwidth, imgheight, currentdatatype, currentdataoption, orientation);

}; // END READER ONLOAD

exifreader.readAsBinaryString(src);

}
	
//---	

function initreader(index, file, filename, filetype, imgwidth, imgheight, currentdatatype, currentdataoption, orientation){
var src = file;
if(!src.type.match(/image.*/)){ notify(wrong_img_filetype,5000); return; }
var reader = new FileReader();
reader.onload = function(e){ 
src = e.target.result;
render(index, src, file, filename, filetype, imgwidth, imgheight, currentdatatype, currentdataoption, orientation);
}; // END READER ONLOAD
reader.readAsDataURL(src); // END CANVAS
}

//---

function render(index, src, file, filename, filetype, imgwidth, imgheight, currentdatatype, currentdataoption, orientation){

var image = new Image();
image.onload = function(){

var canvas = document.getElementById("temp_img_canvas");

// IF THUMB & BIG IMAGE

var original_width = image.width;
var original_height = image.height;

if (orientation == 8 || orientation == 6)  {
image.width = original_height;
image.height = original_width;

var original_width = image.width;
var original_height = image.height;
}


if (currentdatatype == 'thumb_and_big_image') {

var fix = maximgwidth; // 1200
if (image.height/image.width >= 1) { 
//HOCHFORMAT
image.width *= fix / image.height;
image.height = fix;
} else {
//QUERFORMAT
image.height *= fix / image.width;
image.width = fix;
}

} else if (currentdataoption == 'fixed_height') {
var fix_height = imgheight;
image.width *= fix_height / image.height;
image.height = fix_height;	

} else if (currentdataoption == 'fixed_width') {
var fix_width = imgwidth;
image.height *= fix_width / image.width;
image.width = fix_width;	

} else { //crop
var v_fact = imgheight / image.height;
var h_fact = imgwidth / image.width;

var im_fact = Math.max(v_fact, h_fact);
image.height = image.height * im_fact+1; // bugfix black pixels
image.width = image.width * im_fact+1;	
}

var ctx = canvas.getContext("2d");

canvas.width = original_width;
canvas.height = original_height;

ctx.clearRect(0, 0, canvas.width, canvas.height);

if (orientation == 3) { // ROTATE 180
ctx.translate(canvas.width, canvas.height);
ctx.rotate(180*Math.PI/180);
ctx.drawImage(image, 0, 0, original_width, original_height);

} else if (orientation == 6) { // ROTATE 90
ctx.translate(canvas.width, 0);
ctx.rotate(90*Math.PI/180);
ctx.drawImage(image, 0, 0, original_height, original_width); // H&W switched!

} else if (orientation == 8) { 
ctx.translate(0, canvas.height);
ctx.rotate(-90*Math.PI/180);
ctx.drawImage(image, 0, 0, original_height, original_width); // H&W switched!

} else {
ctx.drawImage(image, 0, 0, original_width, original_height);
}

resample_hermite(canvas, original_width, original_height, image.width, image.height);

if (currentdatatype != 'thumb_and_big_image' && currentdataoption != 'fixed_width' && currentdataoption != 'fixed_height') { // crop
crop_x = canvas.width/2 - imgwidth/2;
crop_y = canvas.height/2 - imgheight/2;
var resized_img = ctx.getImageData(crop_x, crop_y, image.width, image.height);
ctx.clearRect(0, 0, image.height, image.width);
canvas.width = imgwidth;
canvas.height = imgheight;
ctx.putImageData(resized_img,0,0,0,0,imgwidth,imgheight);	
}

postimgdata(index, src, file, filename, filetype, imgwidth, imgheight, currentdatatype, currentdataoption);

}; // END IMG ONLOAD

image.src = src;

}

function postimgdata(index, src, file, filename, filetype, imgwidth, imgheight, currentdatatype, currentdataoption){

if (filetype == '.jpg' || filetype == '.JPG' || filetype == 'jpeg' || filetype == 'JPEG'){

var imgdata = document.getElementById("temp_img_canvas").toDataURL("image/jpeg",0.93);
var imgdatatype = 'canvas';	
	
} else {
	
var imgdata = file;
var imgdatatype = 'file';	
	
}

var data = new FormData();
data.append('imgdata', imgdata);
data.append('imgdatatype', imgdatatype);
data.append('originalfilename', filename);
data.append('imgwidth', imgwidth);
data.append('imgheight', imgheight);
data.append('type', currentdatatype);
data.append('option', currentdataoption);
data.append('authorization', 'OK');

$.ajax({
url: 'cms/php/uploadimage.php',
data: data,
type: 'POST',
processData: false,
contentType: false,
success: function(response) { 

var responsefiletype = response.substr(-4);
responsefiletype = responsefiletype.toLowerCase();

if (response == 'notuploaded') {

notify(check_upload_dir,15000);
$('.cms_editableimage_overlay').eq(index).spin(false).removeClass('dragging').html('<i class="fa fa-cloud-upload"></i>');

} else if (response == 'wrong_img_filetype') {

notify(wrong_img_filetype,15000);
$('.cms_editableimage_overlay').eq(index).spin(false).removeClass('dragging').html('<i class="fa fa-cloud-upload"></i>');

} else if (responsefiletype != '.jpg' && responsefiletype != '.png' && responsefiletype != '.gif' && responsefiletype != '.JPG') {

notify(upload_failed, 15000);
//notify(response, 15000);

$('.cms_editableimage_overlay').eq(index).spin(false).removeClass('dragging').html('<i class="fa fa-cloud-upload"></i>');

} else {

$('img.editable_image').eq(index).attr('src', uploaddir+''+response);

$('img.editable_image').eq(index).on('load', function(){  

$('.cms_editableimage_overlay').eq(index).spin(false).removeClass('dragging').fadeTo(200, 0);

$('img.editable_image').each(function(){
var position = $(this).position();
var overlaywidth=$(this).outerWidth();
var overlayheight=$(this).outerHeight();

if ($(this).parent().is('a')){ var pathtooverlay = $(this).parent().next();
} else { var pathtooverlay = $(this).next(); }

pathtooverlay.width(overlaywidth).height(overlayheight).css('top', position.top).css('left', position.left).css('line-height', overlayheight+'px');
});

}); 

notify(img_upload_ok,5000);

// DELETE DEMO IMAGES
if (demomode == 'on'){
setTimeout(function () { $.ajax({ type: "POST", url: "cms/php/deletedemoimages.php", data: "authorization=OK" }); }, 1000); 
}

} // END ELSE NO ERROR
} // END SUCCESS
}); // END AJAX
} // END POSTIMGDATA


/* ------------------------------------------------------------------------------- */


function edit(){

$('*[id^="mce"]').removeAttr('id');

var total_areas = $('.editable, .editable_line').length;
var total_editable_images = $('img.editable_image').length;

if (total_areas == 0 && total_editable_images == 0) {
notify(no_editable_areas,10000);
} 

$('.cms_button').hide();
$('#cms_button_check, #cms_button_cancel').show();

// CHECK NESTED EDITABLE ELEMENTS
if ($('.editable .editable, .editable .editable_image').length > 0){
notify(error_nested_elements ,30000);
$('.editable .editable, .editable .editable_image').css('outline', '3px solid red');
$('#cms_button_check').remove();

} else if ($('img.editable').length > 0){

// CHECK WRONG TAGGED IMAGES
notify(error_wrong_image_tag,30000);
$('img.editable').css('outline', '3px solid red');
$('#cms_button_check').remove();

} else {

// EVERYTHINGS FINE - START THE EDITING MODE
$('.cms_pagetitle span').text($('title').text());
$('.cms_pagetitle').keyup(function() { $('title').text($('.cms_pagetitle span').text());});
$('.cms_pagetitle').keypress(function(e) {  if ( e.which == 13 ) { e.preventDefault(); } });

$('.cms_pagetitle').on('paste', function () { setTimeout(function () { var title = $('.cms_pagetitle span').text(); title = title.replace(/(\r\n|\n|\r)/gm,""); $('.cms_pagetitle span').text(title); }, 100); });


$('.editable, .editable_line').addClass('cms_editablearea');
$('body').addClass('editing');

tinymce.init(tinymcedivoptions);
tinymce.init(tinymceinlineoptions);

initImageUploads();
initContentSections();
initContentSectionSingleOverlays();

//SET POSITION OF IMG OVERLAYS
$('.editable, .editable_line').keyup(function() {
$('img.editable_image').each(function(){
position = $(this).position();
$(this).next().css('top', position.top).css('left', position.left);
});
});

$(window).bind('keydown', function(event) {
if (event.ctrlKey || event.metaKey) {
switch (String.fromCharCode(event.which).toLowerCase()) {
case 's':
event.preventDefault();
save();
break;
}}});

} // END ELSE

}

/* ------------------------------------------------------------------------------- */

function cancel(){

$('body').append('<div class="cms_wait_overlay"></div>');
$('.cms_wait_overlay').css('height',$(window).height()).css('width',$(window).width()).fadeIn(300).spin(spinneroptions);

tinymce.remove();
$('.editable, .editable_line').removeClass('cms_editablearea');
$('.cms_editableimage_overlay').fadeOut(200);
$('.cms_button').hide();
location.reload();
$('.cms_button_add_content_section').remove();

}

/* ------------------------------------------------------------------------------- */

var currenturl = document.URL.split("cms.php")[0];

function addLinkListener(){

$('a').click(function(e){

var target = $(this).attr("href");
target = target.replace(currenturl,'');

if (this.host !== location.host) {

e.preventDefault();
notify(external_link,5000);

} else if (/#/i.test(target)){

e.preventDefault();
//window.location.href = target;
window.location.href = 'cms.php?currentfile='+target;

} else if (/.jpg/i.test(target)||/.png/i.test(target)||/.gif/i.test(target)){

if ($('#cms_button_edit').is(':visible')){ 
e.preventDefault();	
//imagelightbox(currenturl+''+target);
}

} else if (!/.html/i.test(target)){

e.preventDefault();
notify(html_only,5000);

} else {

e.preventDefault();

if (!$('body').hasClass('editing')){
window.location.href = 'cms.php?currentfile='+target;
} else {
notify('Um eine andere Seite aufrufen zu können, müssen Sie erst speichern oder abbrechen.',5000);
}

/*if ($('#cms_button_check').is(':visible') && $(this).children().attr('data') == 'editable_image'){ 
$('.cms_editableimage_input').eq(0).trigger('click');
alert($(this).children().next().next().attr('class'));
} else { 
window.location.href = 'cms.php?currentfile='+target;
}*/

}

});

}

/* ------------------------------------------------------------------------------- */

function initContentSections(){
	
$('.content_section_wrap').each(function(){

var currentbuttontitle= $(this).attr('data-cs-title');

var currentbuttonposition = $(this).attr('data-cs-pos');
//if (!currentbuttonposition) {currentbuttonposition = 'top';}

// TOP -------------------------
if (currentbuttonposition == 'top') {

$(this).before('<div class="cms_button_add_content_section"><i class="fa fa-plus-square"></i> '+currentbuttontitle+'</div>');

//$('.cms_button_add_content_section').click(function(){ // debugged
$(this).prev().click(function(){	

$(this).append('<div class="cms_button_add_content_section_spinner"></div>');
$('.cms_button_add_content_section_spinner').spin(spinneroptions);

var cs_src = $(this).next().attr('data-cs-src');
$.ajax({
context: this,
cache: false,
url: cs_src,
success: function(response){ 
$('.cms_button_add_content_section_spinner').remove();
$(this).next().prepend('<div class="content_section_item">'+response+'</div>');
tinymce.init(tinymcedivoptions);
tinymce.init(tinymceinlineoptions);
$('.cms_editableimage_overlay').remove(); 
initImageUploads();
$('.editable, .editable_line').addClass('cms_editablearea');
},
error: function () { notify(error_contentsection, 10000); $('.cms_button_add_content_section_spinner').remove();}
}); 
});

// BOTTOM -------------------------
} else if (currentbuttonposition == 'bottom') {

$(this).after('<div class="cms_button_add_content_section"><i class="fa fa-plus-square"></i> '+currentbuttontitle+'</div>');

//$('.cms_button_add_content_section').click(function(){ // debugged
$(this).next().click(function(){	

$(this).append('<div class="cms_button_add_content_section_spinner"></div>');
$('.cms_button_add_content_section_spinner').spin(spinneroptions);

var cs_src = $(this).prev().attr('data-cs-src');
$.ajax({
context: this,
cache: false,
url: cs_src,
success: function(response){ 
$('.cms_button_add_content_section_spinner').remove();
$(this).prev().append('<div class="content_section_item">'+response+'</div>');
tinymce.init(tinymcedivoptions);
tinymce.init(tinymceinlineoptions);
$('.cms_editableimage_overlay').remove(); 
initImageUploads();
$('.editable, .editable_line').addClass('cms_editablearea');
},
error: function () { notify(error_contentsection, 10000); $('.cms_button_add_content_section_spinner').remove();}
}); 
});

// DRAGGABLE -------------------------
} else if (currentbuttonposition == 'draggable') {

$(this).before('<div class="cms_button_add_content_section"><i class="fa fa-plus-square"></i> '+currentbuttontitle+'</div>');

//$('.cms_button_add_content_section').click(function(){ // debugged
$(this).prev().click(function(){	

$(this).append('<div class="cms_button_add_content_section_spinner"></div>');
$('.cms_button_add_content_section_spinner').spin(spinneroptions);

var cs_src = $(this).next().attr('data-cs-src');
$.ajax({
context: this,
cache: false,
url: cs_src,
success: function(response){ 
$('.cms_button_add_content_section_spinner').remove();
$(this).next().prepend('<div class="content_section_item">'+response+'</div>');
tinymce.init(tinymcedivoptions);
tinymce.init(tinymceinlineoptions);
$('.cms_editableimage_overlay').remove(); 
initImageUploads();
$('.editable, .editable_line').addClass('cms_editablearea');
// draggable
$('.sortable').sortable('destroy'); 
$('div[data-cs-pos="draggable"]').removeClass('sortable');
initDraggableContentSection();

// BETA 20151012
$('.content_section_item').bind('drag', function(){ 
var height = $(this).height()+10;
var width = $(this).width()+10;
var margin = $(this).children().css('margin');
$('.sortable-placeholder').css('background', 'white').css('border', '1px dashed #ccc').css('height', height+'px').css('width', width+'px').css('transform', 'translate(-5px,-5px)').css('margin', margin);
});

},
error: function () { notify(error_contentsection, 10000); $('.cms_button_add_content_section_spinner').remove();}
}); 
});

// EACH -------------------------
} else {

$(this).find('.content_section_item').before('<div class="cms_button_add_content_section"><i class="fa fa-plus-square"></i> '+currentbuttontitle+'</div>');
$(this).append('<div class="cms_button_add_content_section"><i class="fa fa-plus-square"></i> '+currentbuttontitle+'</div>');

$('.cms_button_add_content_section').click(function(){

$(this).append('<div class="cms_button_add_content_section_spinner"></div>');
$('.cms_button_add_content_section_spinner').spin(spinneroptions);

var cs_src = $(this).parent().attr('data-cs-src');

$.ajax({
context: this,
cache: false,
url: cs_src,
success: function(response){ 
$('.cms_button_add_content_section_spinner').remove();
$(this).after('<div class="content_section_item">'+response+'</div>');
tinymce.init(tinymcedivoptions);
tinymce.init(tinymceinlineoptions);
$('.cms_editableimage_overlay').remove(); 
initImageUploads();
$('.editable, .editable_line').addClass('cms_editablearea');
},
error: function () { notify(error_contentsection, 10000); $('.cms_button_add_content_section_spinner').remove();}
}); 
});

}

}); // END EACH

}


/* ------------------------------------------------------------------------------- */

function initDraggableContentSection(){

$('div[data-cs-pos="draggable"]').addClass('sortable');
$('.sortable').sortable({
items: '.content_section_item'
});

$('.content_section_item').bind('drag', function(){ 
var height = $(this).find('.cms_content_section_single_overlay').height()-2;
var width = $(this).find('.cms_content_section_single_overlay').width()-2;

// DEBUG HERE!!! maybe if width < 1?
//var height = $(this).outerHeight(true);
//var width = $(this).outerWidth(true);

var margin = $(this).children().css('margin');
$('.sortable-placeholder').css('background', 'white').css('border', '1px dashed #ccc').css('height', height+'px').css('width', width+'px').css('transform', 'translate(-5px,-5px)').css('margin', margin);
});

$('.content_section_item').on('dragend.h5s', function() {
$('.cms_editableimage_overlay').remove(); 
$('.cms_editableimage_link_overlay').remove();
$('.cms_editableimage_input').remove(); // BETA 20151012
initImageUploads();
});

$('.editable, .editable_line').focus(function() {
$('.sortable').sortable('destroy');
});

$('.editable, .editable_line').blur(function() {
$('.content_section_wrap').addClass('sortable');
$('.sortable').sortable({
items: '.content_section_item'
});
});

}

/* ------------------------------------------------------------------------------- */


function initContentSectionSingleOverlays(){

$('.content_section_item').each(function(index){

$(this).append(''+
'<div class="cms_content_section_single_overlay">'+
'<i class="edit fa fa-pencil-square-o"></i>'+
'<i class="delete fa fa-trash-o"></i>'+
'<i class="ok fa fa-check"></i>'+
'<i class="cancel fa fa-times"></i>'+
'</div>');

overlaywidth=$(this).outerWidth()+10;
overlayheight=$(this).outerHeight()+10;
		
$(this).find('div').last().width(overlaywidth).height(overlayheight).css('line-height', overlayheight+'px').fadeIn(200);

});

$('.cms_content_section_single_overlay .ok, .cms_content_section_single_overlay .cancel').hide();

$('.cms_content_section_single_overlay .edit').click(function(){
$(this).parent().fadeOut(300);
});

$('.cms_content_section_single_overlay .delete').click(function(){
$(this).parent().find('.ok, .cancel').show();
$(this).parent().find('.edit, .delete').hide();
});

$('.cms_content_section_single_overlay .cancel').click(function(){
$(this).parent().find('.ok, .cancel').hide();
$(this).parent().find('.edit, .delete').show();
});

$('.cms_content_section_single_overlay .ok').click(function(){
$(this).parent().parent().slideUp(300).wait(300).remove();
if ( $(this).parent().parent().prev().attr('class') == 'cms_button_add_content_section'){
$(this).parent().parent().prev().slideUp(300).wait(300).remove();}
});



// resize overlays
$(window).bind("resize", function(){
$('.content_section_item').each(function(index){

overlaywidth=$(this).outerWidth()+10;
overlayheight=$(this).outerHeight()+10;
		
$(this).find('.cms_content_section_single_overlay').last().width(overlaywidth).height(overlayheight).css('line-height', overlayheight+'px');

});
});


// CS-SORTABLE
initDraggableContentSection();
}


/* ------------------------------------------------------------------------------- */


function save(){

$('#cms_button_check i').css('opacity',0);
$('#cms_button_check').spin(spinneroptions);

//$('.cms_toolbar').prevUntil('.cms_toolbar').addClass('blur');

if (demomode != 'on'){

$('body').append('<div class="cms_wait_overlay"></div>');
$('.cms_wait_overlay').css('height',$(window).height()).css('width',$(window).width()).fadeIn(300).spin(spinneroptions);

// CS-SORTABLE
$('.sortable').sortable('destroy');
$('div').removeAttr('draggable');

//tinymce.remove(); // IFRAME-FIX
$('.editable, .editable_line').removeClass('cms_editablearea');
$('body').removeClass('editing');
$('.cms_editableimage_overlay, .cms_content_section_single_overlay, .cms_editableimage_input, .cms_button_add_content_section, .cms_editableimage_link_overlay, .cms_imagelink_input_bar').remove();
$('*[contenteditable="true"]').removeAttr('contenteditable');

//$('.content_section_wrap *').removeAttr('id').removeAttr('spellcheck').removeAttr('data-mce-selected'); // IFRAME-FIX

// TITLE
var pagetitle = $('.cms_pagetitle span').text();

// CONTENT
var i;
var content_length = $('.editable, .editable_line').length;
var content = new Array();
for (i = 0; i < content_length; i++){
//content[i] = $('*[data=editable]').eq(i).html(); // IFRAME-FIX
var currenttinymceid = $('.editable, .editable_line').eq(i).attr('id');
content[i] = tinymce.get(currenttinymceid).getContent();		
}
var content = JSON.stringify(content);

//IMAGES
var img_length = $('img.editable_image').length;
var img = new Array();
for (i = 0; i < img_length; i++){
img[i] = $('img.editable_image').eq(i).attr('src');			
}
var img = JSON.stringify(img);

//IMAGE-LINKS //BETA 20151026
var imagelinks_length = $('.editable_image_link').length;
var imagelinks = new Array();
for (i = 0; i < imagelinks_length; i++){
imagelinks[i] = $('.editable_image_link').eq(i).attr('href');			
}
var imagelinks = JSON.stringify(imagelinks);

//CONTENT SECTION WRAPS
tinymce.remove();
$('.content_section_wrap *').removeAttr('id').removeAttr('spellcheck').removeAttr('data-mce-selected'); // IFRAME-FIX

var csw_length = $('.content_section_wrap').length;
var csw = new Array();
for (i = 0; i < csw_length; i++){
csw[i] = $('.content_section_wrap').eq(i).html();		
csw[i] = csw[i].replace(/>/g, "*CLOSEBRACKET*");					
}

var csw = JSON.stringify(csw);

var currentfile = document.URL.split('currentfile=')[1];
currentfile = currentfile.split('#')[0];

//notify('<textarea style="width:100%; height:500px;">'+csw+'</textarea>',999999);

$.post( "cms/php/save.php", { 
	currentfile: currentfile, 
	pagetitle: pagetitle,
	content: content,
	img: img,
	imagelinks: imagelinks,
	csw: csw
	})
	
  .done(function( data ) {  
  
  $('#cms_button_check').spin(false);
  $('#cms_button_check i').css('opacity',1);
  
  if(data == 'OK'){ 
  notify(changes_saved, 3000);
  window.setTimeout(function(){ location.reload(true);}, 2500);
  
  $('.cms_button').hide();
  //$('#cms_button_edit, #cms_button_showsubmenu').show();
    
  } else {
  notify(data, 15000);
  }
  
});

} else {
  notify(demomode_save, 5000);
  $('#cms_button_check').spin(false);
  $('#cms_button_check i').css('opacity',1);
}

}

/* ------------------------------------------------------------------------------- */

function logout(){

$('body').append('<div class="cms_wait_overlay"></div>');
$('.cms_wait_overlay').css('height',$(window).height()).css('width',$(window).width()).fadeIn(300).spin(spinneroptions);

$.ajax({
  type: "POST",
  url: "cms/php/logout.php",
  success: function(response){ 
  //location.reload(true);
  var currentfile = document.URL.split('currentfile=')[1];
  window.location.href = 'cms.php?action=logout&currentfile='+currentfile;
  }
});
}

/* ------------------------------------------------------------------------------- */

function showsubmenu(){
$('.cms_button').hide();
$('#cms_button_edit, #cms_button_duplicatefile, #cms_button_deletefile, #cms_button_backups, #cms_button_uploads, #cms_button_edithtml, #cms_button_editcss, #cms_button_hidesubmenu').show(); }

function hidesubmenu(){
$('.cms_button').hide();
$('#cms_button_edit, #cms_button_showsubmenu').show(); 
}

/* ------------------------------------------------------------------------------- */

function duplicatefile(){

$('.cms_button').hide();

var currentfile = document.URL.split('currentfile=')[1];
var currentfilename = currentfile.split('.html')[0];

$('.cms_notifications').html('<div class="cms_prompt">'+new_filename+' <span id="targetfilename" contenteditable="true" style="font-weight:bold; border-bottom:1px dotted #666;">'+currentfilename+'</span>.html <span class="cms_prompt_error"></span><div class="cms_buttons"><div class="cms_button" id="duplicate_ok"><i class="fa fa-check"></i></div><div class="cms_button" id="duplicate_cancel"><i class="fa fa-times"></i></div></div></div>').children().first().slideDown(300);
$('#targetfilename').focus();


$('#targetfilename').keydown(function(e) {
if(e.keyCode == 13){e.preventDefault();}
});

$('#targetfilename').keyup(function() {
var input = $('#targetfilename').text();
if(/[^a-zA-Z0-9_-]/.test(input)) {
$('.cms_prompt_error').text(char_not_allowed);
$('#duplicate_ok').hide();
} else {
$('.cms_prompt_error').text('');
$('#duplicate_ok').show();
}

});

$('#duplicate_cancel').click(function () { 
$(this).parent().parent().slideUp(300).wait(300).remove(); 
$('#cms_button_edit, #cms_button_duplicatefile, #cms_button_deletefile, #cms_button_backups, #cms_button_uploads, #cms_button_edithtml, #cms_button_editcss, #cms_button_hidesubmenu').show(); });

$('#duplicate_ok').click(function () { 

if (demomode != 'on'){

$('#duplicate_ok i').css('opacity',0);
$('#duplicate_ok').spin(spinneroptions);

var targetfilename = $('#targetfilename').text();
var targetfile = targetfilename+'.html';

$.post( "cms/php/duplicatefile.php", { 
	currentfile: currentfile, 
	targetfile: targetfile,
	})
  .done(function( data ) {  
  
  $('#duplicate_ok').spin(false);
  $('#duplicate_ok i').css('opacity',1);
  
  if(data == 'fileexists'){ 
  $('.cms_prompt_error').text(filename_exists);
  
  } else if (data == 'failed'){ 
  $('.cms_prompt_error').text(duplicate_failed);

  } else if(data == 'OK'){ 
  $('.cms_prompt').slideUp(300).wait(300).remove(); 
  notify(duplicate_ok, 5000);
  $('body').append('<div class="cms_wait_overlay"></div>');
  $('.cms_wait_overlay').css('height',$(window).height()).css('width',$(window).width()).fadeIn(300).spin(spinneroptions);
  window.setTimeout(function(){ window.location.href = 'cms.php?currentfile='+targetfile;}, 5000);
    
  } else {
  notify(data, 15000);
  }
    
}); // END DONE

} else { notify(demomode_inactive, 10000); } 

}); // END CLICK

}

/* ------------------------------------------------------------------------------- */

function deletefile(){

$('.cms_button').hide();

var currentfile = document.URL.split('currentfile=')[1];

$('.cms_notifications').html('<div class="cms_prompt"><span class="cms_prompt_red"><i class="fa fa-exclamation-triangle"></i> '+really_delete+'</span><div class="cms_buttons"><div class="cms_button" id="delete_ok"><i class="fa fa-check"></i></div><div class="cms_button" id="delete_cancel"><i class="fa fa-times"></i></div></div></div>').children().first().slideDown(300);

$('#delete_cancel').click(function () { 
$(this).parent().parent().slideUp(300).wait(300).remove(); 
$('#cms_button_edit, #cms_button_duplicatefile, #cms_button_deletefile, #cms_button_backups, #cms_button_uploads, #cms_button_edithtml, #cms_button_editcss, #cms_button_hidesubmenu').show(); });

$('#delete_ok').click(function () { 

if (demomode != 'on'){

$('#delete_ok i').css('opacity',0);
$('#delete_ok').spin(spinneroptions);

$.post("cms/php/deletefile.php", { 
	currentfile: currentfile
	})
  .done(function( data ) {  
  
  $('#delete_ok').spin(false);
  $('#delete_ok i').css('opacity',1);
  
  if(data == 'OK'){ 
  
  $('.cms_prompt').slideUp(300).wait(300).remove(); 
  notify(file_deleted, 8000);
  $('body').append('<div class="cms_wait_overlay"></div>');
  $('.cms_wait_overlay').css('height',$(window).height()).css('width',$(window).width()).fadeIn(300).spin(spinneroptions);
  window.setTimeout(function(){ window.location.href = 'cms.php?currentfile=index.html';}, 8000);
    
  } else {
  notify(data, 15000);
  }
    
}); // END DONE

} else { notify(demomode_inactive, 10000); } 

}); // END CLICK

}

/* ------------------------------------------------------------------------------- */

var deletefilecounter = 0;

function inituploadsdeletion(){
$('.cms_uploads_list .delete, .cms_uploads_list .cancel').hover(
function() { $(this).parent().parent().find('a').addClass('ccc'); },
function() { $(this).parent().parent().find('a').removeClass('ccc'); }
);

$('.cms_uploads_list .ok').hover(
function() { $(this).parent().parent().find('a').addClass('f00'); },
function() { $(this).parent().parent().find('a').removeClass('f00'); }
);

$('.cms_uploads_list .delete').click(function(){
$(this).parent().find('.ok, .cancel').show();
$(this).parent().find('.delete').hide();
if (deletefilecounter < 1){ notify(warning_delete_uploaded_file, 20000); }
deletefilecounter++;
});

$('.cms_uploads_list .cancel').click(function(){
$(this).parent().find('.ok, .cancel').hide();
$(this).parent().find('.delete').show();
});

$('.cms_uploads_list .ok').click(function(){
$(this).parent().parent().slideUp(300);
var currentfiledelete = $(this).parent().parent().find('a').attr('href');

$.post("cms/php/deletefile.php", { currentfile: currentfiledelete })
.done(function( data ) {  if(data != 'OK'){ notify(data, 15000); }
}); // END DONE
});
}


function showuploads(){
$('.cms_button').hide(); 
$('.cms_buttons').prepend('<div class="cms_button" id="cms_button_cancelupload" data-toggle="tooltip" title="abbrechen"><i class="fa fa-times"></i></div>');
$('#cms_button_cancelupload').click(function () { 
$(this).hide();
$('.cms_uploads_overlay').remove();
$('#cms_button_edit, #cms_button_duplicatefile, #cms_button_deletefile, #cms_button_backups, #cms_button_uploads, #cms_button_edithtml, #cms_button_editcss, #cms_button_hidesubmenu').show(); });

if (tooltips == 'yes') { $('#cms_button_cancelupload').tooltip({ placement:'bottom',delay: {show: 0, hide: 0 }}); 
} else { $('#cms_button_cancelupload').tooltip({ title:''}); }

$('body').append('<div class="cms_uploads_overlay"><div class="cms_button_add_file"><i class="fa fa-cloud-upload"></i> Datei hochladen</div><input type="file" name="newfile" id="cms_upload_new_file" multiple><div class="cms_uploads_list"></div></div>');
$('.cms_uploads_overlay').fadeIn(300);
$('.cms_uploads_overlay').spin(spinneroptions);

$('.cms_uploads_list').load('cms/php/listuploadedfiles.php', function(){	

$('.cms_uploads_overlay').spin(false);
inituploadsdeletion();

//jQuery.event.props.push('dataTransfer');

$('.cms_uploads_overlay').on("dragover", function(e) {
e.preventDefault();  
e.stopPropagation();
$(this).addClass('dragging');
});

$('.cms_uploads_overlay').on("dragleave", function(e) {
e.preventDefault();  
e.stopPropagation();
$(this).removeClass('dragging');
});

$('.cms_uploads_overlay').on("drop", function(e) {
e.preventDefault();  
e.stopPropagation();


if (e.originalEvent.dataTransfer.files.length > 10) { 

notify(to_many_files,5000); 
$(this).removeClass('dragging');

} else {

for (var i = 0; i < e.originalEvent.dataTransfer.files.length; i++)
{

var file = e.originalEvent.dataTransfer.files[i];
maxfilesize = parseInt(maxfilesize);
currentfilesize = file.size/1024/1024;
filename = file.name;
filetype = filename.substr(-4);
filetype = filetype.toLowerCase();

if (currentfilesize > maxfilesize){ 

notify(file_to_big,5000); 
$(this).removeClass('dragging');

} else if (filetype != '.jpg' && filetype != '.png' && filetype != '.gif' && filetype != '.pdf' && filetype != '.zip' && filetype != '.doc' && filetype != 'docx' && filetype != 'jpeg' && filetype != '.mp3'){
	
notify(wrong_filetype,5000); 
$(this).removeClass('dragging');

} else {

// ROCK N ROLL!

$('.cms_uploads_list').html('').css('min-height',$(window).height()-150+'px').spin(spinneroptions);

var data = new FormData();
data.append('newfile', file);
data.append('authorization', 'OK');

$.ajax({
url: 'cms/php/uploadfile.php',
data: data,
type: 'POST',
processData: false,
contentType: false,
success: function(response) { 

if (response == 'notuploaded') {

notify(check_upload_dir,15000);
$('.cms_uploads_list').spin(false);
$('.cms_uploads_overlay').removeClass('dragging');
$('.cms_uploads_list').load('cms/php/listuploadedfiles.php', function(){inituploadsdeletion();});

} else {

$('.cms_uploads_list').spin(false);
$('.cms_uploads_overlay').removeClass('dragging'); 
$('.cms_uploads_list').load('cms/php/listuploadedfiles.php', function(){inituploadsdeletion();});

notify(file_upload_ok,5000);

// DELETE DEMO IMAGES
if (demomode == 'on'){
setTimeout(function () { $.ajax({ type: "POST", url: "cms/php/deletedemoimages.php", data: "authorization=OK" }); }, 1000); 
}

} // END ELSE
} // END SUCCESS
}); // END AJAX
} // END ROCK N ROLL

} // END FOR I
} // END MORE THAN 10

}); // END DROP


// CLICK FALLBACK

$('.cms_button_add_file').click(function(){ $('#cms_upload_new_file').trigger('click'); });

$('#cms_upload_new_file').change(function(e) { 

if (this.files.length > 10) { 

notify(to_many_files,5000); 
$(this).removeClass('dragging');

} else {

for (var i = 0; i < this.files.length; i++)
{

var file = this.files[i];
maxfilesize = parseInt(maxfilesize);
currentfilesize = file.size/1024/1024;
filename = file.name;
filetype = filename.substr(-4);
filetype = filetype.toLowerCase();

if (currentfilesize > maxfilesize){ 

notify(file_to_big,5000); 

} else if (filetype != '.jpg' && filetype != '.png' && filetype != '.gif' && filetype != '.pdf' && filetype != '.zip' && filetype != '.doc' && filetype != 'docx' && filetype != '.mp3'){
	
notify(wrong_filetype,5000); 

} else {

// ROCK N ROLL!

$('.cms_uploads_list').html('').css('min-height',$(window).height()-200+'px').spin(spinneroptions);

var data = new FormData();
data.append('newfile', file);
data.append('authorization', 'OK');

$.ajax({
url: 'cms/php/uploadfile.php',
data: data,
type: 'POST',
processData: false,
contentType: false,
success: function(response) { 

if (response == 'notuploaded') {

notify(check_upload_dir,15000);
$('.cms_uploads_list').spin(false);
$('.cms_uploads_list').load('cms/php/listuploadedfiles.php', function(){inituploadsdeletion();});

} else {

$('.cms_uploads_list').spin(false);
$('.cms_uploads_list').load('cms/php/listuploadedfiles.php', function(){inituploadsdeletion();});

notify(file_upload_ok,5000);

// DELETE DEMO IMAGES
if (demomode == 'on'){
setTimeout(function () { $.ajax({ type: "POST", url: "cms/php/deletedemoimages.php", data: "authorization=OK" }); }, 1000); 
}

} // END ELSE
} // END SUCCESS
}); // END AJAX
} // END ROCK N ROLL
} // END FOR I
} // END MORE THAN 10
}); // END CHANGE FALLBACK	
});

}

/* ------------------------------------------------------------------------------- */

/*

function editmenu(){
$('.cms_button').hide(); 
$('.cms_buttons').prepend('<div class="cms_button" id="cms_button_cancelmenuediting" data-toggle="tooltip" title="abbrechen"><i class="fa fa-times"></i></div>');
$('#cms_button_cancelmenuediting').click(function () { 
$(this).hide();
$('.cms_editmenu_overlay').remove();
$('#cms_button_edit, #cms_button_duplicatefile, #cms_button_deletefile, #cms_button_backups, #cms_button_uploads, #cms_button_edithtml, #cms_button_hidesubmenu').show(); });

if (tooltips == 'yes') { $('#cms_button_cancelmenuediting').tooltip({ placement:'bottom',delay: {show: 0, hide: 0 }}); 
} else { $('#cms_button_cancelmenuediting').tooltip({ title:''}); }

$('body').append('<div class="cms_editmenu_overlay"><div class="cms_menuitems_list"></div></div>');
$('.cms_editmenu_overlay').fadeIn(300);

$('.cms_menuitems_list').on('load', 'cms/php/listmenuitems.php', function(){ 
$('.cms_menuitems_list').append('<div class="cms_button_add_menu_item"><i class="fa fa-plus-square"></i> Menüpunkt hinzufügen</div>');
$('.cms_menuitems li a').click(function(e){ e.preventDefault(); });
$('.cms_menuitems .handle')
.mouseenter(function(){$('.cms_menuitems').sortable({ handle: '.handle' });})
.mouseleave(function(){$('.cms_menuitems').sortable('destroy');});
$('.cms_menuitem_title').attr('contenteditable','true');
$('.cms_menuitem_title').keypress(function(e) {  if ( e.which == 13 ) { e.preventDefault(); } });

$('.cms_button_delete_menu_item').click(function(){ $(this).parent().slideUp(300, function(){$(this).remove(); }); });

});
}

$('#cms_button_editmenu').click(function (e) { editmenu(); });

*/

/* ------------------------------------------------------------------------------- */

function showbackups(){
$('.cms_button').hide(); 
$('.cms_buttons').prepend('<div class="cms_button" id="cms_button_cancelrestorebackup" data-toggle="tooltip" title="abbrechen"><i class="fa fa-times"></i></div>');
$('#cms_button_cancelrestorebackup').click(function () { 
$(this).hide();
$('.cms_backups_overlay').remove();
$('#cms_button_edit, #cms_button_duplicatefile, #cms_button_deletefile, #cms_button_backups, #cms_button_uploads, #cms_button_edithtml, #cms_button_editcss, #cms_button_hidesubmenu').show(); });

if (tooltips == 'yes') { $('#cms_button_cancelrestorebackup').tooltip({ placement:'bottom',delay: {show: 0, hide: 0 }}); 
} else { $('#cms_button_cancelrestorebackup').tooltip({ title:''}); }

$('body').append('<div class="cms_backups_overlay"><div class="cms_backups_list"></div></div>');
$('.cms_backups_overlay').fadeIn(300);
$('.cms_backups_overlay').spin(spinneroptions);

var currentfile = document.URL.split('currentfile=')[1];
currentfile = currentfile.split('#')[0];

$.post("cms/php/listbackupfiles.php", { currentfile: currentfile })
.done(function( data ) {  
$('.cms_backups_overlay').spin(false);
$('.cms_backups_list').html(data);
});

}

function restorebackup(){

$('.cms_button').hide();

$('.cms_notifications').html('<div class="cms_prompt">Soll diese Version der Seite wiederhergestellt werden?<div class="cms_buttons"><div class="cms_button" id="restorebackup_ok"><i class="fa fa-check"></i></div><div class="cms_button" id="restorebackup_cancel"><i class="fa fa-times"></i></div></div></div>').children().first().slideDown(300);

$('#restorebackup_cancel').click(function(){
$('.cms_prompt').slideUp(200);
$('body').append('<div class="cms_wait_overlay"></div>');
var currentfile = document.URL.split('currentfile=')[1];
$('.cms_wait_overlay').fadeIn(300, function(){ window.location.href = 'cms.php?currentfile='+currentfile;}).spin(spinneroptions);
});

$('#restorebackup_ok').click(function(){
var currentfile = document.URL.split('currentfile=')[1];

if (demomode != 'on'){

$('#restorebackup_ok i').css('opacity',0);
$('#restorebackup_ok').spin(spinneroptions);

var backupfile = document.URL.split('backupfile=')[1];
var backupfile = backupfile.split('&currentfile=')[0];

$.post( "cms/php/restorebackupfile.php", { targetfile: currentfile, backupfile: backupfile,})
.done(function( data ) {  
$('#restorebackup_ok').spin(false);
$('#restorebackup_ok i').css('opacity',1);
  
if (data == 'failed'){ 
$('.cms_prompt_error').text(restorebackup_failed);

} else if(data == 'OK'){ 
$('.cms_prompt').slideUp(300).wait(300).remove(); 
notify(restorebackup_ok, 5000);
$('body').append('<div class="cms_wait_overlay"></div>');
$('.cms_wait_overlay').fadeIn(300).spin(spinneroptions);
window.setTimeout(function(){ window.location.href = 'cms.php?currentfile='+currentfile;}, 5000);
    
} else {
notify(data, 15000);
}
    
}); // END DONE

} else { notify(demomode_inactive, 10000); } 

}); // END CLICK

}

/* ------------------------------------------------------------------------------- */

function resizeTextarea() {
var windowHeight = $(window).height()-90;
$(".cms_textarea").height(windowHeight);
}

/* ------------------------------------------------------------------------------- */

function edithtml(){

$('body').children().not('.cms_toolbar, .cms_textarea, .cms_notifications').fadeOut(300);
$('body').append('<textarea class="cms_textarea" spellcheck="false"></textarea>');
var currentfile = document.URL.split('currentfile=')[1];
$.get(currentfile, null, function (data) { $(".cms_textarea").val(data); }, "text");
resizeTextarea();
$(window).bind("resize", resizeTextarea);
$('.cms_textarea').fadeIn(300, function(){$('html').css('margin-top','0');});

$('.cms_button').hide(); 

$('.cms_buttons').prepend('<div class="cms_button" id="cms_button_savehtml" data-toggle="tooltip" title="speichern"><i class="fa fa-check"></i></div><div class="cms_button" id="cms_button_canceledithtml" data-toggle="tooltip" title="abbrechen"><i class="fa fa-times"></i></div>');

$('#cms_button_canceledithtml').click(function () { 
$('.cms_button').hide(); 
$('body').append('<div class="cms_wait_overlay"></div>');
$('.cms_wait_overlay').css('height',$(window).height()).css('width',$(window).width()).fadeIn(300).spin(spinneroptions);
location.reload();
});

$('#cms_button_savehtml').click(function () { 
 
$('#cms_button_savehtml i').css('opacity',0);
$('#cms_button_savehtml').spin(spinneroptions);

if (demomode != 'on'){

$('body').append('<div class="cms_wait_overlay"></div>');
$('.cms_wait_overlay').css('height',$(window).height()).css('width',$(window).width()).fadeIn(300).spin(spinneroptions);

var currentfile = document.URL.split('currentfile=')[1];
currentfile = currentfile.split('#')[0];
var content = $('.cms_textarea').val();

$.post('cms/php/savehtml.php', { 
currentfile: currentfile, 
content: content
})
.done(function( data ) {  
  
$('#cms_button_savehtml').spin(false);
$('#cms_button_savehtml i').css('opacity',1);
  
if(data == 'OK'){ 
notify(changes_saved, 3000);
window.setTimeout(function(){ location.reload(true);}, 2500);
  
$('.cms_button').hide();
    
} else {
notify(data, 15000);
}
  
});

} else {
notify(demomode_save, 5000);
$('#cms_button_savehtml').spin(false);
$('#cms_button_savehtml i').css('opacity',1);
}

});

if (tooltips == 'yes') { 
$('#cms_button_savehtml').tooltip({ placement:'bottom',delay: {show: 0, hide: 0 }}); 
$('#cms_button_canceledithtml').tooltip({ placement:'bottom',delay: {show: 0, hide: 0 }}); 
} else { 
$('#cms_button_savehtml').tooltip({ title:''}); 
$('#cms_button_canceledithtml').tooltip({ title:''}); 
}

$(window).bind('keydown', function(event) {
if (event.ctrlKey || event.metaKey) {
switch (String.fromCharCode(event.which).toLowerCase()) {
case 's':
event.preventDefault();
$('#cms_button_savehtml').trigger('click');
break;
}}});

}

/* ------------------------------------------------------------------------------- */

function editcss(){

$('body').children().not('.cms_toolbar, .cms_textarea, .cms_notifications').fadeOut(300);
$('body').append('<textarea class="cms_textarea" spellcheck="false"></textarea>');
 
$.get(cssfile, null, function (data) { $(".cms_textarea").val(data); }, "text");
resizeTextarea();
$(window).bind("resize", resizeTextarea);
$('.cms_textarea').fadeIn(300, function(){$('html').css('margin-top','0');});

$('.cms_button').hide(); 

$('.cms_buttons').prepend('<div class="cms_button" id="cms_button_savecss" data-toggle="tooltip" title="speichern"><i class="fa fa-check"></i></div><div class="cms_button" id="cms_button_canceleditcss" data-toggle="tooltip" title="abbrechen"><i class="fa fa-times"></i></div>');

$('#cms_button_canceleditcss').click(function () { 
$('.cms_button').hide(); 
$('body').append('<div class="cms_wait_overlay"></div>');
$('.cms_wait_overlay').css('height',$(window).height()).css('width',$(window).width()).fadeIn(300).spin(spinneroptions);
location.reload();
});

$('#cms_button_savecss').click(function () { 
 
$('#cms_button_savecss i').css('opacity',0);
$('#cms_button_savecss').spin(spinneroptions);

if (demomode != 'on'){

$('body').append('<div class="cms_wait_overlay"></div>');
$('.cms_wait_overlay').css('height',$(window).height()).css('width',$(window).width()).fadeIn(300).spin(spinneroptions);

var content = $('.cms_textarea').val();

$.post('cms/php/savecss.php', { 
cssfile: cssfile, 
content: content
})
.done(function( data ) {  
  
$('#cms_button_savecss').spin(false);
$('#cms_button_savecss i').css('opacity',1);
  
if(data == 'OK'){ 
notify(changes_saved, 3000);
window.setTimeout(function(){ location.reload(true);}, 2500);
  
$('.cms_button').hide();
    
} else if(data == 'cssfiledoesnotexist'){
notify(css_file_does_not_exists, 15000);

} else {
notify(data, 15000);
}
  
  
});

} else {
notify(demomode_save, 5000);
$('#cms_button_savecss').spin(false);
$('#cms_button_savecss i').css('opacity',1);
}

});

if (tooltips == 'yes') { 
$('#cms_button_savecss').tooltip({ placement:'bottom',delay: {show: 0, hide: 0 }}); 
$('#cms_button_canceleditcss').tooltip({ placement:'bottom',delay: {show: 0, hide: 0 }}); 
} else { 
$('#cms_button_savecss').tooltip({ title:''}); 
$('#cms_button_canceleditcss').tooltip({ title:''}); 
}

$(window).bind('keydown', function(event) {
if (event.ctrlKey || event.metaKey) {
switch (String.fromCharCode(event.which).toLowerCase()) {
case 's':
event.preventDefault();
$('#cms_button_savecss').trigger('click');
break;
}}});

}

/* ------------------------------------------------------------------------------- */

var spinneroptions = {lines: 10, length: 4, width: 3, radius: 6, color: '#666', speed: 1, trail: 60, shadow: false };

/* ------------------------------------------------------------------------------- */

$(document).ready(function() {
	
addLinkListener();
$('#cms_button_edit').click(function (e) { edit(); });
$('#cms_button_check').click(function (e) { save(); });
$('#cms_button_cancel').click(function (e) { cancel(); });
$('#cms_button_duplicatefile').click(function (e) { duplicatefile(); });
$('#cms_button_deletefile').click(function (e) { deletefile(); });
$('#cms_button_uploads').click(function (e) { showuploads(); });
$('#cms_button_backups').click(function (e) { showbackups(); });
$('#cms_button_edithtml').click(function (e) { edithtml(); });
$('#cms_button_editcss').click(function (e) { editcss(); });
$('#cms_button_showsubmenu').click(function (e) { showsubmenu(); });
$('#cms_button_hidesubmenu').click(function (e) { hidesubmenu(); });
$('#cms_button_logout').click(function (e) { logout(); });
$('.cms_button_hide_notification').click(function () { $(this).parent().slideUp(100);  });

countdowntimer = setInterval(function() { countdown(timeout); }, 1000);	

$('body').on("dragover", function(e) { e.preventDefault(); e.stopPropagation(); });
$('body').on("drop", function(e) { e.preventDefault(); e.stopPropagation(); });

var currentfile = document.URL.split('currentfile=')[1];
if (currentfile == 'index.html') {$('#cms_button_deletefile').remove();}

if (!window.FileReader) {
notify(browser_not_supported,100000);
$('.cms_button').remove();
}

if (tooltips == 'yes') { $('.cms_button,.cms_button_logout').tooltip({ placement:'bottom',delay: {show: 0, hide: 0 }}); 
} else { $('.cms_button,.cms_button_logout').tooltip({ title:''}); }

$.ajaxSetup({ cache: false });

$('.cms_donotclickoverlay').hide();

$('body').addClass('cms');
  
});

/* ------------------------------------------------------------------------------- */

$(window).bind('keydown', function(event) {
if (event.ctrlKey || event.metaKey) {
switch (String.fromCharCode(event.which).toLowerCase()) {
case 'i':
event.preventDefault();
if ($('#cms_button_edit').is(':visible')){ edithtml(); }
break;
//case 'e':
//event.preventDefault();
//if ($('#cms_button_edit').is(':visible')){ edit(); }
//break;
}
}
});


/* ========================================================================
 * Bootstrap: tooltip.js v3.0.3
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);



