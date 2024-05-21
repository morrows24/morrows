<?php 
session_start();

if ($_SESSION["authorization"] == 'OK') {
	
include '../settings.php';
 
$dir = glob('../../*.html');

print '[';

print "{title: '----- Seiten ---------------', value: ' '},";
 
foreach($dir as $file) { 
print "{title: '".basename($file)."', value: '".basename($file)."'},";
}
 

function newest($a, $b) { return filemtime($b) - filemtime($a); } 
$dir = glob('../../'.$uploaddir.'/*');
uasort($dir, "newest");

print "{title: '----- Dateien ---------------', value: ' '},";
 
foreach($dir as $file) { 
print "{title: '".basename($file)."', value: '".$uploaddir.basename($file)."'},";
}

print ']';

}

?>
