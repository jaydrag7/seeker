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
        </v-snackbar>

      </v-row>
    </v-container>
    <v-container v-if="generateArea" style="justify-content: center; max-height: 100px;" class="mt-10">
      <v-row style="justify-content: center;">
        <v-card-title class="mt-10 font-weight-bold">
        Generated Notes
      </v-card-title>
      </v-row>
    </v-container>
    <v-container v-if="generateArea" style="justify-content: center;">
      <v-sheet color="grey-lighten-2" class="rounded-shaped mb-5">
        <v-col align="left" v-for="(value,i) in summary" >
        <span>          
          <v-icon color="green" icon="mdi-circle-small"/>{{ value }}
        </span>
      </v-col>
      </v-sheet>
    </v-container>
    <v-container v-if="generateArea" style="justify-content: center;">
      <v-row style="justify-content: center;">
        <v-card-title class="font-weight-bold">
          Mind Map
        </v-card-title>
      </v-row>
      <MindMap :map="mapContent"/>
    </v-container>
  </template>
  <script setup>
    import MindMap  from '~/components/MindMap.vue';
    import {GoogleGenerativeAI } from "@google/generative-ai"
    // import OpenAI from 'openai';
    import {useUserProfile} from '~/store/store'
    import base64 from 'base-64'
  
    const user = useUserProfile()
    const loading =ref(false)
    const generatedLoading =ref(false)


    onMounted(async ()=>{
      await user.getApiKey()
    })
    // console.log(user.getApiKey())
  
    const notes=ref({
      topic:"",
      content: ""
    })
    const snackbar = ref(false)
    const snackbar2 = ref(false)
    const summary = ref([])
    const generateArea = ref(false)
    const mapContent = ref('')
    
    async function saveUserNotes(){
      // console.log(user.email)
      loading.value = true
      const bytes = encodeURI(user.email)
      const uid = base64.encode(bytes)
      try {
        await user.writeUserNotes(notes.value, uid)        
      } catch (error) {
          console.error(error)
        } finally {
          setTimeout(() => (loading.value = false, 
          snackbar.value = true), 3000)
      }    
    }

    async function saveAllNotes(){
      // console.log(user.email)
      const bytes = encodeURI(user.email)
      const uid = base64.encode(bytes)
      try {
        return await user.writeUserNotes(notes.value, uid)
      } catch (error) {
          console.error(error)
        } 
    }


    async function setGeneratedNotes(response,map){
      const bytes = encodeURI(user.email)
      const uid = base64.encode(bytes)
      return await user.writeGeneratedNotes(notes.value,uid,response,map)
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
          const model = genAI.getGenerativeModel({model: "gemini-pro"})
          const prompt = `You are a helpful learning assistant. From the text, synthesize an easy-to-follow
                           summary in point format. Precede the points with *. For example, 
                           *Confocal microscopy can generate detailed three dimensional representations of cells.
                           *Many cell biologists work at the intersection of multiple subfields.
                           You do not have to include a *Keywords: * or *Summary: * tag, just the points.
                           If a point has further subpoints just list the subpoints separated by commas after the main point. 
                           For example, *Main Point: subpoint 1, subpoint 2, etc, instead of, *Main Point: *subpoint 1, 
                           *subpoint 2, *etc.
                           Here is the text:${notes.value.content} `
          const result = await model.generateContent(prompt)
          const response = await result.response
          const text = response.text()
          // console.log(text)
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
          // console.log(mindMap.replace(/^```|```$/g, ''))
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
  
  </script>
  