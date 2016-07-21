// HTML Components
var saveBtn = "<input class='btn btn-success' type='button' id='patronApiSave' value='Save'>"
var savedConfigsPanel = "<div class='panel panel-success' id='savedConfigsPanel'><div class='panel-heading'><h4>Saved Configurations</h4></div><ul class='list-group'></ul></div>"

// Page arrangement code
$( "#patronApiFields > div:nth-child(10)" ).append(saveBtn);
$( "#response" ).append(savedConfigsPanel);

// Load saved configs
for ( var i = 0, len = localStorage.length; i < len; ++i ) {
  addSavedConfigToPanel( localStorage.key( i ), i );
}
loadConfigOnClick();

// On save
$('#patronApiSave').click(function(){
  var hostname = $('#patronApiHostname').val();
  if (hostname === ""){
   $('#json').append("Invalid hostname.");
  } else {
   localStorage[hostname] = captureDebuggerForm();
   var savedConfigCount = localStorage.length + 1
   addSavedConfigToPanel(hostname, savedConfigCount);
  }
});

function addSavedConfigToPanel(hostname, id){
  var savedConfigHtml = "<li class='list-group-item config' id=" + id +">" + hostname +"</li>"
  $('#savedConfigsPanel').append(savedConfigHtml);
}

function loadConfigOnClick(){
  $(".config").click(function(){
    var hostname = $(this).text()
    console.log(hostname);
    var savedForm = $.parseHTML(localStorage[hostname])
    console.log(savedForm);
    $( "#patronApiFields").replaceWith(savedForm)
  });
}

function captureDebuggerForm() {
  var values = {}
  $.each($('#debugger').serializeArray(), function(i, field) {
    values[field.name] = field.value;
  });
  return values
}
