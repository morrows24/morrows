<?php

$username = 'contentFee'; // not: admin
$userpassword = 'Como2024!'; // not: topsecret

$maintenancemode = 'off'; // on/off

// OPTIONS ------------------------------------------------------

$lang = 'de'; 
$uploaddir = 'uploads/'; // must end with "/"
$backupslifetime = '90'; // in days
$bigimgwidth = 1000; // width of big img in px
$timeout = 1800; // 1800 = 30 minutes
$extended_menu = 'yes'; // yes/no
$edit_html_button = 'yes'; // yes/no
$tooltips = 'yes'; // yes/no
$edit_css_button = 'no'; // yes/no
$cssfile = 'css/styles.css'; // path to css-file

// TINYMCE OPTIONS ----------------------------------------------

$tinymcedivoptions = "
var tinymcedivoptions = {
style_formats: [
{title: headline1, block: 'h1'},
{title: headline2, block: 'h2'},
{title: headline3, block: 'h3'},
{title: headline4, block: 'h4'},
{title: headline5, block: 'h5'},
{title: headline6, block: 'h6'},
{title: paragraph, block: 'p'}
//,{title: 'test', inline: 'span', classes: 'example1'}
],
toolbar: 'insertfile undo redo | styleselect | bold italic | bullist numlist | hr | link image | pastetext | code',
plugins: [
'advlist autolink lists link image charmap print preview anchor hr',
'searchreplace visualblocks code fullscreen',
'insertdatetime media table contextmenu paste'
],
language: 'de',
menubar: false,
convert_urls: false,
skin: 'coast',
extended_valid_elements: 'iframe[src|width|height|name|align|frameborder],i[class]',
entity_encoding: 'raw',
// DON´T EDIT BELOW THIS LINE ------------------
selector: '.editable', 
inline: true,
pagesfilesimages: ''
};";

$tinymceinlineoptions = "
var tinymceinlineoptions = {
toolbar: 'bold italic | link | pastetext',
plugins: [
'advlist autolink lists link image charmap print preview anchor',
'searchreplace visualblocks code fullscreen',
'insertdatetime media contextmenu paste'
],
language : 'de',
menubar: false,
skin: 'coast',
extended_valid_elements: 'iframe[src|width|height|name|align|frameborder],i[class]',
entity_encoding: 'raw',
// DON´T EDIT BELOW THIS LINE ------------------
selector: '.editable_line', 
inline: true,
convert_urls: false,
pagesfiles: ''
};";

$demomode = 'off'; // DO NOT EDIT!

?>