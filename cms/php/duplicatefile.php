<?php
session_start();
if ($_SESSION["authorization"] == 'OK') {

$currentfile = $_POST["currentfile"];
$targetfile = $_POST["targetfile"];

if(!$currentfile){exit();}

include '../settings.php';
if ($demomode == 'on'){exit();}

$currentfile = '../../'.$currentfile;
$targetfile = '../../'.$targetfile;

if(file_exists($targetfile)) { 
echo 'fileexists';
exit();
}

if (!copy($currentfile, $targetfile)) {
echo 'failed';
} else {
echo 'OK';
}

}
?>