<template>
    <v-container style="justify-content: center;">
        <v-row no-gutters style="justify-content: center;" class="landing-page">
            <v-col class="ml-10">
                <v-img class="brand-image" src="login.jpeg" height="500"/>
            </v-col>

            <v-col class="">
                <v-sheet border elevation="2" class="mt-16 container" height="500">
                    <v-container v-if="window">
                        <v-img src="logo.jpeg" class="mb-6" height="40"/> 
                        <v-row style="justify-content: left;">
                            <v-btn
                            :style="{ textTransform: 'none',fontWeight: 'bold' }"
                            class=" ml-3 mt-5"
                            size="large"
                            variant="text"
                            prepend-icon="mdi-google"
                            @click="googleSignIn()"
                        >
                            Sign in with Google
                        </v-btn>
                        </v-row>
            <v-row style="justify-content: left;">
                <v-col cols="5.5">
                    <v-text-field variant="outlined" label="Firstname" v-model="fname"/>
                </v-col>
                <v-col cols="5.1">
                    <v-text-field variant="outlined" label="Lastname" v-model="lname"/>
                </v-col>

            </v-row>
            <v-row style="justify-content: left;">
                <v-col cols="12">
                <v-text-field variant="outlined" label="Password" type="password" v-model="password"/>
                </v-col>
            </v-row>
            <v-row style="justify-content: center;">
                <v-btn
                    color="green"
                    size="large"
                    width="250"
                    class="mt-3"
                    @click="login()"
                    
                >
                    Login
                </v-btn>

            </v-row>
            <v-row style="justify-content: left;" class="mt-3 ml-1">
                <span class="text-red"> {{ errorMessage }} </span>
            </v-row>        
            <v-row style="justify-content: left;" class="ml-1 mt-10">
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
                        <v-row style="justify-content: center;">
                            <v-img src="logo.jpeg" class="mb-6" height="40"/> 
                        </v-row>
                    <v-row style="justify-content: left;" class="mt-5 ml-1">
                <span>Already have an account? </span>
                <v-btn
                    size="x-small"
                    class="ml-2 mt-1"
                    variant="tonal"
                    @click="window=!window"
                    
                >
                    Sign In
                </v-btn>
            </v-row>

                    <v-row style="justify-content: left;" class="mt-5">
                <v-col cols="6">
                    <v-text-field variant="outlined" label="Firstname" v-model="registerFname"/>
                </v-col>
                <v-col cols="6">
                    <v-text-field variant="outlined" label="Lastname" v-model="registerLname"/>
                </v-col>

            </v-row>
            <v-row style="justify-content: left;" class="mt-5">
                <v-col cols="13">
                    <v-text-field variant="outlined" label="Email" v-model="registerEmail"/>
                </v-col>
            </v-row>
            <v-row style="justify-content: left;" class="mt-5">
                <v-col cols="13">
                    <v-text-field variant="outlined" label="Password" type="password" v-model="registerPassword"/>
                </v-col>
            </v-row>
            <v-row style="justify-content: center;" class="mt-5">
                <v-btn
                    :disabled="isEmpty()"
                    color="green"
                    size="large"
                    width="250"
                    @click="registerUser()"
                    
                >
                    Register
                </v-btn>
            </v-row>
                </v-container>
                </v-sheet>

            </v-col>
        </v-row>
    </v-container>
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
    const registerFname = ref('')
    const registerLname = ref('')
    const registerEmail = ref('')
    const registerPassword = ref('')



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
            var emailBytes = encodeURI(registerEmail.value)
            // console.log(password.value)
            var encryptedEmail = base64.encode(emailBytes)
            var passwordBytes = encodeURI(registerPassword.value)
            var encryptedPassword = base64.encode(passwordBytes)
            const userForm = {
                fname: registerFname.value,
                lname: registerLname.value,
                email: encryptedEmail,
                email2: registerEmail.value,
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

    function isEmpty(){
        return registerFname.value === '' || registerLname.value === '' || registerEmail.value === '' || registerPassword.value === ''
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


  @media screen and (max-width: 600px) {
  .landing-page {
    flex-direction: column; /* Display elements vertically */
  }

  .brand-image {
    display: none; /* Hide brand image on mobile devices */
  }
}
  @media screen and (min-width: 767px) {
    .landing-page {
    flex-direction:row;
  }
    
  }

  @media only screen and (min-width: 920px) {
    .container{
        width: 80%;
    }
    
  }


</style>