<template>
    <v-container style="justify-content: center;" class="mt-16">
      <v-col>
        <v-text-field
          v-model="notes.topic" 
          label="Title"
          variant="solo"
          clearable
        />
        <v-textarea
        v-model="notes.content"
        clearable
        variant="solo"
        label="Content"
        counter
        auto-grow=true
      />  
      </v-col>
    </v-container>
    <v-container style="justify-content: center;">
      <v-row style="justify-content: center;">
        <v-btn
        size="x-large"
        color="#FBA797"
        class="mr-1"
        append-icon="mdi-content-save-outline"
        @click="setNotes(),snackbar=true"
      >
        Save
      </v-btn>
      <v-snackbar
        color="green"
        v-model="snackbar"
      >
        Your notes have been saved
  
        <template v-slot:actions>
          <v-btn
            color="red"
            variant="text"
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
      <v-btn
        size="x-large"
        color="grey"
        append-icon="mdi-robot-happy"
        @click="synthesize()"
      >
        Synthesize
      </v-btn>   


      </v-row>
    </v-container>
    <v-container style="justify-content: center; max-height: 100px;" class="mt-10">
      <v-row style="justify-content: center;">
        <v-card-title v-if="generateArea" class="mt-10 font-weight-bold">
        Generated Notes
      </v-card-title>
      </v-row>
    </v-container>
    <v-container style="justify-content: center;">
      <v-sheet v-if="generateArea" color="grey-lighten-2" class="rounded-shaped mb-16">
        <v-col align="left" v-for="(value,i) in text" >
        <span>          
          <v-icon color="green" icon="mdi-circle-small"/>{{ value }}
        </span>
      </v-col>


      </v-sheet>
    </v-container>
  </template>
  <script setup>
    import OpenAI from 'openai';
    import {useUserProfile} from '~/store/store'
    import base64 from 'base-64'
    // import dotenv from 'dotenv';
    // dotenv.config()
  
    const user = useUserProfile()
    const loading =ref(false)

    onMounted(async ()=>{
      await user.getApiKey()
    })
    // console.log(user.getApiKey())
  
    const notes=ref({
      topic:"",
      content: ""
    })
    const snackbar = ref(false)
    const text = ref([])
    const generateArea = ref(false)

  
    function setNotes(){
      // console.log(user.email)
      const bytes = encodeURI(user.email)
      const uid = base64.encode(bytes)
      return user.writeUserNotes(notes.value,uid)
    }

    function setGeneratedNotes(response){
      const bytes = encodeURI(user.email)
      const uid = base64.encode(bytes)
      return user.writeGeneratedNotes(notes.value,uid,response)
    }

    function synthesize(){
      try{
        const openai = new OpenAI({
        apiKey: user.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
        dangerouslyAllowBrowser: true,
        });
      
        async function main() {
          const completion = await openai.chat.completions.create({
            messages: [
              { role: 'system', content: 'You are a helpful learning assistant tailored for the Jamaican populous. Given content from a user you will extract meaningful keywords and synthesize an easy to follow summary in point format.' },
              { role: 'user', content: notes.value.content }
            ],
            model: 'gpt-3.5-turbo',
          });
          const response = completion.choices[0].message.content
          // setNotes()
          setGeneratedNotes(response)
          // console.log(response)
          text.value = response.split('-')
          generateArea.value = true
          

        }

        main()
      }
      catch(err){
        console.error(err)
      }

    }  
  
  </script>
  