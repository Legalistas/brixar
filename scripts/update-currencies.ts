import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateCurrencies() {
  console.log('🔄 Actualizando monedas...');
  
  try {
    // Primero, vamos a crear o actualizar las monedas principales
    const currencies = [
      {
        code: 'USD',
        name: 'Dólar Estadounidense',
        symbol: '$',
        rate: 1200.0, // Valor aproximado del dólar blue en pesos argentinos
        flagCode: 'us',
        apiUrl: 'https://api.bluelytics.com.ar/v2/latest' // API del dólar blue argentino
      },
      {
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
        rate: 1300.0, // Valor aproximado del euro
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
      const existingCurrency = await prisma.currency.findUnique({
        where: { code: currency.code }
      });

      if (existingCurrency) {
        // Actualizar si existe
        await prisma.currency.update({
          where: { code: currency.code },
          data: {
            name: currency.name,
            symbol: currency.symbol,
            rate: currency.rate,
            flagCode: currency.flagCode,
            apiUrl: currency.apiUrl
          }
        });
        console.log(`✅ Actualizada moneda: ${currency.code} - ${currency.name}`);
      } else {
        // Crear si no existe
        await prisma.currency.create({
          data: currency
        });
        console.log(`🆕 Creada moneda: ${currency.code} - ${currency.name}`);
      }
    }
    
    console.log('✅ Monedas actualizadas exitosamente');
    
    // Mostrar el estado actual de las monedas
    const allCurrencies = await prisma.currency.findMany();
    console.log('\n📊 Estado actual de las monedas:');
    allCurrencies.forEach(currency => {
      console.log(`${currency.code}: ${currency.name} - Tasa: ${currency.rate}`);
    });
    
  } catch (error) {
    console.error('❌ Error actualizando monedas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateCurrencies();
