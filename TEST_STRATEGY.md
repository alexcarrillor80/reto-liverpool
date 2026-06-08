# Test Strategy - Liverpool Automation Challenge

## 1. ¿Qué NO automatizaría en este flujo y por qué?
* **Banners de marketing y promociones de ofertas especiales:** Los carruseles promocionales y los gráficos de temporada cambian de forma dinámica e impredecible a través del CMS sin previo aviso del control de calidad. Las pruebas de estos elementos generan constantes falsos negativos.
* **Chats en vivo de terceros / Asistentes virtuales:** Las ventanas emergentes, como los bots de atención al cliente, suelen depender de scripts externos que pueden cargar lentamente o variar aleatoriamente su interfaz de usuario, lo que no aporta valor a las pruebas de flujo de extremo a extremo.
* **Tiempos de carga de imágenes exactos (carga diferida):** Las redes de distribución de contenido (CDN) introducen pequeñas latencias de renderizado basadas en la región. Es mejor validar la disponibilidad de datos en el DOM que los tiempos de carga visual.
* **Pasarelas de Pago reales (Checkout completo):** En la fase de pruebas automatizadas E2E sobre el entorno de producción, automatizar el ingreso de datos bancarios reales o simulados podría gatillar alarmas en los sistemas de detección de fraude del comercio electrónico o generar transacciones financieras innecesarias. Esto debe validarse utilizando mocks en entornos de Staging o a nivel API.

## 2. Si Liverpool agregara un CAPTCHA al flujo de búsqueda, ¿cómo lo manejarías?
Si se introduce un CAPTCHA (por ejemplo, reCAPTCHA o Cloudflare), las interacciones estándar de la interfaz de usuario fallarán. Abordaría esto mediante tres entornos/capas distintos:
* **Entornos de preproducción/QA:** Solicitar a los equipos de desarrollo/DevOps que desactiven completamente el CAPTCHA en los entornos de prueba o que incluyan en la lista blanca las claves de prueba de Google reCAPTCHA.
* **Lista blanca de WAF:** Si las pruebas deben realizarse en producción, coordinar con el equipo de seguridad para omitir el CAPTCHA para encabezados de automatización específicos (por ejemplo, `X-Automation-Bypass`) o direcciones IP fijas del ejecutor de CI/CD.
* **Inyección de token/cookie:** Inyectar una cookie de sesión preautenticada o un token de omisión activo directamente en el contexto del navegador de Playwright (`browserContext.addCookies()`) antes de iniciar el flujo de búsqueda.

## 3. ¿Qué riesgos de inestabilidad existen en esta prueba y cómo los mitigaste?
* **Hidratación asíncrona del front-end (React/Next.js):** Los elementos HTML pueden renderizarse en el DOM antes de que sus controladores de eventos JavaScript subyacentes se hayan vinculado por completo, lo que provoca que los botones no se puedan pulsar.
* *Solución:* Se implementaron estrategias estrictas de `page.waitForLoadState('networkidle')` dentro del Modelo de Objetos de Página (POM) después de cada acción de la interfaz de usuario para garantizar que la comunicación con el servidor se complete antes de analizar los datos.
* *Solución:* Se incorporó un mecanismo proactivo de gestión de superposiciones en la fase de configuración de la clase `SearchPage` para detectar y cerrar dinámicamente los elementos que bloquean el acceso.

## 4. Escalabilidad en una canalización de CI que ejecuta más de 50 conjuntos de pruebas
Para evitar cuellos de botella y mantener la velocidad de la integración continua, aplicaría la siguiente arquitectura:
* **Fragmentación nativa de Playwright:** Distribuye las pruebas en múltiples contenedores paralelos y efímeros dentro de GitHub Actions, reduciendo el tiempo total de ejecución en diferentes navegadores de horas a minutos.
* **Categorización de pruebas mediante etiquetas:** Etiqueta esta prueba específica como `@e2e-production`. Dado que depende de un sitio externo en producción, no debería bloquear las solicitudes de extracción de los desarrolladores si Liverpool experimenta una interrupción del servicio por parte de terceros. En su lugar, trasládala a una tarea programada (cada hora o cada noche) o a una canalización de implementación independiente.
* **Reintentos inteligentes y agregación de informes:** Configura los reintentos de ejecución exclusivamente para CI (`retries: 2`) junto con una política de archivo de artefactos aislada, separando las regresiones de productos externos de las comprobaciones internas de las solicitudes de extracción.