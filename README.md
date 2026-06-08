# 🛒 Reto de Automatización - Liverpool E2E & API Validation

Este proyecto contiene la automatización de un flujo completo de comercio electrónico en la plataforma de Liverpool México para el **Hot Sale 2026**. Desarrollado con **Playwright Test** y **TypeScript**, aplicando el patrón de diseño **Page Object Model (POM)**, intercepción de red (Network Interception) y pipelines de CI/CD.

---

## 🚀 Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu equipo local antes de ejecutar el proyecto:
* [Node.js](https://nodejs.org/) (Versión 18, 20 o superior)
* [Git](https://git-scm.com/)

---

## 📦 Instalación y Configuración Local

Sigue estos pasos para clonar el repositorio e instalar las dependencias necesarias:

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/alexcarrillor80/reto-liverpool.git
   cd reto-liverpool
   ```


2. **Instalar dependencias del proyecto:**

```bash
npm install
```

3. **Instalar los binarios de los navegadores de Playwright:**

```bash
npx playwright install
```

## 💻 Modos de Ejecución

De acuerdo con los requerimientos del reto, la suite está configurada para ejecutarse en paralelo a través de múltiples navegadores (Chromium y Firefox).

1. **Ejecución en Modo Headless (Por defecto / CI/CD)**
Ideal para ejecuciones rápidas en segundo plano o entornos de integración continua:

```bash
npx playwright test
```

2. **Ejecución en Modo Headed (Con Interfaz Gráfica)**
Permite visualizar la interacción del navegador en tiempo real:

```bash
npx playwright test --headed
```

3. **Visualización de Reportes**
Al finalizar la ejecución, puedes desplegar el reporte interactivo HTML integrado de Playwright ejecutando:

```bash
npx playwright show-report
```

## 📊 Integración Continua (CI/CD)

El proyecto incluye un flujo de trabajo completamente funcional en GitHub Actions (.github/workflows/test.yml) que instala las dependencias en un entorno limpio, ejecuta las pruebas automatizadas de forma headless y almacena los reportes HTML generados como artefactos descargables.

Historial de Ejecución: Puedes validar la última corrida exitosa de la suite directamente en la pestaña Actions de este repositorio o haciendo clic en el siguiente enlace:

[👉 Ver GitHub Actions Run](https://github.com/alexcarrillor80/reto-liverpool/actions)

🏗️ Estructura del Framework (POM)

* pages/SearchPage.ts: Encapsula los localizadores dinámicos, el manejo de esperas visuales resilientes (waitFor({ state: 'visible' })) y los métodos de negocio (buscar, filtrar, ordenar y mapear el catálogo).

* tests/search.spec.ts: Contiene el flujo secuencial E2E e implementa la técnica asíncrona Promise.all para interceptar las respuestas JSON del backend en tiempo real, procesando la validación cruzada entre la UI y la API.

* TEST_STRATEGY.md: Documento estratégico requerido con las justificaciones arquitectónicas, mitigación de flakiness y estrategias de escalabilidad para el pipeline.