<template>
  <v-container style="height:100%;justify-content: center;">
    <v-row style="justify-content: center;">
      <v-img src="logo.jpeg" class="mb-6" height="90"/> 
    </v-row>
    <v-toolbar
      color="#FFEFC8"
      class="ml-16"
    >
      <v-row no-gutters class="font-weight-bold text-h5 ml-16">
        <v-spacer/>
        <v-spacer/>
        <v-spacer/>
        <span v-if="user.fname" class="mr-n16">Welcome Back {{ user.fname }} !</span> 
        <v-img src="wave.gif" height="30" class="ml-8"/>
        <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn variant="text" icon="mdi-menu" v-bind="props"></v-btn>
            </template>

            <v-list>
              <v-list-item>
                <v-list-item-title>
                    <v-btn variant="text" append-icon="mdi-logout" @click="logout">
                        Logout
                    </v-btn>
                </v-list-item-title>
              </v-list-item>
            </v-list>
        </v-menu>
      </v-row>
      <v-spacer/>
    </v-toolbar>
    <v-row style="justify-content: center;" class="mt-16">
      <v-btn
        width="200"
        height="200"
        class="mr-5 mt-16"
        color="#FBA797"
      >
      <v-row>
            <v-col>
              <v-img src="submit.png" height="65"/>
            </v-col>
            <v-col>
              Upload New Notes
            </v-col>

          </v-row>

      </v-btn>
      <v-dialog
          scrollable
          fullscreen
          scrim
          v-model="dialog"
        >
        <template v-slot:activator="{props}">
          <v-btn
            width="200"
            height="200"
            @click="dialog=!dialog"
            v-bind="props"
            class="mt-16"
            color="#FBA797"
          >
          <v-row>
            <v-col>
              <v-img src="notebook.png" height="65"/>
            </v-col>
            <v-col>
              Create New Notes
            </v-col>

          </v-row>
          </v-btn>  
        </template>
        <v-card>
            <v-toolbar color="#FBA797">
              <v-btn @click="dialog=!dialog" icon="mdi-close"/>
              <v-toolbar-title> 
                New Note <v-icon icon="mdi-note-text"/>
              </v-toolbar-title>

            </v-toolbar>
            <Notes/>

          </v-card>       

        </v-dialog>

    </v-row>
    <v-row style="justify-content: center;" class="mt-10">
      <v-col cols="5">
        <v-combobox 
        variant="solo" 
        label="Notes Deck"
        :items="notes"
        
      >
      <template v-slot:item="{ item }">
    <v-list-item @click="goToNote(item.title)">
      {{ item.title }}
    </v-list-item>
    </template>

      </v-combobox>
      <v-dialog
      v-model="note"
      fullscreen
      scrollable
    >
    <v-card color="">
      <v-toolbar color="#FBA797">
        <v-btn @click="note=!note" icon="mdi-close"/>
        {{ noteTitle }}
      </v-toolbar>
      <v-row style="justify-content: center;" class="mt-10 pa-0">
        <v-card-title class="text-h5 font-weight-bold">
          Your Notes
        </v-card-title>
      </v-row>
      <v-row style="justify-content: center;" class="">
        <v-col cols="5" class="">
          <v-textarea
          class="mt-10"
          :model-value="noteObj.content"
          variant="solo"
          counter
          auto-grow=true
        />
        </v-col>
      </v-row>
      <v-row v-if="noteObj.generatedResponse" style="justify-content: center;" class="mt-10">
        <v-card-title class="text-h5 font-weight-bold">
          Generated Notes
        </v-card-title>
      </v-row>
      <v-row  
        v-if="noteObj.generatedResponse" 
        style="justify-content: center;" 
        class="mt-10" 
        >
        <v-sheet color="grey-lighten-2" class="rounded-shaped mb-16" width="900">
          <v-col class="ml-16" cols="10" align="left" v-for="(value,i) in noteObj.generatedResponse.split('-')">
            <span>
          <v-icon color="green" icon="mdi-circle-small"/>{{ value }}
        </span>
          </v-col>
        </v-sheet>
      </v-row>
    </v-card>


    </v-dialog>

      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
  import Notes from "~/components/Notes.vue"
  import { useUserProfile } from "~/store/store"
  import base64 from 'base-64'

  const user = useUserProfile()
  onMounted(async()=>{
    await getNotes()
    placeTopics()
    // console.log(user.userNotes)
  })
  const noteObj = ref({})
  const noteTitle = ref('')
  // const noteArr = ref([])
  // const edit = ref('')

  const notes = ref([])
  const note = ref(false)
  function goToNote(item){
    noteTitle.value = item
    noteObj.value = user.userNotes[item]
    note.value = true
  }
  async function getNotes(){
    const userEmail = user.email
    const bytes = encodeURI(userEmail)
    const encrypt = base64.encode(bytes)
    await user.getUserNotes(encrypt)
  }

  function placeTopics(){
    const topics = Object.keys(user.userNotes)
    for(let i = 0; i<topics.length; i++){
      notes.value.push(topics[i])
    }
    // console.log(notes.value)

  }

  function logout(){
    //$router.push({path:'/'})
    window.location.href = '/'
  }
  // function formatText(){
  //   noteArr.value = noteObj.value.generatedResponse.split('-')
  // }
  const dialog = ref(false)
</script>
<style>
  body{
    background-color: #FFEFC8;
  }
</style>