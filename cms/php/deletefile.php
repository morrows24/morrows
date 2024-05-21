<?php
session_start();
if ($_SESSION["authorization"] == 'OK') {

$currentfile = $_POST["currentfile"];
if(!$currentfile){exit();}

include '../settings.php';
if ($demomode == 'on'){exit();}

$currentfile = '../../'.$currentfile;
@unlink($currentfile);

echo 'OK';
}
?>