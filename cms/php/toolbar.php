<?php

if(!file_exists('cms/lang/'.$lang.'.js')) { $lang = 'de'; } 
if(!$tinymcedivoptions) {$tinymcedivoptions = '';}
if(!$tinymceinlineoptions) {$tinymceinlineoptions = '';}

$header = '<link href="cms/css/font-awesome.min.css"rel="stylesheet" type="text/css">
<link href="cms/css/cms.css" rel="stylesheet">

';

$toolbar = '
<div class="cms_donotclickoverlay" style="position:fixed;z-index:1000;top:0;bottom:0;width:100%;"></div>

<div class="cms_toolbar">
<div class="cms_logo"><a href="index.html">COAST CMS</a></div>
<div class="cms_pagetitle"><span contenteditable="true"></span></div>
<div class="cms_buttons">
<div class="cms_button" id="cms_button_edit" data-toggle="tooltip" title="Seite bearbeiten"><i class="fa fa-pencil-square-o"></i></div>
<div class="cms_button" id="cms_button_check" data-toggle="tooltip" title="speichern"><i class="fa fa-check"></i></div>
<div class="cms_button" id="cms_button_cancel" data-toggle="tooltip" title="abbrechen"><i class="fa fa-times"></i></div>';

if ($extended_menu == 'yes') { $toolbar .= '
<div class="cms_button" id="cms_button_duplicatefile" data-toggle="tooltip" title="Seite duplizieren"><i class="fa fa-files-o"></i></div>
<div class="cms_button" id="cms_button_deletefile" data-toggle="tooltip" title="Seite löschen"><i class="fa fa-trash-o"></i></div>
<div class="cms_button" id="cms_button_uploads" data-toggle="tooltip" title="Uploads"><i class="fa fa-cloud"></i></div>
<div class="cms_button" id="cms_button_backups" data-toggle="tooltip" title="BackUps"><i class="fa fa-history"></i></div>'; }

if ($edit_css_button == 'yes') { $toolbar .= '
<div class="cms_button" id="cms_button_editcss" data-toggle="tooltip" title="CSS bearbeiten"><i class="fa fa-file-text-o"></i></div>'; }

if ($edit_html_button == 'yes') { $toolbar .= '
<div class="cms_button" id="cms_button_edithtml" data-toggle="tooltip" title="HTML-Code bearbeiten"><i class="fa fa-code"></i></div>'; }

if ($extended_menu == 'yes') { $toolbar .= '
<div class="cms_button" id="cms_button_showsubmenu" data-toggle="tooltip" title="erweitertes Menü einblenden"><i class="fa fa-sign-out fa-flip-horizontal"></i></div>
<div class="cms_button" id="cms_button_hidesubmenu" data-toggle="tooltip" title="erweitertes Menü ausblenden"><i class="fa fa-sign-out"></i></div>';
}

$toolbar .= '
<div class="cms_button_logout" id="cms_button_logout" data-toggle="tooltip" title="abmelden"><i class="fa fa-power-off"></i></div>
</div>
</div>
<div class="cms_notifications"></div>
';

$footer = '
<script type="text/javascript">
var cms_status = "active";
var timeout = '.$timeout.';
var demomode = "'.$demomode.'";
var tooltips = "'.$tooltips.'";
var uploaddir = "'.$uploaddir.'";
var cssfile = "'.$cssfile.'";
var maximgwidth = "'.$bigimgwidth.'";
var maxfilesize = "'.ini_get("upload_max_filesize").'";
maxfilesize = parseInt(maxfilesize);
</script>

<script> 
if (typeof window[\'jQuery\'] == \'undefined\') document.write(\'<scr\'+\'ipt type="text/javascript" src="cms/js/jquery.js"></sc\'+\'ript>\');  
</script>

<script type="text/javascript" src="cms/js/external.min.js"></script>
<script type="text/javascript" src="cms/tinymce/tinymce.min.js"></script>
<script type="text/javascript" src="cms/lang/'.$lang.'.js"></script>

<script type="text/javascript">
'.$tinymcedivoptions.'
'.$tinymceinlineoptions.'
</script>

<script type="text/javascript" src="cms/js/cms.js"></script>

<canvas id="temp_img_canvas" style="display:none;"></canvas>';

/* 
<div class="cms_button" id="cms_button_editmenu" data-toggle="tooltip" title="Menü bearbeiten"><i class="fa fa-bars"></i></div>
*/
?>