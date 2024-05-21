<?php 
session_start(); 

if ($_SESSION["authorization"] == 'OK') {

$currentfile = $_POST["currentfile"];
	
include '../settings.php';

$numberoffiles = 0; 
$dir = '../../backup/';
if ($handle = opendir($dir)) {
while (($file = readdir($handle)) !== false){
if (!in_array($file, array('.', '..')) && !is_dir($dir.$file)) 
$numberoffiles++;
}
}

if ($numberoffiles > 0){
 
function newest($a, $b) { return filemtime($b) - filemtime($a); } 
$dir = glob('../../backup/*.html');
uasort($dir, "newest");

foreach($dir as $file) { 

if (is_numeric(substr(basename($file), 11, 2))) {
$time =  ' - '.substr(basename($file), 11, 2).'.'.substr(basename($file), 14, 2).' Uhr';
} else { $time = '';}

if (substr(basename($file),0,1) == 2 && strpos(basename($file),$currentfile) !== false) {
print '<div class="cms_uploaded_file"><a href="cms.php?action=preview&backupfile='.basename($file).'&currentfile='.$currentfile.'">'.$currentfile.' vom '.substr(basename($file), 8, 2).'.'.substr(basename($file), 5, 2).'.'.substr(basename($file), 0, 4).''.$time .'</a></div>';
}
}
}
}

?>

