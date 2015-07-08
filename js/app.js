$(document).ready(function () {
  // Toggle dropdown nav visibility on click.
  $('.hamburger').on('click', function (event) {
    event.preventDefault();
    $('.nav-header').toggleClass('open-menu');
  });
});
