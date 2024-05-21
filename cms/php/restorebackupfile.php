<?php
session_start();

if ($_SESSION["authorization"] == 'OK') {

$backupfile = $_POST["backupfile"];
$targetfile = $_POST["targetfile"];

if(!$backupfile){exit();}
if ($demomode == 'on'){exit();}

include '../settings.php';

$backupfile = '../../backup/'.$backupfile;
$targetfile = '../../'.$targetfile;

if (!copy($backupfile, $targetfile)) {
echo 'failed';
} else {
echo 'OK';
}

}
?>