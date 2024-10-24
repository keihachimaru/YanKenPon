<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  data() {
    return {}
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style>
:root {
  /* Primary color */
  --primary: rgb(109, 111, 240);
  
  /* Derived colors */
  --primary-light: rgb(155, 157, 250);  /* Lighter version of primary */
  --primary-dark: rgb(80, 82, 220);     /* Darker version of primary */
  
  /* Secondary color */
  --secondary: rgb(240, 111, 109);      /* Complementary reddish color */
  --secondary-light: rgb(250, 155, 157);
  --secondary-dark: rgb(220, 80, 82);
  
  /* Background and text colors */
  --background: rgb(245, 245, 250);     /* Light, neutral background */
  --background-dark: rgb(225, 225, 230);/* Darker background variant */
  --text: rgb(35, 35, 50);              /* Dark text */
  --text-light: rgb(255, 255, 255);     /* Light text, for dark backgrounds */
  
  /* Accent colors */
  --accent: rgb(109, 240, 220);         /* Teal accent */
  --accent-light: rgb(155, 250, 240);
  --accent-dark: rgb(80, 220, 200);
  
  /* Shadows and borders */
  --border: rgb(200, 200, 220);
  --shadow: rgba(0, 0, 0, 0.2);

  /* Font */
  --text-font: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
#app {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  aspect-ratio: 9/16;
}
html, body {
  margin: 0px;
  padding: 0px;
  height: 100vh;
  width: 100%;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
}
div {
  box-sizing: border-box;
}
</style>
