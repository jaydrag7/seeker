<template>

    <svg style="min-width: 800px; min-height: 500px;" ref="svgRef" class=""></svg>

</template>
  
<script setup>
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';

  const props = defineProps({
    map:String
  })
  
  const transformer = new Transformer();

  const svgRef = ref();
  const value = ref(props.map);
    let mm;

    const update = () => {
      const { root } = transformer.transform(value.value);
      // console.log(value.value)
      mm.setData(root);
      mm.fit();      
    };
  
    onMounted(() => {
      mm = Markmap.create(svgRef.value);
      update();
    });  

    watch(() => props.map, (newMapValue) => {
  value.value = newMapValue;
  update();

});

</script>
<style>
  .container {
  display: flex;
  justify-content: center;
  align-items: center;
  max-height:850px;
}

</style>
  