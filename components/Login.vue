<template>
    <v-row no-gutters style="justify-content: center;" class="mt-16">
        <v-col class="">
            <v-sheet color="#FBA797" class="ml-16 mt-16 rounded-xl" height="500">
                <v-container v-if="window">
                <v-btn
            class="mt-5 ml-8 rounded-pill"
            size="x-large"
            prepend-icon="mdi-gmail"
            color=""
            variant="text"
            @click="googleSignIn()"
        >
            Sign In with Gmail 
                </v-btn>
        <v-row class="mt-2 ml-5">
            <v-col cols="6">
                <v-text-field clearable variant="outlined" label="Firstname" v-model="fname"/>
            </v-col>
            <v-col cols="6">
                <v-text-field clearable variant="outlined" label="Lastname" v-model="lname"/>
            </v-col>

        </v-row>
        <v-row class="mt-5 ml-5">
            <v-col cols="6">
            <v-text-field clearable variant="outlined" label="Password" type="password" v-model="password"/>
            </v-col>
            <v-btn
                color="green"
                size="x-large"
                width="290"
                class=" ml-3 mt-3"
                @click="login()"
                
            >
                Login
            </v-btn>

        </v-row>
        <v-row class="ml-7">
            <span class="text-red"> {{ errorMessage }} </span>
        </v-row>        
        <v-row class="mt-7 ml-7">
            <span>Don't have an account? </span>
            <v-btn
                color=""
                size="x-small"
                class="ml-2 mt-1"
                variant="tonal"
                @click="window=!window"
                
            >
                Register
            </v-btn>
        </v-row>


                </v-container>
                <v-container v-if="window===false">
                <v-row class="mt-5 ml-8">
            <span>Already have an account? </span>
            <v-btn
                color=""
                size="x-small"
                class="ml-2 mt-1"
                variant="tonal"
                @click="window=!window"
                
            >
                Sign In
            </v-btn>
        </v-row>

                <v-row class="mt-5 ml-5">
            <v-col cols="6">
                <v-text-field clearable variant="outlined" label="Firstname" v-model="fname"/>
            </v-col>
            <v-col cols="6">
                <v-text-field clearable variant="outlined" label="Lastname" v-model="lname"/>
            </v-col>

        </v-row>
        <v-row class="mt-5 ml-5">
            <v-col cols="13">
                <v-text-field clearable variant="outlined" label="Email" v-model="email"/>
            </v-col>
        </v-row>
        <v-row class="mt-5 ml-5">
            <v-col cols="13">
                <v-text-field clearable variant="outlined" label="Password" type="password" v-model="password"/>
            </v-col>
        </v-row>
        <v-row class="mt-5 ml-5" style="justify-content: center;">
            <v-btn
                color="green"
                size="x-large"
                width="400"
                class="ml-2"
                @click="registerUser()"
                
            >
                Register
            </v-btn>
        </v-row>
            </v-container>
            </v-sheet>

        </v-col>
        <v-col class="">
            <v-img src="login.jpeg" height="500"/>
        </v-col>

    </v-row>
</template>
<script setup>
    import {GoogleAuthProvider ,signInWithPopup} from "firebase/auth";
    import {auth} from "~/utils/firebase";
    import base64 from "base-64";
    import {useUserProfile} from "~/store/store"
    // import utf8 from 'utf8'

    const user = useUserProfile()
    const router = useRouter()
    const window = ref(true)
    const fname = ref('')
    const lname = ref('')
    const email = ref('')
    const password = ref('')
    const errorMessage = ref('')


    async function googleSignIn() {
        const provider = new GoogleAuthProvider();
        try {
        // Sign in with Google
        const result = await signInWithPopup(auth, provider);

        // Access the user's profile data
        const seeker = result.user;
        const name = seeker.displayName;
        const email = seeker.email;

        // console.log(`Name: ${name}`);
        // console.log(`Email: ${email}`);
        await user.getUsers()
        const bytes = encodeURI(email)
        const encryptedEmail = base64.encode(bytes)
        const objArr = Object.keys(user.users)
        for(let i = 0; i<objArr.length;i++){
            if(objArr.includes(encryptedEmail)){
                const index = objArr.indexOf(encryptedEmail)
                const usersObj = user.users
                const userArr = Object.values(usersObj)
                const currUser = userArr[index]
                // console.log(currUser.fname)
                const userForm = {
                    fname: currUser.fname,
                    lname: currUser.lname,
                    email: currUser.email
                }
                await user.loginGoogleUser(userForm)
                router.push('/main')
            }else{
                const nameArr = name.split(' ')
                const fname = nameArr[0]
                const lname = nameArr[1]
                const userForm = {
                    fname: fname,
                    lname: lname,
                    email: encryptedEmail,
                    email2: email
                }
                await user.createNewGoogleUser(userForm)
                router.push('/main')
            }

        }

        } catch (error) {
            console.error(error.message);
        }
    }

    async function registerUser(){
        try{
            var emailBytes = encodeURI(email.value)
            // console.log(password.value)
            var encryptedEmail = base64.encode(emailBytes)
            var passwordBytes = encodeURI(password.value)
            var encryptedPassword = base64.encode(passwordBytes)
            const userForm = {
                fname: fname.value,
                lname: lname.value,
                email: encryptedEmail,
                email2: email.value,
                password: encryptedPassword
            }
            // console.log(userForm.value.password)
            await user.createNewUser(userForm)
            await user.loginUser(userForm)
            router.push('/main')

        }
        catch(error){
            console.error(error)
        }
    }

    async function login(){
        const passwordBytes = encodeURI(password.value)
        const encryptedPassword = base64.encode(passwordBytes)
        const userForm = {
            fname: fname.value,
            lname: lname.value,
            password: encryptedPassword
        }
        const response = await user.loginUser(userForm)
        if(response === false){
            errorMessage.value = "Your username/password is incorrect!"
        }
        else{
            router.push('/main')
        }

    }


</script>
<style>
  body{
    background-color: #FFEFC8;
  }
</style>