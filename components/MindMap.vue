<template>

    <svg style="min-width: 800px; min-height: 300px;" ref="svgRef" class="mt-n5"></svg>

</template>
  
  <script setup>
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';

const transformer = new Transformer();
const initValue = `# markmap

## beautiful
  - nature
    - trees
    - animals
## useful
## easy
## interactive
`;

const svgRef = ref();
    const value = ref(initValue);
    let mm;

    const update = () => {
      const { root } = transformer.transform(value.value);
      mm.setData(root);
      mm.fit();      
    };


  
    onMounted(() => {
      mm = Markmap.create(svgRef.value);
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
  