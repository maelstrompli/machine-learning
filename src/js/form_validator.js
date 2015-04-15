/**
 * @form_validator.js: call 'validate()' method on defined form elements.
 *
 *     http://jqueryvalidation.org/documentation/
 *     http://jqueryvalidation.org/category/validator/
 *     http://jqueryvalidation.org/jQuery.validator.addMethod/
 *     http://stackoverflow.com/questions/10843399#answer-10843593
 */

/**
 * Custom Method: callback function(s) used from the 'Compound Class Rules',
 *                and the 'Validation' sections (see below).
 *
 * @value the value submitted on the given form element
 *
 * @element the element being validated
 *
 * @parameter additional parameters from the instantiating schema. For example,
 *     the 'validate' method (see below 'Validation:'), provides an array as a
 *     parameter to the added method 'equals':
 *
 *         `equals: ['training', 'analysis']`
 */
  jQuery.validator.addMethod(
    'equals',
    function(value, element, parameter) {
      if ( $.inArray(value, parameter) >= 0 ) return true;
      else return false;
    });
  jQuery.validator.addMethod(
    'integerOnly',
    function(value, element, parameter) {
      if ( Math.round(parseInt(value)) === parseInt(value) ) return true;
      else return false;
  });
  jQuery.validator.addMethod(
    'numericOnly',
    function(value, element, parameter) {
    // validate integers: cannot start with 0 (except trivial 0)
      if (value.match(/^(0|[1-9][0-9]*)$/)) {
        return true;
    // validate floats
      } else if (value.match(/^\d*\.\d+$/)) {
        return true;
    // invalid condition
      } else {
        return false;
      }
  });
  jQuery.validator.addMethod(
    'textOnly',
    function(value, element, parameter) {
      if ( typeof(value) === 'string' ) return true;
      else return false;
  });
  jQuery.validator.addMethod(
    'checkMime',
    function( value, element, parameter ) {
      if ( $.inArray(element.files[0].type, parameter) >= 0 ) return true;
      else return false;
    },
    'Incorrect file format'
  );

/**
 * Compound Class Rules: validates form elements by respective classnames.
 *                       This validation may implement the 'Definition(s)',
 *                       defined from the '.addMethod' definition.
 *
 * Note: These rules cannot define custom messages. Instead, the custom messages
 *       must be defined as the last parameter to the 'addMethod' definition (see
 *       above 'checkMime').
 */
  jQuery.validator.addClassRules({
    svm_dataset_xml: {
      url: true,
    },
    svm_dataset_file: {
      checkMime: ['text/plain', 'text/csv', 'text/xml', 'application/xml', 'application/json'],
    },
  });

/**
 * Validation: validates form elements by the 'name attribute. This validation
 *             may implement the 'Definition(s)', defined from the 'addmethod'
 *             definition.
 */
  $(document).ready(function() {

    $('form').validate({
      rules: {
        svm_session: {
          required: true,
          equals: ['data_new', 'data_append', 'model_use', 'model_generate']
        },
        svm_title: {
          required: true,
          textOnly: true          
        },
        svm_session_id: {
          required: true,
          integerOnly: true
        },
        svm_model_id: {
          required: true,
          integerOnly: true
        },
        svm_dataset_type: {
          required: true,
          equals: ['file_upload', 'dataset_url']
        },
        svm_model_type: {
          required: true,
          equals: ['classification', 'regression']
        },
        'svm_indep_variable[]': {
          required: true,
          textOnly: true
        },
        'indep_variable[]': {
          required: true,
          numericOnly: true
        },
      },
      messages: {
        svm_session: 'Not acceptable values',
        svm_title: 'Must be nonempty string',
        svm_dataset_type: 'Not acceptable value',
        svm_session_id: 'Not acceptable value',
        svm_model_type: 'Note acceptable value',
        'svm_indep_variable[]': 'Must be nonempty string',
        'indep_variable[]': 'Must be nonempty decimal',
      },
    });
  });
