<template>
  <v-row style="justify-content: center;" class="mt-16">
    <v-col cols="5">
      <v-textarea
      v-model="notes.text"
      clearable
      variant="solo"
      counter
    />
    <v-btn
      size="x-large"
      color="green"
      @click="setNotes(notes),snackbar=true"
    >
      Save <v-icon icon="mdi-content-save-outline"/>
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

    </v-col>

  </v-row>
</template>
<script setup>
  import OpenAI from 'openai';
  import {useUserProfile} from '~/store/store'

  const user = useUserProfile()
  // console.log(user.getApiKey())

  const notes=ref({
    text:""
  })
  const snackbar = ref(false)

  async function setNotes(notes){
    await user.writeNotes(notes)
  }

  // const openai = new OpenAI({
  // apiKey: "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", // defaults to process.env["OPENAI_API_KEY"]
  // dangerouslyAllowBrowser: true,
  // });

// async function main() {
//   const completion = await openai.chat.completions.create({
//     messages: [{ role: 'user', content: 'Who was the 42nd president of the US?' }],
//     model: 'gpt-3.5-turbo',
//   });

//   console.log(completion.choices[0].message.content);
// }

// main();


</script>
