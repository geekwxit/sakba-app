import { Language } from "../components/ChangeLanguage";
import { strings } from "../../locales/Language";
import { getAllFabrics, getAllProducts, getShippingCharges, getSingleProduct } from "./APICalls";

export default class Store {
    static store = { products: [], fabrics: [] };

    static setStore(value) {
        Store.store = { ...Store.store, ...value }
    }

    static getStore() {
        return Store.store;
    }

    static async getProducts() {
        if (Store.store.products.length > 0) {
            return Store.store.products;
        } else {
            Store.store.products = await getAllProducts();
            // debugger;
            return Store.store.products;
        }
    }

    static async getFabrics(lang) {
        if (Store.store.fabrics.length > 0) {
            Store.store.fabrics = await getAllFabrics(lang);
            return Store.store.fabrics;
        } else {
            Store.store.fabrics = await getAllFabrics(lang);
            return Store.store.fabrics;
        }
    }

    static setAppLanguage(lang) {
        Language.change(lang);
        strings.setLanguage(lang);
    }

    static getAppLanguage() {
        return strings.setLanguage(Language.get());
    }

    static async getProductDetail(id) {
        Store.setStore({ isLoading: true });
        await getSingleProduct(id)
            .then(response => response ? Store.setStore({ ...response }) : null)
            .catch(e => console.log(e))
            .finally(() => Store.setStore({ isLoading: false }))
    }

    static async getShippingCharges() {
        await getShippingCharges()
            .then(response => response ? Store.setStore({ ...response }) : null)
    }
}
