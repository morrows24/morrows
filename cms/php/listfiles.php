<?php 
  
$dir = glob('*.html');

$pagesandfileslist = '[';

$pagesandfileslist .= "{title: '----- Seiten ---------------', value: ' '},";
 
foreach($dir as $file) { 
$pagesandfileslist .= "{title: '".basename($file)."', value: '".basename($file)."'},";
}

function newest($a, $b) { return filemtime($b) - filemtime($a); } 
$dir = glob(''.$uploaddir.'/*');
uasort($dir, "newest");

$pagesandfileslist .= "{title: '----- Dateien ---------------', value: ' '},";
 
foreach($dir as $file) { 
	$pagesandfileslist .= "{title: '".basename($file)."', value: '".$uploaddir.basename($file)."'},";
}

$pagesandfileslist = substr($pagesandfileslist, 0, -1);

$pagesandfileslist .= ']';

//echo $pagesandfileslist;

// ------------------------------------------------

$imageslist = '[';

$imageslistdir = glob(''.$uploaddir.'/*');
uasort($imageslistdir, "newest");
 
foreach($imageslistdir as $file) { 
$fileextension = strtolower(strrchr(basename($file), '.'));
$allowed_extensions = array( ".jpg", ".png", ".gif" );
if (in_array( $fileextension, $allowed_extensions )){
$imageslist .= "{title: '".basename($file)."', value: '".$uploaddir.basename($file)."'},";
}
}

// if imagelist > 1
//$imageslist = substr($imageslist, 0, -1);

$imageslist .= ']';

//echo $imageslist;

?>
