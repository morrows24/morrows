<?php
session_start();
date_default_timezone_set('Europe/Berlin');
include '../settings.php';
include 'loginhistory.php';

$currentseconds = date("U"); 
$name = htmlentities($_POST["name"]);
$password = htmlentities($_POST["password"]);

if ($name == $username && $password == $userpassword){ 

echo 'OK'; 

$_SESSION["authorization"] = 'OK';
$_SESSION["lastreload"] = $currentseconds;
$_SESSION["name"] = $name;
	
} else { 

$totalfails++;
$failcounter++; 

if ($failcounter < 3) { 

echo 'NO'; 

} else {

echo 'BLOCKED'; 

}

$loginhistorycontent = '<?php $failcounter='.$failcounter.'; $failtime='.$currentseconds.'; $totalfails='.$totalfails.'; ?>';

$targetfile = fopen('loginhistory.php',"w");
rewind($targetfile);
fwrite($targetfile, $loginhistorycontent);
fclose($targetfile);

}

?>