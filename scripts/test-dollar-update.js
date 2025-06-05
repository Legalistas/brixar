// Script para probar la actualización del dólar
const testDollarUpdate = async () => {
  try {
    console.log('Probando actualización del dólar...');
    
    const response = await fetch('http://localhost:3000/api/currencies/update-dollar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    console.log('Respuesta:', data);
    
    if (data.success) {
      console.log(`✅ Dólar actualizado: $${data.rate}`);
    } else {
      console.log('❌ Error en la actualización:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

// Ejecutar si estamos en un entorno de navegador
if (typeof window !== 'undefined') {
  testDollarUpdate();
}

export default testDollarUpdate;
