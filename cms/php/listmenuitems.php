<?php 
session_start();

if ($_SESSION["authorization"] == 'OK') {
	
include '../settings.php';

print '<ul class="cms_menuitems">
<li><i class="fa fa-align-justify handle"></i><a href="abc.html"><span class="cms_menuitem_title">First Link</span></a><span class="cms_menuitem_url"><i class="fa fa-caret-right"></i>index.html</span><div class="cms_button_delete_menu_item"><i class="fa fa-trash-o"></i></div></li>
<li><i class="fa fa-align-justify handle"></i><a href="abc.html"><span class="cms_menuitem_title">Lorem Ipsum</span></a><span class="cms_menuitem_url"><i class="fa fa-caret-right"></i>index.html</span><div class="cms_button_delete_menu_item"><i class="fa fa-trash-o"></i></div></li>
<li><i class="fa fa-align-justify handle"></i><a href="abc.html"><span class="cms_menuitem_title">Dolor Sit amet</span></a><span class="cms_menuitem_url"><i class="fa fa-caret-right"></i>index.html</span><div class="cms_button_delete_menu_item"><i class="fa fa-trash-o"></i></div></li>

<li><span class="cms_menuitem_title">Neuer Menüpunkt</span>

<div class="btn-group">
  <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
    Seite auswählen <span class="caret"></span>
  </button>
  <ul class="dropdown-menu" role="menu">
    <li><a href="#">Action</a></li>
    <li><a href="#">Another action</a></li>
    <li><a href="#">Something else here</a></li>
    <li><a href="#">Separated link</a></li>
  </ul>
</div>

<div class="cms_button_delete_menu_item"><i class="fa fa-trash-o"></i></div></li>


</ul>';
 
/* 
$files = array();
$dir = new DirectoryIterator('../../');
 
foreach ($dir as $fileinfo) {
$files[$fileinfo->getMTime()] = $fileinfo->getFilename();
}

natsort($files);

print '[';
 
foreach($files as $file){	
if(strpos($file, ".html") !== false){
print "{title: '".$file."', value: '".$file."'},";
}
}

print ']';

*/

}

?>
