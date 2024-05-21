<?php
session_start(); 
date_default_timezone_set('Europe/Berlin');
error_reporting(E_ALL ^  E_NOTICE); 
$demomode = 'off'; // DO NOT EDIT!


// CHECK PHP-VERSION
if (version_compare(phpversion(), '5.3.1', '<')) {
include 'cms/inc/error_phpversion.php';
exit();	
}

// CHECK SETTINGSFILE
if(!file_exists('cms/settings.php')) { 
include 'cms/inc/error_settingsfile.html';
exit();	
} else {
include 'cms/settings.php';	
if (!isset($demomode)) { $demomode = 'off'; } 
}

// CHECK DEFAULT-USERNAME
if ($username == 'admin' OR $userpassword == 'topsecret') {
include 'cms/inc/error_logindata.html';
exit();	
}

// CHECK MAINTENANCE MODE
if (!isset($maintenancemode)) { $maintenancemode = 'off'; }
if($maintenancemode == 'on') { 
include 'cms/inc/error_maintenancemode.html';
exit();	
}

// CHECK INDEX.HTML
if(!file_exists('index.html')) { 
include 'cms/inc/error_noindex.html';
exit();	
}

// LOGGEDOUT
if (isset($_GET["action"])) { 
if ($_GET["action"] == 'logout') {	
include 'cms/inc/loggedout.html';
exit();	
}
}

$currentseconds = date("U");
if (!isset($timeout)) { $timeout = 5; }
$authorization = $_SESSION["authorization"];
$lastreload = $_SESSION["lastreload"];
$timespan = $currentseconds - $lastreload;
if ($timespan > $timeout) {$authorization = 'NO'; $_SESSION["authorization"] = 'NO'; }

$_SESSION["lastreload"] = $currentseconds;


// CHECK LOGIN-FAILS
include 'cms/php/loginhistory.php';

if ($totalfails > 15){ 
include 'cms/inc/error_loginblocked.html';
exit();	
}

if ($failcounter > 2 && $currentseconds-$failtime < 600){ 
include 'cms/inc/error_loginblockedtemp.html';
exit();	
}

if ($failcounter > 2 && $currentseconds-$failtime > 600){ 
$loginhistorycontent = '<?php $failcounter=0; $failtime='.$currentseconds.'; $totalfails='.$totalfails.'; ?>';
$targetfile = fopen('cms/php/loginhistory.php',"w");
rewind($targetfile);
fwrite($targetfile, $loginhistorycontent);
fclose($targetfile);
}

if ($authorization == 'OK' && $failcounter > 0 ) { 
$loginhistorycontent = '<?php $failcounter=0; $failtime=0; $totalfails=0; ?>';
$targetfile = fopen('cms/php/loginhistory.php',"w");
rewind($targetfile);
fwrite($targetfile, $loginhistorycontent);
fclose($targetfile);
}


if ($_SESSION["name"] != $username) { 
include 'cms/inc/login.html';
exit();	
}

if ($authorization != 'OK') { 
include 'cms/inc/login.html';
exit();	

} else {

$currentfile = $_GET["currentfile"]; 

if (!$currentfile) { echo '<script type="text/javascript">
window.location = "cms.php?currentfile=index.html";
</script>';
$currentfile = 'index.html';
}


// CHECK IF IS IN ROOT
if (strpos($currentfile,'/') !== false) {
include 'cms/inc/error_filenotinroot.php';
exit();	
}


// CHECK SOURCEFILE
if(!file_exists($currentfile)) { 
include 'cms/inc/error_filenotfound.php';
exit();	
} 


// CHECK FILE-EXTENSION
$fileextension = substr($currentfile, -4);
if ($fileextension != 'html' && $fileextension != '.htm' ){
include 'cms/inc/error_fileextension.php';
exit();	
}


// CHECK IF IS WRITABLE 
if (!is_writable($currentfile)) {	

include 'cms/php/ganon.php';
include 'cms/php/toolbar.php';

$currentpagecontent = file_get_dom($currentfile);
$currentpagecontent('head', 0)->setInnerText($currentpagecontent('head', 0)->getInnerText().$header);
$currentpagecontent('body', 0)->setInnerText($toolbar.$currentpagecontent('body', 0)->getInnerText().$footer.'<script type="text/javascript">notify(not_writeable,900000);$(".cms_button").remove();</script>');

echo $currentpagecontent;
exit();	
}


// RESTORE BACKUPS

if (isset($_GET["action"])) { 
if ($_GET["action"] == 'preview') {
	
$backupfile = $_GET["backupfile"];

if(!file_exists('backup/'.$backupfile)) { 
include 'cms/inc/error_filenotfound.php';
exit();	
}

include 'cms/php/ganon.php';
include 'cms/php/toolbar.php';

$currentpagecontent = file_get_dom('backup/'.$backupfile);
$currentpagecontent('head', 0)->setInnerText($currentpagecontent('head', 0)->getInnerText().$header);
$currentpagecontent('body', 0)->setInnerText($toolbar.$currentpagecontent('body', 0)->getInnerText().$footer.'<script type="text/javascript">
restorebackup();</script>');

echo $currentpagecontent;

exit();	
}
}

// ROCK N ROLL
include 'cms/php/ganon.php';
include 'cms/php/toolbar.php';
include 'cms/php/listfiles.php';	
$footer = str_replace("pagesfilesimages: ''", "link_list: ".$pagesandfileslist.",image_list: ".$imageslist, $footer);
$footer = str_replace("pagesfiles: ''", "link_list: ".$pagesandfileslist, $footer);

$currentpagecontent = file_get_dom($currentfile);
$currentpagecontent('head', 0)->setInnerText($currentpagecontent('head', 0)->getInnerText().$header);
$currentpagecontent('body', 0)->setInnerText($toolbar.$currentpagecontent('body', 0)->getInnerText().$footer);

// CHECK IF BACKUP-DIR IS WRITABLE 
if (!is_writable('backup/')) {	
$currentpagecontent('body', 0)->setInnerText($currentpagecontent('body', 0)->getInnerText().'<script type="text/javascript">notify(backupdir_not_writeable,15000);</script>');
} 

echo $currentpagecontent;

}

?>
 