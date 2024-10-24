import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productsList: [],
    similarProductsList: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getFormattedData = each => ({
    id: each.id,
    imageUrl: each.image_url,
    title: each.title,
    price: each.price,
    description: each.description,
    brand: each.brand,
    totalReviews: each.total_reviews,
    rating: each.rating,
    availability: each.availability,
  })

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      const updatedData = this.getFormattedData(data)
      const updatedSimilarProducts = data.similar_products.map(each =>
        this.getFormattedData(each),
      )

      this.setState({
        productsList: updatedData,
        similarProductsList: updatedSimilarProducts,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onDecrement = () => {
    const {quantity} = this.state

    if (quantity > 1) {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  onIncrement = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="product-details-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="cart-btn">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderProductDetailsView = () => {
    const {productsList, similarProductsList, quantity} = this.state
    const {
      imageUrl,
      title,
      brand,
      price,
      description,
      totalReviews,
      rating,
      availability,
    } = productsList

    return (
      <>
        <div className="product-details-card">
          <img src={imageUrl} alt="product" className="product-details-img" />
          <div className="text-card">
            <h1 className="product-details-heading">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="ratings-reviews">
              <div className="ratings-card">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="rating-img"
                />
              </div>
              <p className="reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="availability">
              Available: <p className="span">{availability}</p>
            </p>
            <p className="availability">
              Brand: <p className="span">{brand}</p>
            </p>
            <hr className="hr" />
            <div className="count-card">
              <button
                className="bs-btn"
                type="button"
                data-testid="minus"
                onClick={this.onDecrement}
              >
                <BsDashSquare />
              </button>
              <p className="count">{quantity}</p>
              <button
                className="bs-btn"
                type="button"
                data-testid="plus"
                onClick={this.onIncrement}
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-card">
          <h1 className="product-details-heading similar-products-heading">
            Similar Products
          </h1>
          <ul className="similar-products">
            {similarProductsList.map(each => (
              <SimilarProductItem key={each.id} product={each} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderProductItemDetials = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="product-details-container">
        <Header />
        <div>{this.renderProductItemDetials()}</div>
      </div>
    )
  }
}

export default ProductItemDetails
