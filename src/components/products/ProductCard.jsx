import PropTypes from 'prop-types';
import { logInteraction } from '../../services/interactionService.js';

const ProductCard = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    logInteraction({
      eventType: 'product.add_to_cart',
      metadata: {
        productId: product._id ?? product.id,
        shopId: product.shopId,
        price: product.price,
        source: 'web',
      },
    });

    onAddToCart(product);
  };

  const handleViewDetails = () => {
    logInteraction({
      eventType: 'product.view',
      metadata: {
        productId: product._id ?? product.id,
        shopId: product.shopId,
        source: 'web',
      },
    });
  };

  return (
    <article
      className="flex flex-col gap-3 rounded-xl bg-white p-4 shadow-card transition hover:-translate-y-1 hover:shadow-lg"
      onClick={handleViewDetails}
      role="presentation"
    >
      <div className="flex justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
        <span className="text-sm font-medium text-brand-600">Rs. {product.price}</span>
      </div>
      <p className="text-sm text-slate-500">{product.category}</p>
      <button
        type="button"
        className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:bg-brand-600"
        onClick={handleAddToCart}
      >
        Add to cart
      </button>
    </article>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    shopId: PropTypes.string,
    name: PropTypes.string,
    category: PropTypes.string,
    price: PropTypes.number,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductCard;
