import { getProducts } from "../get-products/get-products";
import { getVariants } from "../get-variants/get-variants";

export async function getPlans() {
  const { data: products } = await getProducts();
  const { data: variants } = await getVariants();

  const plans = variants.flatMap((variant) => {
    const product = products.find((p) => `${p.id}` === `${variant.attributes.product_id}`);

    if (!product) {
      return [];
    }

    return [
      {
        variantId: variant.id,
        variantSlug: variant.attributes.slug,
        productId: product.id,
        productSlug: product.attributes.slug,
        interval: variant.attributes.interval,
        price: variant.attributes.price,
      },
    ];
  });

  return plans;
}
