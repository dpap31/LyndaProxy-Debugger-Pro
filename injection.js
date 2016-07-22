// HTML Components
var savePatronConfigBtn = "<input class='btn btn-success' type='button' id='savePatronConfig' value='Save'>"
var saveSipConfigBtn = "<input class='btn btn-success' type='button' id='saveSipConfig' value='Save'>"
var savedConfigsPanel = "<div class='panel panel-success' id='savedConfigsPanel'><div class='panel-heading'><h4>Saved Configurations</h4></div><ul class='list-group'></ul></div>"

// Add save button to forms
$( "#patronApiFields > div:nth-child(10)" ).append(savePatronConfigBtn);
$( "#sip2Fields > div:nth-child(15)" ).append(saveSipConfigBtn);
$( "#response" ).append(savedConfigsPanel);

// Load saved configs
for ( var i = 0, len = localStorage.length; i < len; ++i ) {
  addSavedConfigToPanel( localStorage.key( i ), i );
}
loadConfigOnClick();

// On save
$('#savePatronConfig, #saveSipConfig').click(function(){
  alert("foo");
  var hostname = findActiveFormHostname()
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
    var savedForm = $.parseJSON(localStorage[hostname])
    fillInDebuggerForm(savedForm);
  });
}

function captureDebuggerForm() {
  var values = {};
  $.each($('#debugger').serializeArray(), function(i, field) {
    values[field.name] = field.value;
  });
  return JSON.stringify(values)
}

function fillInDebuggerForm(savedForm) {
  $.each(savedForm, function(name, val){
    var $el = $('[name="'+name+'"]'),
        type = $el.attr('type');

    switch(type){
      case 'checkbox':
        $el.attr('checked', 'checked');
        break;
      case 'radio':
        $el.filter('[value="'+val+'"]').attr('checked', 'checked');
        break;
      default:
        $el.val(val);
    }
  });
}

function findActiveFormHostname(){
  var isPatronFormHidden = $('#patronApiFields:visible').length == 0
  var isSipFormHidden = $('#sip2Fields:visible').length == 0

  if (isSipFormHidden && isPatronFormHidden) {
      $('#json').append("Invalid hostname.");
  } else if (isSipFormHidden == false) {
      return $('#sipHostname').val();
  } else if (isPatronFormHidden == false){
      return $('#patronApiHostname').val();
  } else {
      alert('Error finding form hostname');
  }
}
