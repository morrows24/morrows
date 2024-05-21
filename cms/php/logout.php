<?php
session_start();

if ($_SESSION["authorization"] == 'OK') {

include '../settings.php';

if (!isset($backupslifetime)) { $backupslifetime = '90'; } 

// DELETE OLD BACKUP-FILES
$dir = '../../backup/';	
$folder = dir($dir);
while ($dateiname = $folder->read()) {
if (filetype($dir.$dateiname) != "dir") {
if (strtotime("-".$backupslifetime." days") > //-90 days
@filemtime($dir.$dateiname)) {
@unlink($dir.$dateiname);
}}}
$folder->close();
}

$_SESSION["authorization"] = '';

?>