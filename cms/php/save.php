<?php

session_start();

date_default_timezone_set('Europe/Berlin');
if ($_SESSION["authorization"] == 'OK') {

$currentfile = $_POST["currentfile"];
if(!$currentfile){exit();}

include '../settings.php';
if ($demomode == 'on'){exit();}

// CREATE A BACKUP
$timestamp = date('Y-m-d-H-i-s-').substr((string)microtime(), 2, 2);
$backupfile = '../../backup/'.$timestamp.'-'.$currentfile;
copy('../../'.$currentfile, $backupfile); 

include 'ganon.php';

// PHP 8 Update
if (defined('PHP_MAJOR_VERSION') && PHP_MAJOR_VERSION <= 7) 
{
    if (get_magic_quotes_gpc()) {
        $pagetitle = strip_tags(stripslashes($_POST["pagetitle"]));
        $csw = stripslashes($_POST["csw"]);
        $content = stripslashes($_POST["content"]);
        $img = stripslashes($_POST["img"]);
        $imagelinks = stripslashes($_POST["imagelinks"]);
        
        } else {
        
        $pagetitle = strip_tags($_POST["pagetitle"]);
        $csw = $_POST["csw"];
        $content = $_POST["content"];
        $img = $_POST["img"];
        $imagelinks = $_POST["imagelinks"];
        }
} 
else 
{
    $pagetitle = strip_tags($_POST["pagetitle"]);
    $csw = $_POST["csw"];
    $content = $_POST["content"];
    $img = $_POST["img"];
    $imagelinks = $_POST["imagelinks"];
}

$currentfile = '../../'.$currentfile;
$targetfilecontent = file_get_dom($currentfile);

// TITLE
if (count($targetfilecontent('title')) > 0){
$targetfilecontent('title', 0)->setInnerText($pagetitle);
}

// DEBUG HERE ---------------------------------------------
//CONTENT SECTION WRAPS
$cs=0;
$csw = str_replace("*CLOSEBRACKET*", ">", $csw);
$csw = json_decode($csw);
foreach($csw as $cswvalue){
$targetfilecontent('.content_section_wrap', $cs)->setInnerText($cswvalue);
$cs++;
}

if($cs > 0){
$targetfile = fopen($currentfile,"w");
rewind($targetfile);
fwrite($targetfile, $targetfilecontent);
fclose($targetfile);
$targetfilecontent = file_get_dom($currentfile);
}

//CONTENT
$c=0;
$content = json_decode($content);
foreach($content as $contentvalue){

$targetfilecontent('.editable, .editable_line', $c)->setInnerText($contentvalue);
$c++;
}

//IMAGES
$i=0;
$img = json_decode($img);
foreach($img as $imgvalue){

$targetfilecontent('img.editable_image', $i)->setAttribute('src', $imgvalue);

//thumb_and_big_image
$datatype = 'data-type';
$currentdatatype = $targetfilecontent('img.editable_image', $i)->$datatype;

if ($currentdatatype == 'thumb_and_big_image'){
$bigimage = str_replace("-thumb", "", $imgvalue);

$currentbigimghref = $targetfilecontent('img.editable_image', $i)->parent->href;

if ($currentbigimghref){ 
$targetfilecontent('img.editable_image', $i)->parent->setAttribute('href', $bigimage); 

} else {
	
$targetfilecontent('img.editable_image', $i)->wrap('a');
$targetfilecontent('img.editable_image', $i)->parent->setAttribute('href', $bigimage);

}
}

$i++;
}

//IMAGELINKS //BETA 20151026
$i=0;
$imagelinks = json_decode($imagelinks);
foreach($imagelinks as $imagelinkvalue){
	
$targetfilecontent('.editable_image_link', $i)->setAttribute('href', $imagelinkvalue);

$i++;
}

$targetfile = fopen($currentfile,"w");
rewind($targetfile);
fwrite($targetfile, $targetfilecontent);
fclose($targetfile);

echo 'OK';

}

?>