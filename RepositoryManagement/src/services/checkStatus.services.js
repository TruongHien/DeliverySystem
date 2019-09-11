module.exports.checkStatus = (Status) => {
    let state = '';
    if (Status === "OnProcessing")
    {
        state = 'Chưa Giao'
    }else{
        if(Status === "onDelivering"){
            state = 'Đang Giao'
        }else{
            if(Status === 'Received'){
                state = 'Giao Thành Công'
            }else{
                state = 'Giao Thất Bại'
            }
        }
    }
    return state;
}

module.exports.checkStyle = (Status) => {
    let state = '';
    if (Status === "OnProcessing")
    {
        state = {color: 'blue'}
    }else{
        if(Status === "onDelivering"){
            state = {color: '#ff6600'}
        }else{
            if(Status === 'Received'){
                state = {color: 'green'}
            }else{
                state = {color: 'red'}
            }
        }
    }
    return state;
}

module.exports.checkStyleDeliveryMethod = (Status) => {
    let state = '';
    if (Status === "Standard") {
        state = {color: 'green'}
    } else {
        if (Status === "Fast") {
            state = {color: 'blue'}
        }
    }
    return state;
}

module.exports.checkDeliveryMethod = (Status) => {
    let state = '';
    if (Status === "Standard") {
        state = 'Giao Thường'
    } else {
        if (Status === "Fast") {
            state = 'Giao Nhanh'
        }
    }
    return state;
}