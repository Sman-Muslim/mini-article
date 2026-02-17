export function required(value , message = 'This field is required'){
    return value && String(value).trim() ? "" : message;
}

export function isEmail(value , message = 'This field is required'){
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(String(value).trim()) ? "" : message;
}

export function isPassword(value , message = 'This field is required'){

}

export function validation(value , rules = []){  
    for(let rule of rules){
        let err = rule(value)

        if(err){
            return err;
        }
    }
}

export function minlength(value , length , message = `Minimum length is ${length} characters`){
    return String(value).trim().length >= length ? "" : message;
}


