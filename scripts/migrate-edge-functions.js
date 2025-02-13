// Lista de Edge Functions a migrar
const edgeFunctions = [
  'auto-notifications',
  'chat',
  'create-checkout',
  'create-stripe-product',
  'facebook-events',
  'generate-certificate',
  'generate-with-ai',
  'send-welcome-notifications',
  'stripe-webhook',
  'update-public-file'
];

console.log('Para migrar las Edge Functions, sigue estos pasos:');
console.log('\n1. En el proyecto ORIGINAL:');
console.log('   - Ve a la sección Edge Functions');
console.log('   - Para cada función, haz clic en los 3 puntos y selecciona "Download"');
console.log('\n2. En el proyecto NUEVO:');
console.log('   - Ve a la sección Edge Functions');
console.log('   - Haz clic en "New Function"');
console.log('   - Copia el nombre exacto de la función original');
console.log('   - Sube el archivo descargado');
console.log('\nFunciones a migrar:');
edgeFunctions.forEach((func, index) => {
  console.log(`${index + 1}. ${func}`);
});

console.log('\nRecuerda configurar las variables de entorno necesarias para cada función en el nuevo proyecto.');
