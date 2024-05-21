<?php

session_start();
if ($_SESSION["authorization"] == 'OK' && $_POST["authorization"] == 'OK') {

function renameFilename($filename){
$search = array("/<[a-zA-Z]+[^>]+alt(\s*)=\s*[\"']([^\"']*)[\"'[^>]*>/U", "/ä/", "/ö/", "/ü/", "/Ä/", "/Ö/", "/Ü/", "/ß/", "/ /");
$replace = array("\\2", "ae", "oe", "ue", "Ae", "Oe", "Ue", "ss", "-");
return $filename = preg_replace($search, $replace, $filename);
}

$type = $_POST["type"];
$option = $_POST["option"];

include '../settings.php';
include("resize_class.php");

$timestamp = date('Y-m-d-H-i-s-').substr((string)microtime(), 2, 2);
$uploaddir = '../../'.$uploaddir;

if (!is_writeable($uploaddir)) {
echo 'notuploaded';
exit();	
}

if(!file_exists($uploaddir)) { mkdir($uploaddir, 0755); };

// UPLOAD SINGLE IMAGE -----------------------------------------------------------

if ($type == 'single_image') {

if ($_POST['imgdatatype'] == 'canvas') { $filename = $_POST['originalfilename'];
} else { $filename = $_FILES['imgdata']['name']; }

$filename = str_replace(array('.JPG', '.jpeg', '.JPEG'), array('.jpg', '.jpg', '.jpg'), $filename);
$filename = renameFilename($filename);

$dotpos = strrpos($filename, '.'); 
$filebasename = substr($filename, 0, $dotpos);  
$fileextension = strtolower(strrchr($filename, '.'));

if(file_exists($uploaddir.''.$filename) ||  $fileextension == '.pdf') { 
$filename = $filebasename.'-'.$timestamp.''.$fileextension;
};

// CANVAS
if ($_POST['imgdatatype'] == 'canvas') { 
$imgdata = substr($_POST['imgdata'], strpos($_POST['imgdata'], ",") + 1);
$decodedcanvasimgdata = base64_decode($imgdata);
$fp = fopen($uploaddir."".$filename, 'w');
fwrite($fp, $decodedcanvasimgdata);
fclose($fp);

} else {
// FILE
move_uploaded_file($_FILES['imgdata']['tmp_name'], $uploaddir."".$filename);
}

// PDF 

if ($fileextension == '.pdf'){
$dotpos = strrpos($filename, '.'); 
$filebasename = substr($filename, 0, $dotpos);  
$fileextension = strtolower(strrchr($filename, '.'));
$pdf = $uploaddir.''.$filename;
$jpg = $uploaddir.''.$filebasename.'.jpg';

if (extension_loaded('imagick')){
	
$imagick = new Imagick(); 
$imagick->readImage($pdf.'[0]'); 
$imagick->writeImage($jpg); 

} else {
	
exec('convert -density 300 -colorspace RGB "'.$pdf.'[0]" -resize 1000 -quality 95 "'.$jpg.'"', $output, $return_var);

}

$filename = $filebasename.'.jpg';
}


$resource = $uploaddir."".$filename;

// CHECK IF FILE IS JPG, PNG OR GIF 
$imgproperties = getimagesize ($resource);
$filetype = $imgproperties[2];

if ($filetype != 1 && $filetype != 2 && $filetype != 3) {	
echo 'wrong_img_filetype';
exit();	
}

$target_w = $_POST['imgwidth'];
$target_h = $_POST['imgheight'];

$currentimg = new resize($resource); 

if ( $option == 'fixed_width'){$currentimg -> resizeImage($target_w, 3000, 'landscape'); }
else if ( $option == 'fixed_height'){$currentimg -> resizeImage(3000, $target_h, 'portrait'); }
else { $currentimg -> resizeImage($target_w, $target_h, 'crop'); }

$currentimg -> saveImage($resource, 98);

echo $filename;

} // END SINGLE IMAGE -----------------------------------------------------------




// UPLOAD THUMB AND BIG -----------------------------------------------------------

if ($type == 'thumb_and_big_image') {

if ($_POST['imgdatatype'] == 'canvas') { $filename = $_POST['originalfilename']; 
} else { $filename = $_FILES['imgdata']['name']; }

//$filename = str_replace(array("ä","ö","ü","Ä","Ö","Ü","ß"," "), 
//array("ae","oe","ue","Ae","Oe","Ue","ss","-"), $filename);

$filename = str_replace(array('.JPG', '.jpeg', '.JPEG'), array('.jpg', '.jpg', '.jpg'), $filename);
$filename = renameFilename($filename);

$dotpos = strrpos($filename, '.'); 
$filebasename = substr($filename, 0, $dotpos);  
$fileextension = strtolower(strrchr($filename, '.'));

// BIG IMG

if(file_exists($uploaddir.''.$filename)) { 
$filename = $filebasename.'-'.$timestamp.''.$fileextension;
};

// THUMB 

$filenamethumb = $filebasename.'-thumb'.$fileextension;

if(file_exists($uploaddir.''.$filenamethumb)) { 
$filenamethumb = $filebasename.'-'.$timestamp.'-thumb'.$fileextension;
}

// CANVAS
if ($_POST['imgdatatype'] == 'canvas') { 
$imgdata = substr($_POST['imgdata'], strpos($_POST['imgdata'], ",") + 1);
$decodedcanvasimgdata = base64_decode($imgdata);
$fp = fopen($uploaddir."".$filename, 'w');
fwrite($fp, $decodedcanvasimgdata);
fclose($fp);

} else {
// FILE
move_uploaded_file($_FILES['imgdata']['tmp_name'], $uploaddir."".$filename);
}

// PDF 

if ($fileextension == '.pdf'){
$pdf = $uploaddir.''.$filename;
$jpg = $uploaddir.''.$filebasename.'.jpg';

if(file_exists($uploaddir.''.$filebasename.'.jpg')) { 
$jpg = $uploaddir.''.$filebasename.'-'.$timestamp.'.jpg';
$filename = $filebasename.'-'.$timestamp.'.jpg';
$filenamethumb = $filebasename.'-'.$timestamp.'-thumb.jpg';
} else {
$filename = $filebasename.'.jpg';
$filenamethumb = $filebasename.'-thumb.jpg';
}

exec('convert -density 300 -colorspace RGB "'.$pdf.'[0]" -resize 1200 -quality 95 "'.$jpg.'"', $output, $return_var);

}


$resource = $uploaddir."".$filename;

// CHECK IF FILE IS JPG, PNG OR GIF
$imgproperties = getimagesize ($resource);
$filetype = $imgproperties[2];

if ($filetype != 1 && $filetype != 2 && $filetype != 3) {	
echo 'wrong_img_filetype';
exit();	
}

$thumb_w = $_POST['imgwidth'];
$thumb_h = $_POST['imgheight'];

if (!$bigimgwidth) { $bigimgwidth = 1000; }

$big_w = $bigimgwidth;
$big_h = $bigimgwidth;

$currentbigimage = new resize($resource);
$currentbigimage -> resizeImage($big_w, $big_h, 'auto');

$currentthumb = new resize($resource); 
if ($option == 'crop'){ $currentthumb -> resizeImage($thumb_w, $thumb_h, 'crop');}
if ($option == 'fixed_width'){$currentthumb -> resizeImage($thumb_w, 3000, 'landscape');}
if ($option == 'fixed_height'){$currentthumb -> resizeImage(3000, $thumb_h, 'portrait');}

$currentbigimage -> saveImage($uploaddir."".$filename, 98);
$currentthumb -> saveImage($uploaddir."".$filenamethumb, 98);

echo $filenamethumb;

} // END UPLOAD THUMB AND BIG -----------------------------------------------------------

} // END IF AUTHORIZATION

?>