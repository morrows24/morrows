/* 
CoastCMS
Copyright (c) 2015 Fabian Meiswinkel
Licensed under the MIT license
www.coast-cms.de 
*/

$(document).ready(function(){

$('#name').focus();

$('input').keypress(function(event) {  
$('input').css('border', '1px solid #ddd').css('color', '#666').removeClass('wrong_name').removeClass('wrong_password'); 
$('.cms_button_login').removeClass('wrong_password');
});

$('body').keypress(function(event) {  
if ( event.which == 13 ) { checkLogindata(); }
});

$('.cms_button_login').click(function() {  checkLogindata(); });


var isChrome = !!window.chrome;
if (!isChrome) {  
$('.cms_login').append('<div class="chromenotice">Für die Bearbeitung der Website mit Coast CMS sollten Sie Google Chrome verwenden!<br>Google Chrome kann <a href="https://www.google.de/chrome" target="_blank">hier</a> kostenlos heruntergeladen und installiert werden.</div>');
}

});

// -------------------------------------------------------------------------------------------- //

function checkLogindata(){

$('.cms_button_login').spin(opts);
$('.cms_button_login i').hide();

name = $('#name').val();
password = $('#password').val();

$.ajax({
  type: "POST",
  url: "cms/php/login.php",
  data: "name=" + name + "&password=" + password,
  success: function(response){
  $('.cms_button_login').spin(false);
      
if (response == 'NO') { 
  $('input').css('border', '1px solid #f00').css('color', '#f00'); 
  $('#name').addClass('wrong_name');
  $('#password, .cms_button_login').addClass('wrong_password');
  $('.cms_button_login i').show();
}	
  
if (response == 'OK') { 
  $('input').css('border', '1px solid green').css('color', 'green'); 
  $('input').css('opacity', '1').delay(1000).queue(function() { 
  	
  document.login.submit();
  });
  }
 
if (response == 'BLOCKED') { 
$('input').css('border', '1px solid #f00').css('color', '#f00'); 
$('#name').addClass('wrong_name');
$('#password, .cms_button_login').addClass('wrong_password').delay(500).queue(function() { 
  	
  location.reload(true);
  });;

} 
    
}

});

}

// -------------------------------------------------------------------------------------------- //

var opts = {
  lines: 10, 
  length: 4,
  width: 3, 
  radius: 5, 
  color: '#ccc', 
  speed: 1, 
  trail: 60, 
  shadow: false 
};

// -------------------------------------------------------------------------------------------- //

$(document).ready(function(){

var currentfile = document.URL.split('currentfile=')[1];
if (currentfile){currentfile = currentfile.split('#')[0];}

$('#gotosite').attr('href',currentfile);
$('#gotologin').attr('href','cms.php?currentfile='+currentfile);

});