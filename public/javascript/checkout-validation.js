var nameError = document.getElementById('name-error');
var addressError = document.getElementById('address-error');
var cityError = document.getElementById('city-error');
var stateError = document.getElementById('state-error');
var streetError = document.getElementById('street-error');
var pincodeError = document.getElementById('pincode-error');
var mobileError = document.getElementById('phone-error');
var submitError = document.getElementById('submit-error');


function validateAddrName() {
    var name = document.getElementById('AddrName').value;

    if (name.length == 0) {
        nameError.innerHTML = '*Name is required*';
        return false
    }
    if ((name.length <= 2) || (name.length > 20)) {
        nameError.innerHTML = '*Write correct name*';
        return false
    }
    nameError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}
function validateAddrAddress() {
    var name = document.getElementById('AddrAddress').value;

    if (name.length == 0) {
        addressError.innerHTML = '*Address is required*';
        return false
    }
    if ((name.length <= 2) || (name.length > 20)) {
        addressError.innerHTML = '*Write correct address*';
        return false
    }
    addressError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}
function validateAddrCity() {
    var name = document.getElementById('AddrCity').value;

    if (name.length == 0) {
        cityError.innerHTML = '*City is required*';
        return false
    }
    if ((name.length <= 2) || (name.length > 20)) {
        cityError.innerHTML = '*Write correct city*';
        return false
    }
    cityError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}
function validateAddrState() {
    var name = document.getElementById('AddrState').value;

    if (name.length == 0) {
        stateError.innerHTML = '*State is required*';
        return false
    }
    if ((name.length <= 2) || (name.length > 20)) {
        stateError.innerHTML = '*Write correct state*';
        return false
    }
    stateError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}
function validateAddrStreet() {
    var name = document.getElementById('AddrStreet').value;

    if (name.length == 0) {
        streetError.innerHTML = '*Street is required*';
        return false
    }
    if ((name.length <= 2) || (name.length > 20)) {
        streetError.innerHTML = '*Write correct street*';
        return false
    }
    streetError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}
function validateAddrPincode() {
    var mobile = document.getElementById('AddrPincode').value;

    if (mobile.length == 0) {
        pincodeError.innerHTML = '*Pincode is required*';
        return false
    }
    if (mobile.length != 6) {
        pincodeError.innerHTML = '*Pincode must be 6 digits*';
        return false
    }
    pincodeError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}
function validateAddrPhone() {
    var mobile = document.getElementById('AddrPhone').value;

    if (mobile.length == 0) {
        mobileError.innerHTML = '*Phone no is required*';
        return false
    }
    if (mobile.length != 10) {
        mobileError.innerHTML = '*Phone number should be 10 digits*';
        return false
    }
    if (!mobile.match(/^[0-9]{10}$/)) {
        mobileError.innerHTML = '*Only digits please*';
        return false
    }
    mobileError.innerHTML = '<i class="fa fa-check" aria-hidden="true" style="color:green;"></i>';
    return true
}

function validateForm() {
    if (!validateAddrName() || !validateAddrAddress() || !validateAddrCity() || !validateAddrState()|| !validateAddrStreet()|| !validateAddrPincode() || !validateAddrPhone()) {
        submitError.style.display = 'block'
        submitError.innerHTML = 'Please fill the form';
        setTimeout(function () { submitError.style.display = 'none' }, 3000)
        return false;
    }
}