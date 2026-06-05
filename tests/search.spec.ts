import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';

test.describe('Liverpool - Validaciones E2E y de Red', () => {

  test('Buscar Playstation 5, filtrar, ordenar y validar contra API', async ({ page }) => {
    const searchPage = new SearchPage(page);
    let apiResponseData: any = null;

    // PARTE 2: Interceptar la respuesta de la API antes de que la UI la reciba
    // Nota: El patrón '**/plp/v3**' intercepta las llamadas de búsqueda/paginación de Liverpool
    await page.route('**/plp/v3**', async (route) => {
      const response = await route.fetch();
      if (response.status() === 200) {
        apiResponseData = await response.json();
      }
      await route.continue();
    });

    // PARTE 1: Flujo de Usuario usando el Page Object
    await searchPage.navigate();
    await searchPage.searchProduct('playstation 5');
    await searchPage.filterByWhite();
    await searchPage.sortByPriceLowest();

    // Extracción de los 5 primeros resultados de la UI
    const uiResults = await searchPage.getTopProducts(5);
    console.log('--- Productos extraídos de la UI ---');
    console.table(uiResults);

    // PARTE 2: Validación Cruzada (UI vs API)
    expect(apiResponseData).not.toBeNull();
    
    // Extraer nombres de productos devueltos por el servidor (Estructura simulada de la API)
    const apiProducts = apiResponseData.plpResults?.records || [];
    const apiProductNames = apiProducts.map((p: any) => p.productDisplayName.toLowerCase());

    let coincidencias = 0;
    for (const uiProduct of uiResults) {
      const existeEnAPI = apiProductNames.some((apiName: string) => 
        apiName.includes(uiProduct.name.toLowerCase())
      );

      if (existeEnAPI) {
        coincidencias++;
      } else {
        console.warn(`[DISCREPANCIA]: "${uiProduct.name}" no se encontró en la respuesta de red.`);
      }
    }

    // Asegurar que al menos 3 de los 5 productos coincidan
    expect(coincidencias).toBeGreaterThanOrEqual(3);
  });
});
