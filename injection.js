

$( document ).ready(function() {

  injectExtensionHtml();
  loadSavedConfigs();
  loadConfigOnClick();
  deleteConfigOnClick();
  saveConfig();
  configHoverEffect();
});

function injectExtensionHtml(){
  // HTML Components
  var savePatronConfigBtn = "<input class='btn btn-success' type='button' id='savePatronConfig' value='Save'>"
  var saveSipConfigBtn = "<input class='btn btn-success' type='button' id='saveSipConfig' value='Save'>"
  var savedConfigsPanel = "<div class='panel panel-success' id='savedConfigsPanel'><div class='panel-heading'><h4>Saved Configurations</h4></div><ul class='configs-list list-group'></ul></div>"

  // Add save button to forms
  $( "#patronApiFields > div:nth-child(10)" ).append(savePatronConfigBtn);
  $( "#sip2Fields > div:nth-child(15)" ).append(saveSipConfigBtn);
  $( "#response" ).append(savedConfigsPanel);
}

function loadSavedConfigs(){
  for ( var i = 0, len = localStorage.length; i < len; ++i ) {
    addSavedConfigToPanel( localStorage.key( i ), i );
  }
}

function loadConfigOnClick(){
  $(".config").click(function(){
    var hostname = $(".hostname", this).text()
    var savedForm = $.parseJSON(localStorage[hostname])
    fillInDebuggerForm(savedForm);
  });
}

function deleteConfigOnClick(){
  $(".delete").click(function(e){
    var hostname = $(".hostname", $(this).parent()).text()
    localStorage.removeItem(hostname);
    $(this).parent().remove()
    e.stopPropagation();
  });
}

function saveConfig() {
  $('#savePatronConfig, #saveSipConfig').click(function(){
    var hostname = findActiveFormHostname()
    if (hostname === ""){
        $('#json').append("Invalid hostname.");
    } else {
        localStorage[hostname] = captureDebuggerForm();
        var savedConfigCount = localStorage.length + 1
        addSavedConfigToPanel(hostname, savedConfigCount);
    }
  });
}

function addSavedConfigToPanel( hostname, id ){
  var deleteConfigBtn = "<button type='button' class='delete btn btn-danger btn-xs' style='display:none;'><span class='glyphicon glyphicon-remove'></span> Delete </button>"
  var savedConfigHtml = "<li class='list-group-item config' id=" + id +">" + "<span class='hostname'>" + hostname + "</span>" + deleteConfigBtn + "</li>"
  $('#savedConfigsPanel').append(savedConfigHtml);
}

function configHoverEffect(){
  $('.config').mouseover( function(){
    $(this).css('cursor','pointer');
    $(this).css('background-color','#f5f5f5');
    $('.delete', this).css('float', 'right');
    $('.delete', this).show();
  });
  $('.config').mouseout( function(){
    $(this).css('background-color','#fff');
    $('.delete', this).hide();
  });
}

function captureDebuggerForm() {
  var values = {};
  $.each($('#debugger').serializeArray(), function(i, field) {
    values[field.name] = field.value;
  });
  return JSON.stringify(values)
}

function fillInDebuggerForm( savedForm ) {
  $.each(savedForm, function( name, val ){
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
  toggleFormByPortalType( savedForm.portalType );
}

function toggleFormByPortalType( portalType ){
  if (portalType === "Patron API"){
    $("#patronApiFields").show();
    $("#sip2Fields").hide();
  } else if ( portalType === "SIP2" ){
    $("#sip2Fields").show();
    $("#patronApiFields").hide();
  } else {
    alert('portalType Error: Invalid Portal Type')
  }
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
