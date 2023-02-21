import axios from "axios";
import { makeAutoObservable } from "mobx";
import { API_URL } from "../http";
import AuthService from "../services/AuthService";

export default class AuthState {
    user = {}
    isAuth = false
    isLoading = false
    activated = false
    authFail = false

    constructor(){
        makeAutoObservable(this)
    }

    setAuth(bool) {
        this.isAuth = bool
    }

    setAuthFail(bool) {
        this.authFail = bool
    }

    setUser(user) {
        this.user = user
    }

    setLoading(bool) {
        this.isLoading = bool
    }

    setActivated(bool) {
        this.activated = bool
    }

    checkActivated() {
        const user = this.user 
        if(user.isActivated) {
            this.setActivated(true)
            return true
        }
        return false
    }

    async login(email, password) {
        try {
            this.setAuthFail(false)
            const response = await AuthService.login(email, password)
            console.log(response)
            localStorage.setItem('token', response.data.accessToken)
            this.setUser(response.data.user)
            if(this.checkActivated()) {
                this.setAuth(true)
            }
            console.log(this.isAuth)
            
        } catch (e) {
            this.setAuthFail(true)
            console.log(e.response?.data?.message)
        }
    }

    async registration(email, username, password) {
        try {
            this.setAuthFail(false)
            const response = await AuthService.registration(email, username, password)
            localStorage.setItem('token', response.data.accessToken)
            //this.setAuth(true)
            this.setUser(response.data.user)
        } catch (e) {
            console.log(e.response?.data?.message)
            this.setAuthFail(true)
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout()
            localStorage.removeItem('token')
            this.setAuth(false)
            this.setUser({})
        } catch (e) {
            console.log(e.response?.data?.message)
        }
    }

    async checkAuth() { 
        this.setLoading(true)
        try {
            const response = await axios.get(`${API_URL}/refresh`, {withCredentials: true})
            console.log(response);
            localStorage.setItem('token', response.data.accessToken);
            this.setUser(response.data.user);
            if(this.checkActivated()) {
                this.setAuth(true);
            }
        } catch (e) {
            console.log(e.response?.data?.message);
        } finally {
            this.setLoading(false)
        }
    }

}