import { API_BASE_URL, ACCESS_TOKEN, TASK_LIST_SIZE } from './Constants';

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })
    
    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    );
};

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/signin",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    const user = request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
    
    return user;
}

export function getUserProfile() {
    return request({
        url: API_BASE_URL + "/user/profile",
        method: 'GET'
    });
}

export function getTasks(page, size, date){
    page = page || 0;
    size = size || TASK_LIST_SIZE;

    return request({
        url: API_BASE_URL + "/tasks?date=" + date + "&page=" + page + "&size=" + size,
        method: 'GET'
    });
}

export function createTask(task) {
    return request({
        url: API_BASE_URL + "/tasks",
        method: 'POST',
        body: JSON.stringify(task)         
    });
}

export function completeTask(completeRequest) {
    return request({
        url: API_BASE_URL + "/tasks/task/complete",
        method: 'post',
        body: JSON.stringify(completeRequest)    
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function checkUsernameAvailability(username) {
    return request({
        url: API_BASE_URL + "/user/checkUsernameAvailability?username=" + username,
        method: 'GET'
    });
}

export function checkEmailAvailability(email) {
    return request({
        url: API_BASE_URL + "/user/checkEmailAvailability?email=" + email,
        method: 'GET'
    });
}
