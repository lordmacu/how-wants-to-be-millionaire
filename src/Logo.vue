<template>
    <div class="logo">
      <!-- Texto en curva -->
      <div class="curved-text">
        <span 
          v-for="(letter, index) in text.split('')" 
          :key="index" 
          :style="getLetterStyle(index, text.length)"
        >
          {{ letter }}
        </span>
      </div>
  
      <!-- Imagen del logo -->
      <img src="/img/logo.svg" class="logo-img" />
  
      <!-- Texto abajo -->
      <div class="millonario-text">BIBLIONARIO</div>
    </div>
  </template>
  
  <script setup>
  import { computed } from "vue";
  
  const text = "QUIEN QUIERE SER";
  const diameter = 130; // Tamaño del círculo en píxeles
  const radius = diameter / 2 - 10; // Se resta un margen para mejor ajuste
  
  /**
   * Calcula la posición de cada letra en el arco
   */
  const getLetterStyle = (index, total) => {
    const angleStep = 180 / (total - 1); // Espaciado entre letras en el arco
    const angle = -90 + index * angleStep; // Desde -90° hasta 90°
  
    return {
      position: "absolute",
      transformOrigin: `center ${radius}px`,
      transform: `rotate(${angle}deg) translateY(-${radius}px)`,
      fontSize: "11px",
      fontWeight: "bold",
    };
  };
  </script>
  
  <style scoped>
  .logo {
    position: relative;
    width: 180px;
    height: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 60px;
    margin-top: 20px;
  }
  
  .logo-img {
    width: 250px;  
    height: 250px;
  }
  
  .curved-text {
    position: absolute;
    top: 80px; /* Ajuste fino para alinear el texto */
    width: 250px;
    height: 100px; /* La mitad del círculo */
    display: flex;
    justify-content: center;
    color: white;
  }
  
  .curved-text span {
    display: inline-block;
  }
  </style>
  