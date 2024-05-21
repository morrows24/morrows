<?php
 
session_start();
if ($_SESSION["authorization"] == 'OK' && $_POST["authorization"] == 'OK') {
 
// DEMOMODE
include '../settings.php';
if ($demomode == 'on'){
 
$dir = '../../'.$uploaddir;

$folder = dir($dir);
while ($dateiname = $folder->read()) {
if (filetype($dir.$dateiname) != "dir") {
//if (strtotime("-1 second") > @filemtime($dir.$dateiname)) {
@unlink($dir.$dateiname);
//}
}
}
$folder->close();
exit;
 
}
 
} // END authorization
?>