const isEmpty = data => data.trim() === '';

const isEmail = email => {
    const Regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email.match(Regexp)? true : false;
}


exports.validateSignup = (newUser) => {
    let errors = {
        
    };
    if(isEmpty(newUser.email)) errors.email = 'Must not be empty';
    else if(!isEmail(newUser.email)) errors.email = 'This is not a valid Email address';

    if(isEmpty(newUser.password)) errors.password = 'Must not be empty';

    if(newUser.password !== newUser.confirmPass) errors.confirmPassword = 'Password does not match confirmed password';

    if(isEmpty(newUser.userHandle)) errors.handle = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true:false
    };
}

exports.validateLogin = (User) => {
    const errors = {

    };
    if(isEmpty(User.email)) errors.email = 'Must not be empty';
    if(isEmpty(User.password)) errors.password = 'Must not be empty';

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }
}

exports.reduceUserDetails = (data) => {
    let userDetails = {};

    if(!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
    if(!isEmpty(data.website.trim())){
        if(data.website.substring(0,4) !== 'http'){
            userDetails.website = `http://${data.website.trim()}`;
        }else userDetails.website = data.website;
    }
    if(!isEmpty(data.location.trim())) userDetails.location = data.location;

    return userDetails;
}