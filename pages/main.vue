<template>
  <v-container style="height:100%;justify-content: center;">
    <v-row no-gutters class="mt-5 " align="center" >
      <v-col cols="4" class="mr-n16">
        <v-btn
        width="200"
        height="200"
        prepend-icon="mdi-upload"
      >
        Upload Notes 
      </v-btn>
      </v-col>
      <v-col cols="4" class="mr-n16">
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
            prepend-icon="mdi-plus"
            @click="dialog=!dialog"
            v-bind="props"
          >
            Create New Notes
          </v-btn>  
        </template>
        <v-card>
            <v-toolbar>
              <v-btn @click="dialog=!dialog" icon="mdi-close"/>
              <v-toolbar-title> 
                New Note <v-icon icon="mdi-note-text"/>
              </v-toolbar-title>

            </v-toolbar>
            <Notes/>

          </v-card>       

        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
  import Notes from "~/components/Notes.vue"
  import { useUserProfile } from "~/store/store";

  // const user = useUserProfile()
  const dialog = ref(false)
</script>