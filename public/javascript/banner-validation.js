var nameError = document.getElementById('title-error');
var  MainTitleError = document.getElementById('mainTitle-error');
var submitError = document.getElementById('submit-error');

function validateTitle() {
    var name = document.getElementById('Title').value;

    if (name.length == 0) {
        nameError.innerHTML = '*Title is required*';
        return false
    }
    if ((name.length <= 2) || (name.length > 20)) {
        nameError.innerHTML = '*Write correct name*';
        return false
    }
    nameError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}
function validateMainTitle() {
    var name = document.getElementById('Main-Title').value;

    if (name.length == 0) {
        MainTitleError.innerHTML = '*Main title is required*';
        return false
    }
    if ((name.length <= 2) || (name.length > 20)) {
        nameError.innerHTML = '*Write correct name*';
        return false
    }
    MainTitleError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}
function validateImage() {
    var name = document.getElementById('Image').value;

    if (name.files.length == 0) {
        ImageError.innerHTML = '*Image is required*';
        return false
    }
    ImageError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}

function validateForm() {
    if (!validateTitle() || !validateMainTitle() || validateImage()) {
        submitError.style.display = 'block'
        submitError.innerHTML = 'Please fill the form';
        setTimeout(function () { submitError.style.display = 'none' }, 2000)
        return false;
    }
}