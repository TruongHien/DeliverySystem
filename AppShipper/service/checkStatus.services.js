module.exports.checkStatus = (Status) => {
    let state = '';
    if (Status === 0) {
        state = 'Chưa Giao'
    } else {
        if (Status === 1) {
            state = 'Đang Giao'
        } else {
            if (Status === 2) {
                state = 'Giao Thành Công'
            } else {
                state = 'Giao Thất Bại'
            }
        }
    }
    return state;
}

module.exports.checkStyle = (Status) => {
    let state = '';
    if (Status === 0) {
        state = { color: 'blue' }
    } else {
        if (Status === 1) {
            state = { color: '#ff6600' }
        } else {
            if (Status === 2) {
                state = { color: 'green' }
            } else {
                state = { color: 'red' }
            }
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