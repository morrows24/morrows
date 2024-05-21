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

$currentfile = '../../'.$currentfile;

$targetfile = fopen($currentfile,"w");
rewind($targetfile);
fwrite($targetfile, $content);
fclose($targetfile);

echo 'OK';

}

?>