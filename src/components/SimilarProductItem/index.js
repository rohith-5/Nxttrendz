import './index.css'

const SimilarProductItem = props => {
  const {product} = props
  const {imageUrl, title, price, brand, rating} = product

  return (
    <li className="similar-products-item">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-img"
      />
      <h1 className="similar-product-title">{title}</h1>
      <p className="similar-product-brand">by {brand}</p>
      <div className="similar-product-details">
        <p className="price">Rs {price}/-</p>
        <div className="rating-container similar-container">
          <p className="rating similar-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="similar-star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
