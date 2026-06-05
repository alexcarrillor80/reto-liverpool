import { Page, Locator } from '@playwright/test';

export class SearchPage {
  // 1. Definir los tipos de los elementos (Locators)
  readonly page: Page;
  readonly searchInput: Locator;
  readonly whiteColorFilter: Locator;
  readonly sortBySelect: Locator;
  readonly productItems: Locator;

  constructor(page: Page) {
    this.page = page;
    // 2. Inicializar los selectores (Usa IDs o atributos estables)
    this.searchInput = page.locator('#mainSearchbar');
    this.whiteColorFilter = page.locator('label:has-text("Blanco")'); 
    this.sortBySelect = page.locator('#sortby');
    this.productItems = page.locator('li.m-product__card');
  }

  // 3. Definir los métodos de acción
  async navigate() {
    await this.page.goto('/');
  }

  async searchProduct(term: string) {
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
  }

  async filterByWhite() {
    await this.whiteColorFilter.scrollIntoViewIfNeeded();
    await this.whiteColorFilter.click();
    await this.page.waitForLoadState('networkidle'); // Espera a que carguen los nuevos productos
  }

  async sortByPriceLowest() {
    // Selecciona la opción por su texto visible en el menú desplegable
    await this.sortBySelect.selectOption({ label: 'Menor precio' });
    await this.page.waitForLoadState('networkidle');
  }

  async getTopProducts(count: number) {
    const products: { name: string; price: number }[] = [];
    await this.productItems.first().waitFor({ state: 'visible' });
    
    for (let i = 0; i < count; i++) {
      const item = this.productItems.nth(i);
      const name = await item.locator('h5.card-title').innerText();
      const priceText = await item.locator('p.a-card-price').innerText();
      
      // Convierte el texto "$12,499.00" a un número manipulable (12499.00)
      const price = parseFloat(priceText.replace(/[^0-9.-]+/g, ""));
      products.push({ name: name.trim(), price });
    }
    return products;
  }
}
