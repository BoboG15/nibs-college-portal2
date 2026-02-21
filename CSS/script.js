/* ============================================================
   NIBS COLLEGE EVENT PORTAL — MAIN SCRIPT
   ============================================================ */

/* ── Slideshow ── */
let slideIndex = 1;
let slideTimer;

document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('.slideshow-container')) {
        showSlides(slideIndex);
        autoSlide();
    }
});

function changeSlide(n) {
    clearTimeout(slideTimer);
    showSlides(slideIndex += n);
    autoSlide();
}

function currentSlide(n) {
    clearTimeout(slideTimer);
    showSlides(slideIndex = n);
    autoSlide();
}

function showSlides(n) {
    const slides = document.getElementsByClassName('slide');
    const dots   = document.getElementsByClassName('dot');

    if (slides.length === 0) return;

    if (n > slides.length) { slideIndex = 1; }
    if (n < 1)             { slideIndex = slides.length; }

    Array.from(slides).forEach(s => s.classList.remove('active'));
    Array.from(dots).forEach(d => d.classList.remove('active'));

    slides[slideIndex - 1].classList.add('active');
    if (dots.length > 0) {
        dots[slideIndex - 1].classList.add('active');
    }
}

function autoSlide() {
    slideTimer = setTimeout(function () {
        slideIndex++;
        showSlides(slideIndex);
        autoSlide();
    }, 5000);
}

/* ── jQuery: Events & Registration ── */
$(document).ready(function () {

    /* Show More / Show Less toggle on event cards */
    $('.show-more-btn').on('click', function () {
        const $btn     = $(this);
        const $details = $btn.siblings('.event-details-hidden');
        const $icon    = $btn.find('i');

        $details.slideToggle(350, function () {
            if ($details.is(':visible')) {
                $btn.html('<i class="fas fa-chevron-up"></i> Show Less');
            } else {
                $btn.html('<i class="fas fa-chevron-down"></i> Show More');
            }
        });
    });

    /* ── Registration Form Validation ── */
    $('#registrationForm').on('submit', function (e) {
        e.preventDefault();

        // Clear previous errors
        $('.error-message').text('');
        $('.form-group input, .form-group select').removeClass('error');

        let isValid = true;

        // Admission Number
        const admissionNumber = $('#admissionNumber').val().trim();
        if (!admissionNumber) {
            showError('#admissionError', '#admissionNumber', 'Admission number is required.');
            isValid = false;
        } else if (!/^[A-Z]{2,}\/\d{4}\/\d{3,}$/i.test(admissionNumber)) {
            showError('#admissionError', '#admissionNumber', 'Invalid format. Use: NIBS/2024/001');
            isValid = false;
        }

        // Full Name
        const studentName = $('#studentName').val().trim();
        if (!studentName) {
            showError('#nameError', '#studentName', 'Full name is required.');
            isValid = false;
        } else if (studentName.length < 3) {
            showError('#nameError', '#studentName', 'Name must be at least 3 characters.');
            isValid = false;
        } else if (!/^[a-zA-Z\s]+$/.test(studentName)) {
            showError('#nameError', '#studentName', 'Name should only contain letters and spaces.');
            isValid = false;
        }

        // Event Selection
        const eventSelection = $('#eventSelection').val();
        if (!eventSelection) {
            showError('#eventError', '#eventSelection', 'Please select an event.');
            isValid = false;
        }

        // Email
        const email = $('#email').val().trim();
        if (!email) {
            showError('#emailError', '#email', 'Email address is required.');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('#emailError', '#email', 'Please enter a valid email address.');
            isValid = false;
        }

        if (isValid) {
            $('#registrationForm').fadeOut(400, function () {
                $('#successMessage').fadeIn(600);
                $('html, body').animate({
                    scrollTop: $('#successMessage').offset().top - 120
                }, 500);

                // Reset after 5 seconds
                setTimeout(function () {
                    $('#successMessage').fadeOut(400, function () {
                        $('#registrationForm')[0].reset();
                        $('#registrationForm').fadeIn(400);
                    });
                }, 5000);
            });
        } else {
            // Scroll to first error field
            const $firstError = $('.form-group input.error, .form-group select.error').first();
            if ($firstError.length) {
                $('html, body').animate({
                    scrollTop: $firstError.offset().top - 160
                }, 500);
            }
        }
    });

    /* Helper: show error */
    function showError(errorSelector, fieldSelector, message) {
        $(errorSelector).text(message);
        $(fieldSelector).addClass('error');
    }

    /* Real-time validation on blur */
    $('#admissionNumber').on('blur', function () {
        const val = $(this).val().trim();
        if (val && !/^[A-Z]{2,}\/\d{4}\/\d{3,}$/i.test(val)) {
            showError('#admissionError', '#admissionNumber', 'Invalid format. Use: NIBS/2024/001');
        } else {
            clearError('#admissionError', '#admissionNumber');
        }
    });

    $('#studentName').on('blur', function () {
        const val = $(this).val().trim();
        if (val && val.length < 3) {
            showError('#nameError', '#studentName', 'Name must be at least 3 characters.');
        } else if (val && !/^[a-zA-Z\s]+$/.test(val)) {
            showError('#nameError', '#studentName', 'Name should only contain letters and spaces.');
        } else {
            clearError('#nameError', '#studentName');
        }
    });

    $('#email').on('blur', function () {
        const val = $(this).val().trim();
        if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            showError('#emailError', '#email', 'Please enter a valid email address.');
        } else {
            clearError('#emailError', '#email');
        }
    });

    /* Clear error on input */
    $('.form-group input, .form-group select').on('input change', function () {
        if ($(this).val().trim()) {
            $(this).removeClass('error');
            $(this).siblings('.error-message').text('');
        }
    });

    /* Helper: clear error */
    function clearError(errorSelector, fieldSelector) {
        $(errorSelector).text('');
        $(fieldSelector).removeClass('error');
    }
});
