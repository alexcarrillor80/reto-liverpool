import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Directorio donde Playwright buscará tus archivos de prueba (.spec.ts)
  testDir: './tests',

  // BONUS: Ejecutar pruebas en paralelo para optimizar tiempos en CI/CD
  fullyParallel: true,

  // Si estás en la nube (GitHub Actions), falla inmediatamente si dejaste un .only en tu código
  forbidOnly: !!process.env.CI,

  // Mitigación de Flakiness: Si una prueba falla en CI, Playwright la reintenta automáticamente hasta 2 veces
  retries: process.env.CI ? 2 : 0,

  // Número de hilos simultáneos. En CI limitamos a 2 para no saturar las máquinas virtuales de GitHub
  workers: process.env.CI ? 2 : undefined,

  // PARTE 3: Generación obligatoria del reporte en formato HTML
  reporter: [['html', { open: 'never' }]],

  // Configuraciones globales para los navegadores
  use: {
    // URL base para no tener que escribirla completa en cada comando page.goto()
    baseURL: 'https://www.liverpool.com.mx',

    // PARTE 1: Ejecución en segundo plano (headless) por defecto
    headless: true,

    // Captura un video/traza solo si la prueba falla al primer intento (útil para depurar)
    trace: 'on-first-retry',

    // PARTE 3: Capturas de pantalla AUTOMÁTICAS solo cuando una prueba falla
    screenshot: 'only-on-failure',
    
    // Configuración del tamaño de pantalla estándar de escritorio
    viewport: { width: 1280, height: 720 },
  },

  // BONUS: Ejecución multiplataforma (Matriz de navegadores en paralelo)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
