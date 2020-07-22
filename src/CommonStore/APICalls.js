import axios from "../axios/AxiosInstance";

export async function getAllProducts() {
    try {
        let response = await axios.get('get_products.php');
        response = response.data;
        return response.error === true ? [] : response.products;
    } catch (e) {
        return [];
    }
}

export async function getAllFabrics(lang) {
    try {
        let response = await axios.get('get_fabrics.php?lang=' + lang);
        response = response.data;
        return response.error === true ? [] : response.brands;
    } catch (e) {
        return [];
    }
}

export async function getSingleProduct(id) {
    try {
        let response = await axios.get('single_product.php?product_id=' + id);
        response = response.data;
        return response;
    } catch (e) {
        return null;
    }
}

export async function getShippingCharges() {
    try {
        let response = await axios.get('shipping_test.php');
        response = response.data;
        if (!response.error) {
            console.log(response)
            return { shippingCharges: response.shipping };
        } else {
            return { shippingCharges: null }
        }
    } catch (e) {
        return { shippingCharges: null }
    }
}
