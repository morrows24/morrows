<?php
session_start();
date_default_timezone_set('Europe/Berlin');
if ($_SESSION["authorization"] == 'OK') {

$cssfile = $_POST["cssfile"];
if(!$cssfile){
echo 'cssfiledoesnotexist';
exit();
}

if(!file_exists('../../'.$cssfile)) { 
echo 'cssfiledoesnotexist';
exit();	
}

include '../settings.php';
if ($demomode == 'on'){exit();}

// CREATE A BACKUP
$timestamp = date('Y-m-d-H-i-s-').substr((string)microtime(), 2, 2);
//$backupfile = str_replace(".css", "-".$timestamp.".css", $cssfile);
$backupfile = '../../backup/'.$timestamp.'.css';
copy('../../'.$cssfile, $backupfile); 

if (defined('PHP_MAJOR_VERSION') && PHP_MAJOR_VERSION <= 7) 
{
    if (get_magic_quotes_gpc()) {
    $content = stripslashes($_POST["content"]);
    } else {
    $content = $_POST["content"];
    } 
} else {
    $content = $_POST["content"];
} 

$cssfile = '../../'.$cssfile;

$targetfile = fopen($cssfile,"w");
rewind($targetfile);
fwrite($targetfile, $content);
fclose($targetfile);

echo 'OK';

}

?>