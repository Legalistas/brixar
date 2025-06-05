import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Limpia la tabla de países por si necesitamos reiniciar
  await prisma.country.deleteMany({});
  
  // Limpia y crea las monedas
  await prisma.currency.deleteMany({});
  
  console.log('🌱 Iniciando semilla de monedas...');
  
  // Crear monedas principales
  const currencies = [
    {
      code: 'USD',
      name: 'Dólar Estadounidense',
      symbol: '$',
      rate: 1000.0, // Tasa inicial en pesos argentinos (deberás actualizarla)
      flagCode: 'us',
      apiUrl: 'https://api.exchangerate-api.com/v4/latest/USD' // URL de ejemplo
    },
    {
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      rate: 1100.0, // Tasa inicial
      flagCode: 'eu',
      apiUrl: 'https://api.exchangerate-api.com/v4/latest/EUR'
    },
    {
      code: 'ARS',
      name: 'Peso Argentino',
      symbol: '$',
      rate: 1.0, // Moneda base
      flagCode: 'ar',
      apiUrl: null
    }
  ];

  for (const currency of currencies) {
    await prisma.currency.create({
      data: currency
    });
  }
  
  console.log('✅ Semilla de monedas completada exitosamente');
  
  // Lista de países a insertar (enfocados en Latinoamérica, España y otros relevantes)
  const countries = [
    { name: 'Argentina', prefix: '+54', code: 'AR' },
    { name: 'Brasil', prefix: '+55', code: 'BR' },
    { name: 'Chile', prefix: '+56', code: 'CL' },
    { name: 'Colombia', prefix: '+57', code: 'CO' },
    { name: 'España', prefix: '+34', code: 'ES' },
    { name: 'México', prefix: '+52', code: 'MX' },
    { name: 'Perú', prefix: '+51', code: 'PE' },
    { name: 'Uruguay', prefix: '+598', code: 'UY' },
    { name: 'Estados Unidos', prefix: '+1', code: 'US' },
    { name: 'Canadá', prefix: '+1', code: 'CA' },
    { name: 'Ecuador', prefix: '+593', code: 'EC' },
    { name: 'Bolivia', prefix: '+591', code: 'BO' },
    { name: 'Paraguay', prefix: '+595', code: 'PY' },
    { name: 'Venezuela', prefix: '+58', code: 'VE' },
    { name: 'Panamá', prefix: '+507', code: 'PA' },
    { name: 'Costa Rica', prefix: '+506', code: 'CR' },
    { name: 'República Dominicana', prefix: '+1', code: 'DO' },
    { name: 'Guatemala', prefix: '+502', code: 'GT' },
    { name: 'Honduras', prefix: '+504', code: 'HN' },
    { name: 'El Salvador', prefix: '+503', code: 'SV' },
    { name: 'Nicaragua', prefix: '+505', code: 'NI' }
  ];
  
  console.log('🌱 Iniciando semilla de países...');
  
  // Insertar países en la base de datos
  for (const country of countries) {
    await prisma.country.create({
      data: country
    });
  }
  
  console.log('✅ Semilla de países completada exitosamente');
  
  // También podemos agregar algunos estados/provincias para Argentina como ejemplo
  if (await prisma.country.findFirst({ where: { code: 'AR' } })) {
    const argentina = await prisma.country.findFirst({ where: { code: 'AR' } });
    
    if (argentina) {
      console.log('🌱 Agregando provincias de Argentina...');
      
      const provinces = [
        'Buenos Aires',
        'Ciudad Autónoma de Buenos Aires',
        'Catamarca',
        'Chaco',
        'Chubut',
        'Córdoba',
        'Corrientes',
        'Entre Ríos',
        'Formosa',
        'Jujuy',
        'La Pampa',
        'La Rioja',
        'Mendoza',
        'Misiones',
        'Neuquén',
        'Río Negro',
        'Salta',
        'San Juan',
        'San Luis',
        'Santa Cruz',
        'Santa Fe',
        'Santiago del Estero',
        'Tierra del Fuego',
        'Tucumán'
      ];
      
      for (const province of provinces) {
        await prisma.state.create({
          data: {
            name: province,
            countryId: argentina.id,
          }
        });
      }
      
      console.log('✅ Provincias de Argentina agregadas exitosamente');
    }
  }
}

main()
  .catch((e) => {
    console.error('Error en la ejecución de la semilla:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });