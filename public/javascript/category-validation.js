var categoryError = document.getElementById('category-error');
var titleError = document.getElementById('title-error');
var mainTitleError = document.getElementById('mainTitle-error');
var submitError = document.getElementById('submit-error');

function validateCategory(){
    var name = document.getElementById('CategoryName').value;

    if (name.length == 0) {
        categoryError.innerHTML = '*category is required*';
        titleError.innerHTML = '*Title is required*';
        mainTitleError.innerHTML = '*Main title is required*';
        return false
    }
    categoryError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}

function validateForm() {
    if (!validateCategory()|| !validateImage()) {
        submitError.style.display = 'block'
        submitError.innerHTML = 'Please fill the form';
        setTimeout(function () { submitError.style.display = 'none' }, 3000)
        return false;
    }
}