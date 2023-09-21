import { db } from "@/utils/firebase";
import { defineStore } from "pinia";
import {get,child,ref,update} from "firebase/database"

interface UserProfile{
    OPENAI_API_KEY: any
    isLoggedIn: boolean,
    user: any
    users: any
}
export const useUserProfile = defineStore('userprofile',{
    state: (): UserProfile => ({
        OPENAI_API_KEY: {},
        isLoggedIn: false,
        user: {},
        users: {}
    }),
    actions:{
        async getApiKey(){
            try{

                    const data = await get(child(ref(db),`apiKey`))
                    if(data.exists()){
                        this.OPENAI_API_KEY = data.val()
                        console.log(this.OPENAI_API_KEY.key)

                    }
                
            }
            catch(err){
                console.log(err)

            }
        },

        async writeNotes(notes: any){
            try{
                if(this.isLoggedIn === true){

                }

                const updates: any={}
                updates[`/notes`]={
                    text: notes.text
                }
                return await update(ref(db),updates)

                
            }
            catch(err){
                console.log(err)

            }
        },

        async createNewUser(data: any){
            try{
                console.log(data.email)
                const updates: any={}
                updates[`/users/` + `${data.email}`]={
                    fname: data.fname,
                    lname: data.lname,
                    password: data.password,
                    isLoggedIn: true,
                }
                return await update(ref(db),updates)

                
            }
            catch(err){
                console.log(err)

            }
        },
        async loginUser(userData: any){
            try{
                const data = await get(child(ref(db),`users`))
                if(data.exists()){
                    const usersArr = Object.values(data.val())
                    // console.log(usersArr)
                    const fname = userData.fname
                    const lname = userData.lname
                    const pass = userData.password
                    for(let i = 0; i<usersArr.length; i++){
                        const obj = usersArr[i]
                        if(fname === obj.fname && lname === obj.lname && pass === obj.password){
                            this.user = obj
                            console.log(this.user)
                            return true


                        }
                        return false
                    }
                }
            
            }
            catch(err){
                console.log(err)

            }
        },
        async getUsers(){//upon logging in call this function
            try{

                const data = await get(child(ref(db),`users`))
                if(data.exists()){
                    this.users = data.val()
                    console.log(this.users)

                }
                
            }
            catch(err){
                console.log(err)

            }
        },

        async createNewGoogleUser(data:any){
            try{
                const updates: any={}
                updates[`/users/` + `${data.email}`]={
                    fname: data.fname,
                    lname: data.lname,
                    isLoggedIn: true,
                }
                return await update(ref(db),updates)

                
            }
            catch(err){
                console.log(err)

            }


        }






    }
})