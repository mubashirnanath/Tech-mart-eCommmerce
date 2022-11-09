var nameError = document.getElementById('name-error');
var codeError = document.getElementById('code-error');
var amountError = document.getElementById('amount-error');
var dateError = document.getElementById('date-error');
var submitError = document.getElementById('submit-error');

function validateName() {
    var name = document.getElementById('Name').value;

    if (name.length == 0) {
        nameError.innerHTML = '*Name is required*';
        return false
    }
    if ((name.length <= 2) || (name.length > 20)) {
        nameError.innerHTML = '*Name length must be between 3 and 20*';
        return false
    }
    nameError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}
function validateCode() {
    var name = document.getElementById('Code').value;

    if (name.length == 0) {
        codeError.innerHTML = '*Code is required*';
        return false
    }
    if ((name.length <= 2) || (name.length > 20)) {
        codeError.innerHTML = '*Code length must be between 3 and 20*';
        return false
    }
    codeError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}
function validateAmount() {
    var mobile = document.getElementById('Amount').value;

    if (mobile.length == 0) {
        amountError.innerHTML = '*Amount is required*';
        return false
    }
    amountError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}
function validateDate() {
    var date = document.getElementById('Date').value;

    if (date.length == 0) {
        dateError.innerHTML = '*Date of Birth is required*';
        return false
    }
    dateError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}
function validateForm() {
    if (!validateName() || !validateCode() || !validateAmount() || !validateDate()) {
        submitError.style.display = 'block'
        submitError.innerHTML = 'Please fill the form';
        setTimeout(function () { submitError.style.display = 'none' }, 3000)
        return false;
    }
}