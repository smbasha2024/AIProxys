// Handle dropdown child clicks
$('.dropdown-menu .dropdown-item').on('click', function () {
    // Remove active class from all nav links
    $('.nav-link').removeClass('active');

    // Add active to the dropdown's parent link
    $(this).closest('.dropdown').find('.dropdown-toggle').addClass('active');
});