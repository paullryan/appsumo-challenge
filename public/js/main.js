$(document).ready(function() {
  $('select').material_select();

  var options = $('div.input-field.options');
  options.hide();
  $('#question-type').change(function(handler){
    if(['checkbox', 'select', 'multi-select', 'radios'].indexOf(handler.target.value) > -1){
      return options.show();
    }
    options.hide();

  });

  var showAnswers = false;

  var toggleAnswers = function(){
    $('.answers').each(function(){
      if(showAnswers){
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }

  toggleAnswers();

  $('#answer-btn').click(function($event){
    $event.preventDefault();
    showAnswers = !showAnswers;
    toggleAnswers();
  });

});
