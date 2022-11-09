var nameError = document.getElementById('name-error');
var  CategoryError = document.getElementById('category-error');
var  PriceError = document.getElementById('price-error');
var  QuantityError = document.getElementById('quantity-error');
var  DescriptionError = document.getElementById('description-error');
var  ImageError = document.getElementById('image-error');
var submitError = document.getElementById('submit-error');

function validateName() {
    var name = document.getElementById('Name').value;

    if (name.length == 0) {
        nameError.innerHTML = '*Name is required*';
        return false
    }
    nameError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}
function validateCategory() {
    var name = document.getElementById('Category').value;

    if (name.length == 0) {
        CategoryError.innerHTML = '*Category is required*';
        return false
    }
    Category.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}
function validatePrice() {
    var mobile = document.getElementById('Price').value;

    if (mobile.length == 0) {
        PriceError.innerHTML = '*Price is required*';
        return false
    }
    if (mobile.length < 4) {
        PriceError.innerHTML = '*Price should be above 1000*';
        return false
    }
    PriceError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}
function validateQuantity() {
    var mobile = document.getElementById('Quantity').value;

    if (mobile.length == 0) {
        QuantityError.innerHTML = '*Quantity is required*';
        return false
    }
    QuantityError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}
// function validateDescription() {
//     var name = document.getElementById('Description').value;

//     if (name.length == 0) {
//         DescriptionError.innerHTML = '*Description is required*';
//         return false
//     }
//     DescriptionError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
//     return true
// }


function validateForm() {
    if (!validateName() || !validateCategory() || !validatePrice() || !validateQuantity() || validateDescription() || validateImage()) {
        submitError.style.display = 'block'
        submitError.innerHTML = 'Please fill the form';
        setTimeout(function () { submitError.style.display = 'none' }, 2000)
        return false;
    }
}