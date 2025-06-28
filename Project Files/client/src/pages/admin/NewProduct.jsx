import React, { useEffect, useState } from 'react'
import '../../styles/NewProducts.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewProduct = () => {

  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productMainImg, setProductMainImg] = useState('');
  const [productCarouselImg1, setProductCarouselImg1] = useState('');
  const [productCarouselImg2, setProductCarouselImg2] = useState('');
  const [productCarouselImg3, setProductCarouselImg3] = useState('');
  const [productSizes, setProductSizes] = useState([]);
  const [productGender, setProductGender] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productNewCategory, setProductNewCategory] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [productDiscount, setProductDiscount] = useState(0);

  const [AvailableCategories, setAvailableCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, [])

  const fetchCategories = async () => {
    await axios.get('http://localhost:6001/fetch-categories').then((response) => {
      const normalized = response.data.map(cat =>
        cat.toLowerCase() === 'electronic' ? 'Electronics' : cat
      );
      const unique = [...new Set(normalized)];
      setAvailableCategories(unique);
    });
  };

  const handleCheckBox = (e) => {
    const value = e.target.value;
    if (e.target.checked) {
      setProductSizes([...productSizes, value]);
    } else {
      setProductSizes(productSizes.filter(size => size !== value));
    }
  }

  const handleNewProduct = async () => {
    await axios.post('http://localhost:6001/add-new-product', {
      productName,
      productDescription,
      productMainImg,
      productCarousel: [productCarouselImg1, productCarouselImg2, productCarouselImg3],
      productSizes,
      productGender,
      productCategory,
      productNewCategory,
      productPrice,
      productDiscount
    }).then(() => {
      alert("Product added");
      setProductName('');
      setProductDescription('');
      setProductMainImg('');
      setProductCarouselImg1('');
      setProductCarouselImg2('');
      setProductCarouselImg3('');
      setProductSizes([]);
      setProductGender('');
      setProductCategory('');
      setProductNewCategory('');
      setProductPrice(0);
      setProductDiscount(0);
      navigate('/all-products');
    });
  }

  const handleCategoryUpdate = async (oldCategory, newCategory) => {
    try {
      await axios.post('http://localhost:6001/update-category-name', { oldCategory, newCategory });
      alert(`Category "${oldCategory}" updated to "${newCategory}"`);
      fetchCategories();
    } catch (err) {
      alert("Error updating category");
    }
  };

  return (
    <div className="new-product-page">
      <div className="new-product-container">
        <h3>New Product</h3>

        <div className="new-product-body">
          {/* Product Info Inputs */}
          <span>
            <div className="form-floating mb-3 span-21">
              <input type="text" className="form-control" value={productName} onChange={(e) => setProductName(e.target.value)} />
              <label>Product name</label>
            </div>
            <div className="form-floating mb-3 span-22">
              <input type="text" className="form-control" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />
              <label>Product Description</label>
            </div>
          </span>

          <div className="form-floating mb-3">
            <input type="text" className="form-control" value={productMainImg} onChange={(e) => setProductMainImg(e.target.value)} />
            <label>Thumbnail Img url</label>
          </div>

          <span>
            <div className="form-floating mb-3 span-3">
              <input type="text" className="form-control" value={productCarouselImg1} onChange={(e) => setProductCarouselImg1(e.target.value)} />
              <label>Add on img1 url</label>
            </div>
            <div className="form-floating mb-3 span-3">
              <input type="text" className="form-control" value={productCarouselImg2} onChange={(e) => setProductCarouselImg2(e.target.value)} />
              <label>Add on img2 url</label>
            </div>
            <div className="form-floating mb-3 span-3">
              <input type="text" className="form-control" value={productCarouselImg3} onChange={(e) => setProductCarouselImg3(e.target.value)} />
              <label>Add on img3 url</label>
            </div>
          </span>

          {/* Sizes */}
          <section>
            <h4>Available Size</h4>
            <span>
              {['S', 'M', 'L', 'XL'].map(size => (
                <div className="form-check" key={size}>
                  <input className="form-check-input" type="checkbox" value={size} checked={productSizes.includes(size)} onChange={handleCheckBox} />
                  <label className="form-check-label">{size}</label>
                </div>
              ))}
            </span>
          </section>

          {/* Gender */}
          <section>
            <h4>Gender</h4>
            <span>
              {['Men', 'Women', 'Unisex'].map(gender => (
                <div className="form-check" key={gender}>
                  <input className="form-check-input" type="radio" name="productGender" value={gender} onChange={(e) => setProductGender(e.target.value)} />
                  <label className="form-check-label">{gender}</label>
                </div>
              ))}
            </span>
          </section>

          {/* Category Dropdown */}
          <span>
            <div className="form-floating mb-3 span-3">
              <select className="form-select" value={productCategory} onChange={(e) => setProductCategory(e.target.value)}>
                <option value="">Choose Product category</option>
                {AvailableCategories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
                <option value="new category">New category</option>
              </select>
              <label>Category</label>
            </div>
            <div className="form-floating mb-3 span-3">
              <input type="number" className="form-control" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
              <label>Price</label>
            </div>
            <div className="form-floating mb-3 span-3">
              <input type="number" className="form-control" value={productDiscount} onChange={(e) => setProductDiscount(e.target.value)} />
              <label>Discount (%)</label>
            </div>
          </span>

          {/* New Category Input */}
          {productCategory === 'new category' && (
            <div className="form-floating mb-3">
              <input type="text" className="form-control" value={productNewCategory} onChange={(e) => setProductNewCategory(e.target.value)} />
              <label>New Category</label>
            </div>
          )}

          {/* ✨ Category Edit Section */}
          <section>
            <h4>Edit Categories</h4>
            {AvailableCategories.map((category, index) => (
              <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <input type="text" defaultValue={category}
                  onChange={(e) => {
                    const updated = [...AvailableCategories];
                    updated[index] = e.target.value;
                    setAvailableCategories(updated);
                  }} />
                <button className="btn btn-sm btn-success"
                  onClick={() => handleCategoryUpdate(category, AvailableCategories[index])}>
                  Save
                </button>
              </div>
            ))}
          </section>

        </div>

        <button className='btn btn-primary' onClick={handleNewProduct}>Add product</button>
      </div>
    </div>
  )
}

export default NewProduct
