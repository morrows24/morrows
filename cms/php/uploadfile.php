<?php

session_start();
date_default_timezone_set('Europe/Berlin');
if ($_SESSION["authorization"] == 'OK') {

include '../settings.php';

function renameFilename($filename){
$search = array("/<[a-zA-Z]+[^>]+alt(\s*)=\s*[\"']([^\"']*)[\"'[^>]*>/U", "/ä/", "/ö/", "/ü/", "/Ä/", "/Ö/", "/Ü/", "/ß/", "/ /");
$replace = array("\\2", "ae", "oe", "ue", "Ae", "Oe", "Ue", "ss", "-");
return $filename = preg_replace($search,$replace,$filename);

}

//$timestamp = time();
$timestamp = date('Y-m-d-H-i-s-').substr((string)microtime(), 2, 2);
$uploaddir = '../../'.$uploaddir;

if (!is_writeable($uploaddir)) {
echo 'notuploaded';
exit();	
}

if(!file_exists($uploaddir)) { mkdir($uploaddir, 0755); };

if ($_FILES['newfile']['name']) {
$filename = $_FILES['newfile']['name'];
} else { $filename = 'xxx.jpg'; }

$filename = $_FILES['newfile']['name'];

$filename = renameFilename($filename);

//$filename = str_replace(array("ä","ö","ü","Ä","Ö","Ü","ß"," "), 
//array("ae","oe","ue","Ae","Oe","Ue","ss","-"), $filename);

if(file_exists($uploaddir.''.$filename)) { 

$dotpos = strrpos($filename, '.'); 
$filebasename = substr($filename, 0, $dotpos);  
$fileextension = strtolower(strrchr($filename, '.'));
$filename = $filebasename.'-'.$timestamp.''.$fileextension;
};

move_uploaded_file($_FILES['newfile']['tmp_name'], $uploaddir."".$filename);

} // END IF AUTHORIZATION

?>