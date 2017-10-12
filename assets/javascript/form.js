$(function () {
  $('#emailLink').on('click', function (event) {
      event.preventDefault();
    var email = 'iamarirosenthal@outlook.com';
    var subject = 'Apartment Inquiry';
    var emailBody = 'I would like to know more information regarding this apartment. (Please include the specific address and best contact information.)'
    window.location = 'mailto:' + email + '?subject=' + subject + '&body=' +   emailBody;
  });
});