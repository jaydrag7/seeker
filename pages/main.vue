<template>
  <v-container style="justify-content: center;">
    <v-row>
      <v-img src="logo.jpeg" class="mb-6" height="90"/> 
    </v-row>
    <v-row justify-lg="center">
      <v-toolbar
      color="#FFEFC8"
    >
      <v-row class="container">
        <v-card-title style="justify-content: center;" v-if="user.fname" class="text-h5 font-weight-bold">
          Hi {{ user.fname }}!
        </v-card-title> 
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
              <v-list-item>
                <v-list-item-title>
                  <v-dialog
                    height="500"
                    width="500"
                    scrollable
                    scrim
                    v-model="deleteDialog"
                  >
                  <template v-slot:activator="{props}">
                    <v-btn
                      @click="deleteDialog=!deleteDialog"
                      v-bind="props"
                      variant="text"
                      append-icon="mdi-delete"
                    >
                      Delete Note
                    </v-btn>  
                  </template>
                  <v-card
                    width="500"
                  >
                      <v-toolbar color="#FBA797">
                        <v-btn @click="deleteDialog=!deleteDialog" icon="mdi-close"/>
                        <v-toolbar-title> 
                          Delete Note
                        </v-toolbar-title>
                      </v-toolbar>
                        <v-col v-if="user.userNotes" v-for="(value,i) in user.userNotes">
                          {{ value.topic }} <v-btn icon="mdi-delete" color="red" append-icon="mdi-delete" variant="tonal" @click="removeNote(value.topic)"/>
                        </v-col>
                      <v-snackbar
                        color="green"
                        v-model="deleteSnackbar"
                      >
                        Note successfully deleted
                  
                        <template v-slot:actions>
                          <v-btn
                            variant="text"
                            @click="deleteSnackbar = false"
                          >
                            Close
                          </v-btn>
                        </template>
                      </v-snackbar>
                    </v-card>       
                  </v-dialog>
                </v-list-item-title>
              </v-list-item>

            </v-list>
        </v-menu>
      </v-row>
    </v-toolbar>
    </v-row>

    <v-row class="container">
      <v-btn
        width="200"
        height="200"
        class="mt-16 mr-1"
        color="#FBA797"
      >
      <v-row class="container">
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
          <v-row class="container">
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
    <v-container style="width: 350px;" class="container mt-7">
    <v-row>

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
      <v-container style="justify-content: center;" class="mt-10">
        <v-row style="justify-content: center;">
          <v-card-title class="text-h5 font-weight-bold">
          Your Notes
        </v-card-title>
        </v-row>
      </v-container>
      <v-container style="justify-content: center;" class="mt-16">
          <v-textarea
          class="mt-n16"
          :model-value="noteObj.content"
          v-model="newContent"
          variant="solo"
          counter
          auto-grow=true
        />
      </v-container>
      <v-container>
        <v-row style="justify-content: center;">
          <v-btn
        :disabled="loading"
        :loading="loading"
        size="x-large"
        color="#FBA797"
        class="mr-1"
        append-icon="mdi-content-save-outline"
        @click="saveUserNotes()"
      >
        Save
      </v-btn>
      <v-snackbar
        color="green"
        v-model="snackbar"
      >
        Your note is saved
  
        <template v-slot:actions>
          <v-btn
            variant="text"
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
      <v-btn
        :disabled="generatedLoading"
        :loading="generatedLoading"
        size="x-large"
        color="grey"
        append-icon="mdi-robot-happy"
        @click="synthesize()"
      >
        Synthesize
      </v-btn>
      <v-snackbar
        color="green"
        v-model="snackbar2"
      >
        Your note is saved
  
        <template v-slot:actions>
          <v-btn
            variant="text"
            @click="snackbar2 = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
        </v-row>
      </v-container>
      <v-row v-if="noteObj.generatedResponse || generateArea" style="justify-content: center;" class="mt-10">
        <v-card-title style="justify-content: center;" class="text-h5 font-weight-bold">
          Generated Notes
        </v-card-title>
      </v-row>
      <v-container  
        v-if="noteObj.generatedResponse || generateArea" 
        style="justify-content: center;" 
        class="mt-10" 
        >
        <v-sheet color="grey-lighten-2" class="rounded-shaped mb-16">
          <v-col align="left" v-for="(value,i) in (generateArea ? summary : (noteObj.generatedResponse ? noteObj.generatedResponse.split('*') : null)) ">
            <span>
          <v-icon color="green" icon="mdi-circle-small"/>{{ value }}
        </span>
          </v-col>
        </v-sheet>
      </v-container>
      <v-row v-if="noteObj.mindMap || generateArea" style="justify-content: center;" class="mt-10">
        <v-card-title class="text-h5 font-weight-bold">
          Mind Map
        </v-card-title>
      </v-row>
      <v-row
        v-if="noteObj.mindMap || generateArea" 
        style="justify-content: center;" 
      >
        <MindMap v-if="noteObj.mindMap" :map="noteObj.mindMap" class="mb-7"/>
        <MindMap v-if="generateArea" :map="mapContent" class="mb-7"/>
      </v-row>
    </v-card>

    </v-dialog>

    </v-row>
    </v-container>
  </v-container>
</template>
<script setup>
  import Notes from "~/components/Notes.vue"
  import { useUserProfile } from "~/store/store"
  import base64 from 'base-64'
  import MindMap  from '~/components/MindMap.vue'
  import {GoogleGenerativeAI } from "@google/generative-ai"



  const user = useUserProfile()
  onMounted(async()=>{
    await getNotes()
    await user.getApiKey()
    placeTopics()
    // console.log(user.userNotes)
  })
  const noteObj = ref({})
  const noteTitle = ref('')
  // const noteArr = ref([])
  // const edit = ref('')

  const notes = ref([])
  const note = ref(false)
  const newContent = ref('')
  const  deleteDialog = ref(false)

  function goToNote(item){
    noteTitle.value = item
    noteObj.value = user.userNotes[item]
    const text = noteObj.value
    newContent.value = text.content
    note.value = true
  }
  async function getNotes(){
    const userEmail = user.email
    const bytes = encodeURI(userEmail)
    const encrypt = base64.encode(bytes)
    await user.getUserNotes(encrypt)
  }

  const loading =ref(false)
  const snackbar = ref(false)
  const snackbar2 = ref(false)
  const deleteSnackbar = ref(false)
  const generatedLoading =ref(false)
  const generateArea = ref(false)
  const mapContent = ref('')
  const summary = ref([])

  function saveUserNotes(){
      // console.log(user.email)
      loading.value = true
      const bytes = encodeURI(user.email)
      const uid = base64.encode(bytes)
      const content = newContent.value
      const noteMeta = {
        topic: noteTitle.value,
        content: content
      }
      try {
        user.writeUserNotes(noteMeta, uid)
      } catch (error) {
          console.error(error)
        } finally {
          setTimeout(() => (loading.value = false, 
          snackbar.value = true), 3000)
      }    
    }
  async function removeNote(topic){
    const bytes = encodeURI(user.email)
    const uid = base64.encode(bytes)

    try{
      deleteSnackbar.value = true
      return await user.deleteNote(topic,uid)

    }catch(err){
      console.error(err)
    }
  }
  
  async function saveAllNotes(){
    // console.log(user.email)
    const bytes = encodeURI(user.email)
    const uid = base64.encode(bytes)
    const content = newContent.value
    const noteMeta = {
        topic: noteTitle.value,
        content: content
      }
    try {
      return await user.writeUserNotes(noteMeta, uid)
    } catch (error) {
        console.error(error)
      } 
  }

  async function setGeneratedNotes(response,map){
    const bytes = encodeURI(user.email)
    const uid = base64.encode(bytes)
    const content = newContent.value
    const noteMeta = {
        topic: noteTitle.value,
        content: content
      }

    return await user.writeGeneratedNotes(noteMeta,uid,response,map)
  }

  function synthesize(){
      generatedLoading.value = true
      try{
        const genAI = new GoogleGenerativeAI(user.GGAI_API_KEY)
        // const openai = new OpenAI({
        // apiKey: user.OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
        // dangerouslyAllowBrowser: true,
        // });
      
        async function main() {
          const content = newContent.value
          const model = genAI.getGenerativeModel({model: "gemini-pro"})
          const prompt = `You are a helpful learning assistant. From the text, synthesize an easy-to-follow
                           summary in point format. Precede the points with *. For example, 
                           *Confocal microscopy can generate detailed three dimensional representations of cells.
                           *Many cell biologists work at the intersection of multiple subfields.
                           You do not have to include a *Keywords: * or *Summary: * tag, just the points.
                           If a point has further subpoints just list the subpoints separated by commas after the main point. 
                           For example, *Main Point: subpoint 1, subpoint 2, etc, instead of, *Main Point: *subpoint 1, 
                           *subpoint 2, *etc.
                           Here is the text:${content}`
          const result = await model.generateContent(prompt)
          const response = await result.response
          const text = response.text()
          console.log(text)
          summary.value = text.split('*')
          const mapPrompt = `Generate a mind map from the given points using the markmap library syntax.
                              Ensure to create a general heading for the mind map.
                              Here is an example of the markup library syntax:
                
                              # Main Heading
                                # content1
                                  - subcontent1
                                  - subcontent2
                              # content2
                              # content3
                              # content4

                              Here are the points: ${summary.value}`
          const mapResult = await model.generateContent(mapPrompt)
          const mapResponse = await mapResult.response
          const mindMap = mapResponse.text()
          mapContent.value = mindMap.replace(/^```|```$/g, '')
          await saveAllNotes()
          await setGeneratedNotes(text,mapContent.value)
          console.log(mindMap.replace(/^```|```$/g, ''))
          // const completion = await openai.chat.completions.create({
          //   messages: [
          //     { role: 'system', content: 'You are a helpful learning assistant. From the text extract meaningful keywords and synthesize an easy to follow summary in point format.' },
          //     { role: 'user', content: notes.value.content }
          //   ],
          //   model: 'gpt-3.5-turbo',
          // });
          // const response = completion.choices[0].message.content
          // // setNotes()
          // setGeneratedNotes(response)
          // // console.log(response)
          // text.value = response.split('-')
          // generateArea.value = true
        }

        main()
      }
      catch(err){
        console.error(err)
      }finally {
          setTimeout(() => (generatedLoading.value = false, 
          snackbar2.value = true), 3000)
          generateArea.value = true

      }    
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
  .container {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>