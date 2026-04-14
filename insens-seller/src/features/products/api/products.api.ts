import http from "@/shared/lib/http";
import type {
  Product,
  CreateProductPayload,
  UpdateProductPayload,
} from "@/features/products/types/products.types";
import type { PaginationParams } from "@/shared/types/api.types";

const productsApi = {
  /** shopId from session — never from URL params */
  getMyProducts: (shopId: string, params?: PaginationParams): Promise<Product[]> => {
    const query = new URLSearchParams({
      page:  String(params?.page  ?? 1),
      limit: String(params?.limit ?? 20),
    });
    return http.get(`/api/v1/shops/${shopId}/products?${query}`);
  },

  getProduct: (id: string): Promise<Product> =>
    http.get(`/api/v1/products/${id}`),

  createProduct: (payload: CreateProductPayload): Promise<Product> =>
    http.post("/api/v1/products", payload),

  updateProduct: (id: string, payload: UpdateProductPayload): Promise<Product> =>
    http.patch(`/api/v1/products/${id}`, payload),

  deleteProduct: (id: string): Promise<void> =>
    http.delete(`/api/v1/products/${id}`),
};

export default productsApi;
