import { db } from "@/utils/firebase";
import { defineStore } from "pinia";
import {get,child,ref,update, onValue} from "firebase/database";
import base64, { encode } from 'base-64'
import { NULL } from "sass";

interface UserProfile{
    GGAI_API_KEY: any,
    isLoggedIn: boolean,
    user: any,
    users: any,
    email: String,
    fname: String,
    lname: String,
    pass: any,
    userNotes: any
}
export const useUserProfile = defineStore('userprofile',{
    state: (): UserProfile => ({
        GGAI_API_KEY: '',
        isLoggedIn: false,
        user: {},
        users: {},
        email: '',
        fname: '',
        lname: '',
        pass: '',
        userNotes:{}
    }),
    getters: {
        getEmail(state){
            return state.email
        }
    },
    actions:{
        async getApiKey(){
            try{

                    const data = await get(child(ref(db),`apiKey`))
                    if(data.exists()){
                        this.GGAI_API_KEY = data.val().key
                    }
                
            }
            catch(err){
                console.log(err)

            }
        },

        async getUserNotes(uid:any){
            try{
                const notesRef = ref(db)
                return onValue(child(notesRef, `users/${uid}/notes`),(snapshot: any)=>{
                    if(snapshot.exists()){
                        this.userNotes = snapshot.val()
                    }

                })
                // const data = await get(child(ref(db),`users/${uid}/notes`))
                // if(data.exists()){
                //     this.userNotes = data.val()
                //     // console.log(this.userNotes)

                // }

                

            }
            catch(error){
                console.error(error)
            }
        },

        async deleteNote(topic: any, uid: any){
            try{
                const updates: any={}
                updates[`/users/${uid}/notes/${topic}`] = null
                return await update(ref(db),updates)  

            }catch(err){
                console.log(err)
            }
        },

         async writeUserNotes(notes: any,uid:any){
            try{
                const updates: any={}
                updates[`/users/` + uid + `/notes/${notes.topic}`]={
                    topic: notes.topic,
                    content: notes.content
                }
                return await update(ref(db),updates)
            }
            catch(err){
                console.log(err)

            }
        },
        // async editUserNotes(newNotes:any){
        //     try{
        //         const updates: any={}
        //         updates[`users/`]


        //     }
        //     catch(error){
        //         console.log(error)
        //     }

        // },
        async writeGeneratedNotes(notes: any,uid:any,response: any, map: any){
            try{
                const updates: any={}
                // console.log(response)
                updates[`/users/` + uid + `/notes/${notes.topic}`]={
                    topic: notes.topic,
                    content: notes.content,
                    generatedResponse: response,
                    mindMap: map
                }
                return await update(ref(db),updates)

                
            }
            catch(err){
                console.log(err)

            }
        },

        async createNewUser(data: any){
            try{
                // console.log(data.email)
                const updates: any={}
                updates[`/users/` + `${data.email}`]={
                    fname: data.fname,
                    lname: data.lname,
                    email: data.email2, 
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
                            this.email=this.user.email
                            this.fname = this.user.fname
                            this.lname = this.user.lname
                            this.pass = this.user.password
                            // console.log(this.user)
                            return true


                        }
                    }
                    return false

                }
            
            }
            catch(err){
                console.log(err)

            }
        },

        async loginGoogleUser(userData: any){
            try{
                this.email=userData.email
                this.fname = userData.fname
                this.lname = userData.lname
            
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
                    // console.log(this.users)

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
                    email: data.email2,
                    isGoogleUser: true,
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