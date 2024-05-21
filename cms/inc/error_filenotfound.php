<!doctype html>
<html>
<head>
<title>CMS</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body class="cms_error">

<div class="content">
<i class="fa fa-exclamation-triangle"></i>
</div>

<?php 
include 'cms/php/toolbar.php';
echo $toolbar;
?>

<script type="text/javascript">
notify(filenotfound,90000);
$(".cms_button").remove();
</script>

</body>
</html>